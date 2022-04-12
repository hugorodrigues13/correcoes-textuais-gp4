package br.com.furukawa.controller

import br.com.furukawa.auth.DefaultAccessTokenJsonRenderer
import br.com.furukawa.auth.MyUserDetails
import br.com.furukawa.dtos.DadosEmailAlteracaoUsuarioDTO
import br.com.furukawa.enums.Status
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.enums.TipoPaginaColunas
import br.com.furukawa.exceptions.UserException
import br.com.furukawa.model.Acesso
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Role
import br.com.furukawa.model.User
import br.com.furukawa.model.UserRole
import br.com.furukawa.model.UsuarioColunas
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.MensagemService
import br.com.furukawa.service.MyUserDetailsService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.UserService
import grails.converters.JSON
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.SpringSecurityService
import grails.plugin.springsecurity.annotation.Secured
import grails.plugin.springsecurity.rest.token.AccessToken
import grails.plugin.springsecurity.rest.token.generation.TokenGenerator
import grails.plugins.mail.MailService
import grails.web.http.HttpHeaders
import net.minidev.json.JSONArray
import org.springframework.security.core.userdetails.UserDetails

import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

@Secured(["ROLE_ADMINISTRADOR"])
class UserController extends CrudController
{
    MailService mailService
    SpringSecurityService springSecurityService
    MyUserDetailsService myUserDetailsService
    MensagemService mensagemService
    UserService userService
    TokenGenerator tokenGenerator

    OracleService oracleService

    UserController(){
        super(User)
    }

    def query = {
        if (params.username){
            tLike('username', '%' + params.username + '%', delegate)
        }

        if(params.fullname){
            tLike('fullname', '%' + params.fullname + '%', delegate)
        }

        if(params.matricula){
            tLike('matricula', '%' + params.matricula + '%', delegate)
        }

        if(params.perfil) {
            List<Role> roles = Role.createCriteria().list {
                tLike('nome', '%' + params.perfil + '%', delegate)
            }

            if(roles && !roles.isEmpty()) {
                List<UserRole> userRoleList = UserRole.findAllByRoleInList(roles)

                if(userRoleList && !userRoleList.isEmpty()) {
                    'in'('id', userRoleList*.userId)
                } else {
                    isNull('id')
                }
            } else {
                isNull('id')
            }
        }

        if(params.acesso) {
            acessos {
                tLike('nome', '%' + params.acesso + '%', delegate)
            }
        }

        if(params.matricula){
            tLike('matricula', '%' + params.matricula + '%', delegate)
        }

        if( params.status ) {
            if(params.status == 'INATIVO'){
                eq( 'enabled', false)
            } else if(params.status != 'TODOS'){
                eq( 'enabled', params.status as Status == Status.ATIVO )
            }
        }

        if(params.sort){
            order(params.sort, params.order)
        }else{
            order( 'username' )
        }
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        params.offsetBusca = params.offsetBusca?:0
        def criteria = User.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def model = [:]

        model.put("perfis", userService.perfilPermitidoByUser())
        model.put("acessos", userService.acessoPermitidoByUser())
        model.put("entities", entities)
        model.put("total", entities.totalCount)

        respond model
    }

    def editarColunas(){
        params.putAll(getParametros())
        TipoPaginaColunas tipo = params.tipo as TipoPaginaColunas
        List<String> colunas = params.colunas

        userService.editarColunas(tipo, colunas)
    }

    def getColunas(){
        TipoPaginaColunas tipo = params.tipo as TipoPaginaColunas

        respond userService.getUsuarioLogado().getUsuarioColunas(tipo)
    }

    def getModelPadrao(){
        def perfil = userService.perfilPermitidoByUser()
        def acesso = userService.acessoPermitidoByUser()
        def model = [:]
        model.put("perfis", perfil)
        model.put("acessos", acesso)
        model.put("planejadores", oracleService.getPlanejadores(getOrganizacaoLogada()))
        model.put("organizacoes", Organizacao.findAll())
        return model
    }

    @Override
    def prepareNew() {
        def model = getModelPadrao()
        model["entityInstance"]= entity.newInstance(params)
        respond model
    }

    @Override
    def prepareEdit(){
        User entityInstance = entity.get(params.id)
        if(entityInstance == null){
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.not.found.message", getLocale()) as JSON
            return
        }
        def model = getModelPadrao()

        boolean usuarioPossuiPermissaoByRole = entityInstance.role.every {model.perfis*.id.contains(it.id)}
        boolean usuarioPossuiPermissaoByAcesso = entityInstance.acessos.every {model.acessos*.id.contains(it.id)}

        if(!usuarioPossuiPermissaoByRole || !usuarioPossuiPermissaoByAcesso){
            render status: 403, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "user.semPermissaoParaEditar.message", crudService.getLocale()) as JSON
        } else {
            model.put('entityInstance', entityInstance)
            respond model
        }
    }

    @Override
    def getInstanceEntity(){
        println params
        def entityInstance
        if(params.id){
            entityInstance = User.get(params.id)
            if(!params.getBoolean('alteraSenha')) {
                params.password = entityInstance.password
            }
            entityInstance.properties = params
        } else {
            entityInstance = entity.newInstance(params)

            String chave = "gpa_user${entityInstance.username}"
            String username = entityInstance.username

            byte[] key = chave.getBytes("UTF-8")
            key = Arrays.copyOf(key, 32)
            SecretKeySpec secretKey = new SecretKeySpec(key, "AES")

            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
            cipher.init(Cipher.ENCRYPT_MODE, secretKey)

            if(username) {
                String token = Base64.getEncoder().encodeToString(cipher.doFinal(username.getBytes("UTF-8")))
                entityInstance.token = token
            }
        }
        entityInstance
    }

    @Transactional
    def delete() {
        if(handleReadOnly()) {
            return
        }
        User instance = User.get(params.id)
        if (instance == null) {
            notFound()
            return
        }
        beforeDelete(instance)
        if(instance.isRemovivel){
            if ( userService.excluir(instance) ) {
                respond userService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE,'default.deleted.message' , params.locale)
            }else{
                userService.ativarOuDesativar(instance, false)
                respond userService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'default.inactived.message', params.locale)
                return
            }
        }else{
            userService.ativarOuDesativar(instance, false)
            respond userService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'default.denied.delete.message', params.locale)
        }

    }

    void beforeDelete(Object instance){
        if(springSecurityService.currentUser?.id== instance.id){
            throw new UserException( "user.remocaoUsuarioLogado.message" )
        }
    }

    @Transactional
    def save() {
        params.putAll(getParametros())
        Boolean emailConfirmacao = true
        if(handleReadOnly()) {
            return
        }

        User instance = getInstanceEntity()

        DadosEmailAlteracaoUsuarioDTO emailAlteracoesUsuarioDTO = getEmailAlteracoesDTO()

        List<Role> perfis = userService.perfilPermitidoByUser()
        List<Acesso> acessos = userService.acessoPermitidoByUser()

        boolean usuarioPossuiPermissaoByRole = params.perfil.every {perfis*.id.contains(it.toLong())}
        boolean usuarioPossuiPermissaoByAcesso = params.acessos.every {acessos*.id.contains(it.toLong())}

        if(!usuarioPossuiPermissaoByRole || !usuarioPossuiPermissaoByAcesso){
            render status: 403, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "user.semPermissaoParaEditar.message", crudService.getLocale()) as JSON
            return
        }

        if (instance.errors.allErrors.size() > 0 || !instance.validate()) {
            render status: 422, userService.montaListaDeErrors(instance.errors.allErrors, params.locale) as JSON
            return
        }

        crudService.salvar(instance)

        if (params.perfil) {


            if (params.id)
                UserRole.removeAll(instance)

            params.perfil.each { role ->
                def roleCad = Role.get(role)
                UserRole.create instance, roleCad, true
            }

            if (springSecurityService.isLoggedIn() && instance.username.equals(springSecurityService.principal.username)) {
                springSecurityService.reauthenticate instance.username
            }
        }

        if (emailAlteracoesUsuarioDTO) {
            try {
                Locale locale = getLocale()
                enviarEmailAposSalvar(emailAlteracoesUsuarioDTO, locale)
            } catch (Exception e) {
                print e
                emailConfirmacao = false
                crudService.salvar(instance)
            }
        }

        afterSave(instance, emailConfirmacao)
    }


    def afterSave(User instance, Boolean emailConfirmacao){
        response.addHeader(HttpHeaders.LOCATION,
                grailsLinkGenerator.link(resource: this.controllerName, action: 'show', id: instance.id, absolute: true,
                        namespace: hasProperty('namespace') ? this.namespace : null))

        String mensagem = params.id ? 'default.updated.message' : 'default.created.message'

        if(emailConfirmacao == false) {
            render status: 200, userService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'user.criadoSemEmailConfirmacao.message', params.locale) as JSON
        } else {
            render status: 200, userService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, mensagem, params.locale) as JSON
        }
    }

    @Override
    def ativarOuDesativar(){
        params.putAll(getParametros())

        def currentUser = springSecurityService.principal as MyUserDetails
        if(currentUser.id == params.getLong("id")){
            throw new UserException( "user.remocaoUsuarioLogado.message" )
        }else {
            User user = User.get(params.id as long)
            userService.ativarOuDesativar(user, !user.enabled)
            afterSave(user)
        }
    }

    JSON getUsuarioLogado(){
        Map map = [:]
        User user = springSecurityService.currentUser
        List<UserRole> userRoles = UserRole.findAllByUser(user)

        map.id = user.id
        map.fullname = user.fullname
        map.email = user.email
        map.perfis = userRoles.roleId

        render map as JSON
    }

    def perfil() {
        def model = [:]
        User user = userService.getUsuarioLogado()

        model.put("entityInstance", user)
        model.put("perfis", Role.findAll().sort { it.authority })
        model.put("planejadores", oracleService.getPlanejadores(getOrganizacaoLogada()))
        model.put("organizacoes", Organizacao.findAll())
        respond model
    }


    @Secured(['permitAll'])
    def getUsernameUsuario() {
        User user = springSecurityService.currentUser

        respond(username: user.username)
    }

    DadosEmailAlteracaoUsuarioDTO getEmailAlteracoesDTO() {
        DadosEmailAlteracaoUsuarioDTO dto
        if(params.id) {
            User usuario = User.get(params.id)
            boolean alterouSenha = params.getBoolean('isAlterarSenha') && usuario.password != params.password
            boolean alterouLogin = usuario.username != params.username
            boolean confereSenhaAtual = usuario.password == params.oldpassword

            boolean houveAlteracao = (alterouLogin || alterouSenha) && confereSenhaAtual
            if(houveAlteracao) {
                dto = new DadosEmailAlteracaoUsuarioDTO()
                dto.mensagemService = mensagemService
                dto.nomeUsuario = params.fullname
                dto.isEdicao = true
                dto.login = alterouLogin ? params.username : null
                dto.senha = alterouSenha ? params.password : null
            }
        } else {
            dto = new DadosEmailAlteracaoUsuarioDTO()
            dto.mensagemService = mensagemService
            dto.nomeUsuario = params.fullname
            dto.isEdicao = false
            dto.login = params.username
            dto.senha = params.password
        }

        return dto
    }

    @Secured(['permitAll'])
    def salvarDadosDoUsuario() {
        params.putAll(getParametros())
        if(handleReadOnly()) {
            return
        }

        User usuarioLogado = springSecurityService.currentUser
        User usuario = User.get(params?.id)
        if (usuario != usuarioLogado && !usuarioLogado.isAdmin()){
            render status: 403, userService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'default.accesDenied.message', params.locale) as JSON
            return
        }
        String oldPassword = springSecurityService.encodePassword(params?.oldpassword)

        if(params.getBoolean("alteraSenha") && usuario?.password != oldPassword) {
            render status: 200, userService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'user.senhasNaoBatem.message', params.locale) as JSON
            return
        }else {

            DadosEmailAlteracaoUsuarioDTO emailAlteracoesUsuarioDTO = getEmailAlteracoesDTO()

            User instance = getInstanceEntity()

            if (instance.errors.allErrors.size() > 0 || !instance.validate()) {
                render status: 422, userService.montaListaDeErrors(instance.errors.allErrors, params.locale) as JSON
                return
            }

            crudService.salvar(instance)

            if (emailAlteracoesUsuarioDTO) {
                Locale locale = crudService.getLocale(params.locale)
                enviarEmailAposSalvar(emailAlteracoesUsuarioDTO, locale)
            }

            afterSave(instance)
        }
    }

    void enviarEmailAposSalvar(DadosEmailAlteracaoUsuarioDTO dto, Locale locale) {
        try {
            mailService.sendMail {
                to params.email
                subject dto.getAssunto(locale)
                html view: "/email/email", model: ["assunto": dto.getAssunto(locale), "exception": dto.getConteudo(locale)]
            }
        }catch(e){}
    }

    def getOrganizacoes(){
        respond Organizacao.getAll()
    }

    def userException(final UserException exception){
        logException exception
        respond userService.montaMensagemDeResposta( TipoMensagem.ERROR_TYPE, exception.getMessage(), params.locale )
    }

    def changeOrganizacao(){
        def model = [:]
        MyUserDetails user = springSecurityService.principal as MyUserDetails
        if (!userService.isUsuarioOrganizacao(user.getUsername(), params.organizacaoId)){
            render status: 400, userService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "user.organizacao.change.falha.message", params.locale) as JSON
            return
        }
        List<String> permissoes = userService.permissoesByUser( user ) as List<String>
        user.set_organizacaoSelecionada(params.organizacaoId)
        user.setPermissoes(permissoes)
        springSecurityService.reauthenticate(user.getUsername())
        AccessToken tokenValue = tokenGenerator.generateAccessToken(user)

        DefaultAccessTokenJsonRenderer defaultAccessTokenJsonRenderer = new DefaultAccessTokenJsonRenderer()

        model.put("token", JSON.parse(defaultAccessTokenJsonRenderer.generateJson(tokenValue)))
        model.put("fornecedores", user.getFornecedores())

        respond model
    }

    def changeFornecedor(){
        MyUserDetails user = springSecurityService.principal as MyUserDetails
        List<String> permissoes = userService.permissoesByUser( user ) as List<String>
        user.set_fornecedorSelecionado(params.fornecedorId)
        user.setPermissoes(permissoes)
        springSecurityService.reauthenticate(user.getUsername())
        AccessToken tokenValue = tokenGenerator.generateAccessToken(user)

        DefaultAccessTokenJsonRenderer defaultAccessTokenJsonRenderer = new DefaultAccessTokenJsonRenderer()
        render defaultAccessTokenJsonRenderer.generateJson(tokenValue)
    }

    @Secured(['permitAll'])
    def getAcessosDoUsuario() {
        def model = [:]
        MyUserDetails user = springSecurityService.principal as MyUserDetails

        model.put('organizacao', user._organizacaoSelecionada)
        model.put('fornecedor', user._fornecedorSelecionado)
        model.put('organizacoes', user.getOrganizacoes().unique())
        model.put('fornecedores', user.getFornecedores().unique())

        respond model
    }

    def getLinguagemPadraoUsuario() {
        User user = userService.getUsuarioLogado()

        def model = [:]
        model.put('linguagem', user.linguagem)

        respond model
    }

    def getRecursoPeloId() {
        GrupoRecurso grupoRecurso = GrupoRecurso.get( params.id )
        def model = ["entity": grupoRecurso]

        respond model
    }
}
