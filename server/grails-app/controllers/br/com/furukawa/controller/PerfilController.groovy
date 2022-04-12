package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Requestmap
import br.com.furukawa.model.Role
import br.com.furukawa.model.User
import grails.converters.JSON
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.SpringSecurityService
import net.minidev.json.JSONArray
import net.minidev.json.JSONObject

import java.text.Normalizer

class PerfilController extends CrudController{

    def userService
    SpringSecurityService springSecurityService

    def query ={
        if (params.nome){
            tLike('nome', '%' + params.nome + '%', delegate)
        }

        if (params.descricao){
            tLike('descricao', '%' + params.descricao + '%', delegate)
        }

        if(params.sort){
            order(params.sort, params.order)
        }else{
            order( 'nome' )
        }
    }

    PerfilController() {
        super(Role)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = Role.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def model = [:]

        model.put('entities', entities)
        model.put("total", entities.totalCount)

        respond model
    }

    @Transactional
    def delete() {
        if(handleReadOnly()) {
            return
        }
        Role instance = Role.get(params.id)
        if (instance == null) {
            notFound()
            return
        }
        instance.delete()
        respond userService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE,'default.deleted.message' , params.locale)

    }

    @Override
    def prepareEdit() {
        def entityInstance = Role.get(params.id)
        if(entityInstance == null){
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.not.found.message", getLocale()) as JSON
            return;
        }

        def model = [:]
        List<Requestmap> areas = Requestmap.findAllByConfigAttributeNotEqual( 'permitAll' )

        areas.removeAll( Requestmap.acessoComum() )

        model.put('permissoes', getPermissoes())
        model.put('entityInstance', entityInstance)
        model.put('permissoesInstance', entityInstance.getAcessosPermitidosSemFilhos( areas )*.id)
        respond model
    }

    @Override
    def prepareNew() {
        def model = [:]
        model.put('permissoes', getPermissoes())
        model["entityInstance"]= entity.newInstance(params)
        respond model
    }

    def getPermissoes(){
        def checkSelected
        List acessosPermitidos = new ArrayList<Requestmap>()

        List<Requestmap> acessosDisponiveis = Requestmap.findAllByConfigAttributeNotEqual( 'permitAll' )
        acessosDisponiveis.removeAll( Requestmap.acessoComum() )

        if(  params.id != null ){
            Role role = Role.get( params.id );
            acessosPermitidos = role?.acessoPermitido(acessosDisponiveis)
        }

        JSONArray acessos = new JSONArray()

        acessosDisponiveis.sort { it.descricao }.each {
            checkSelected = false

            if( acessosPermitidos != null && acessosPermitidos.contains( it ) && ( it.filhos.size() == 0 || acessosPermitidos.contains( it.filhos ) ) ){
                checkSelected = true
            }

            def acesso = new JSONObject()
            acesso.id = it.id
            acesso.parent = it.parent?.id ?: "0"
            acesso.text = it.descricao
            acesso.state = ['opened' : false, 'selected' : checkSelected]
            acesso.icon = false
            acessos.add( acesso )
        }

        return acessos
    }

    def permissoesByUser(){

        def user = springSecurityService.currentUser
        def id = user.role.id
        List acessosPermitidos = new ArrayList<Requestmap>()
        List<Requestmap> acessosDisponiveis = Requestmap.findAllByConfigAttributeNotEqual( 'permitAll' )
        acessosDisponiveis.removeAll( Requestmap.acessoComum() )

        if(  id != null ){
            Role role = Role.get( id );
            acessosPermitidos = role?.acessoPermitido(acessosDisponiveis)
        }

        def model = [:]
        model.put('permissoes', acessosPermitidos*.descricao)
        respond model
    }

    @Transactional
    def save() {
        params.putAll(getParametros())
        if(handleReadOnly()) {
            return
        }
        String nomeAntigo = Role.findById( params.id )?.authority
        Role instance = getInstanceEntity()
        String prefixoAuthority = 'ROLE_'
        String nome = instance.nome

        if( nome?.length() > 0 ){
            if( nome.getAt(0) != " " && nome.getAt(0) != "_" ) {
                instance.authority = prefixoAuthority + removerAcentosEDeixarCaixaAlta( nome ).replaceAll( prefixoAuthority, '' )
            }
        }
        if (!instance.validate()) {
            transactionStatus.setRollbackOnly()
            render status: 422, userService.montaListaDeErrors(instance.errors.allErrors, params.locale) as JSON
        }
        else
        {
            crudService.salvarPerfil(instance, getPermissoesSalvar(), nomeAntigo)
            afterSave(instance)
        }
    }

    String removerAcentosEDeixarCaixaAlta( String nome )
    {
        return Normalizer.normalize( nome.toLowerCase(), Normalizer.Form.NFD).replaceAll( "[^\\p{ASCII}]", '' ).toUpperCase().replaceAll( ' ', '_' )
    }


    List<Requestmap> getPermissoesSalvar(){
        def permissoesIDs = params.permissoes
        List<Requestmap> permissoes = new ArrayList<Requestmap>()

        permissoesIDs?.each() {
            if( it != "0" && it != 0 )
            {
                Requestmap acesso = Requestmap.get( it )
                permissoes.add( acesso )

                if( acesso?.parent && !permissoes.contains( acesso.parent ) )
                {
                    permissoes.add( acesso.parent )
                }
            }
        }

        return permissoes
    }


}
