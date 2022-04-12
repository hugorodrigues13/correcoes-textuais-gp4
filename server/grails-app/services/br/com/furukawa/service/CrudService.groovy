package br.com.furukawa.service

import br.com.furukawa.auth.MyUserDetails
import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.Status
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Requestmap
import br.com.furukawa.model.Role
import br.com.furukawa.model.User
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.SpringSecurityUtils
import org.hibernate.SQLQuery
import org.springframework.dao.DataIntegrityViolationException

@Transactional
class CrudService {

    def sessionFactory
    def springSecurityService
    def mensagemService

    boolean salvar(def instance){
        instance.save(flush: true, failOnError: true)
    }

    boolean ativarOuDesativar(def instance, boolean status){
        if(instance) {
            instance.isAtivo = status
            instance.save(flush: true, failOnError: true)
        }
        return instance
    }

    def reativar(def instance, Locale locale, Object statusPosAtivacao = Status.PENDENTE ){
        def model = [:]
        model.put('entityInstance', {})
        def pendente = instance.getPendente()
        if(pendente) {
            model.put('code', 422)
            model.put('msg', montaMensagemDeResposta(TipoMensagem.ERROR_TYPE,'default.ativar.inativoPendente.label' , locale))
            return model
        } else {
            def novo = instance.clonar()
            novo.versao = instance.getVersaoMaxima() + 1
            novo.status = statusPosAtivacao
            model.put('instance', novo)
            salvar(novo)
            model.put('entityInstance', novo)
            model.put('msg', montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE,'default.updated.message' , locale))
            return model
        }
    }

    boolean excluir(def instance) {
        Boolean registroExcluido = true

        User.withNewTransaction {
            try {
                instance.refresh()
                instance.delete(flush: true)
            } catch (DataIntegrityViolationException e) {
                registroExcluido = false
            }
        }

        return registroExcluido
    }

    Locale getLocale(String lang){
        return Idioma.getLocale( lang )
    }

    def montaListaDeErrors(allErrors, locale){
        def messages = allErrors.collect { e->
            String className = e.getObjectName().split("\\.").last()
            String code= className[0].toLowerCase() + className.substring(1) + "." + e.getField() + "." + e.getCode()
            String mensagem = mensagemService.getMensagem(code, e.defaultMessage, e.arguments, locale)
            [
                    message: mensagem,
                    field: e.getField(),
                    type: "warning"
            ]
        }
        return [messages: messages]
    }

    def montaListaDeMensagens(allErrors, locale){
        def messages = allErrors.collect { e->
            String mensagem = mensagemService.getMensagem(e.code, null, e.arguments, locale)
            [
                    message: mensagem,
                    type: e.type.name()
            ]
        }
        return [messages: messages]
    }

    def montaMensagem(TipoMensagem type, String code, Object[] args){
        return [
                code: code,
                type: type,
                arguments: args
        ]
    }


    def montaMensagemDeResposta(TipoMensagem type, String code, Locale locale, String timeout = null){
        return montaMensagemDeRespostaCompleta(type, code, null, locale,timeout)
    }

    def montaMensagemDeRespostaCompleta(TipoMensagem type, String code, Object[] args, Locale locale, String timeout = null, String cor = null){
        return ['messages': [['type': type?.name(), 'message': mensagemService.getMensagem(code, null, args, locale), 'timeout':timeout, 'cor': cor]]]
    }

    void removeAcessosDaAutoridade( String autoridade )
    {
        String sql
        SQLQuery query
        Set<Requestmap> acessos

        sql = """
            SELECT
                id
            FROM
                requestmap
            WHERE
                config_attribute LIKE '$autoridade' OR
                config_attribute LIKE '$autoridade, %' OR
                config_attribute LIKE '%, $autoridade, %' OR
                config_attribute LIKE '%, $autoridade'
        """

        println "sql removeAcessosDaAutoridade( $autoridade )\n$sql"

        query = sessionFactory.currentSession.createSQLQuery( sql )

        acessos = Requestmap.getAll( query.list() )

        acessos.each{ acesso ->
            List perfis = SpringSecurityUtils.parseAuthoritiesString( acesso.configAttribute ).findAll{
                !it.role.equals( autoridade )
            }

            acesso.setConfigAttribute( SpringSecurityUtils.authoritiesToRoles( perfis ).join( ", " ) )
            if (acesso.validate())
                acesso.save( failOnError: true )
        }
    }

    Boolean salvarPerfil(Role role, List<Requestmap> permissoes, String nomeAntigo) {
        if( role.id != null )
        {
            removeAcessosDaAutoridade( nomeAntigo ?: role.nome )
        }

        permissoes.each {
            incluiAutoridadeRequestmap(it, role.authority)
        }
        springSecurityService.clearCachedRequestmaps()

        return role.save( flush: true )
    }

    def incluiAutoridadeRequestmap(Requestmap requestmap, String autoridade) {
        def roles = SpringSecurityUtils.parseAuthoritiesString(requestmap.configAttribute)
        roles.add(autoridade)
        String configAtt = roles
        configAtt = configAtt.replace("[", "").replace("]", "")
        requestmap.setConfigAttribute(configAtt)
        requestmap.save()
    }

    @Transactional(readOnly = true)
    Organizacao getOrganizacaoLogada() {
        return (springSecurityService.principal as MyUserDetails).getOrganizacao()
    }

    @Transactional(readOnly = true)
    Fornecedor getFornecedorLogado() {
        return (springSecurityService.principal as MyUserDetails).getFornecedor()
    }

    List<Object> separaListaGrupos1000(List<Object> lista) {
        List<Object> sublistasDe1000 = new ArrayList<Object>()

        if (lista?.size() > 0) {
            for (int i = 0; i <= lista.size() / 1000; i++) {
                if ((i + 1) * 1000 <= lista.size()) {
                    sublistasDe1000.add(lista.subList(i * 1000, (i + 1) * 1000))
                } else {
                    sublistasDe1000.add(lista.subList(i * 1000, lista.size()))
                }
            }
        }

        return sublistasDe1000
    }
}
