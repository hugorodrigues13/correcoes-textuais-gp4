package br.com.furukawa.utils

import br.com.furukawa.model.User
import grails.core.GrailsApplication
import grails.plugin.springsecurity.SpringSecurityService
import grails.plugins.orm.auditable.Auditable

abstract class Audit implements Auditable
{
    Date dataCriacao
    Date dataAtualizacao
    String usuarioCriacao
    String usuarioAlteracao

    static SpringSecurityService springSecurityService

    static constraints = {
        usuarioCriacao nullable: true
        usuarioAlteracao nullable: true
        dataCriacao nullable: true
        dataAtualizacao nullable: true
    }

    static transients = ['springSecurityService']

    static mapping = {
        autowire true
    }

    void beforeInsert()
    {
        if( springSecurityService.principal?.hasProperty( "id" ) != null )
        {
            User user = springSecurityService.currentUser
            this.usuarioAlteracao = user?.username
            this.dataAtualizacao = new Date()
            this.usuarioCriacao = user?.username
            this.dataCriacao = new Date()
        }
        else
        {
            this.usuarioAlteracao = User.USUARIO_NAO_LOGADO_OU_SISTEMA
            this.dataAtualizacao = new Date()
            this.usuarioCriacao = User.USUARIO_NAO_LOGADO_OU_SISTEMA
            this.dataCriacao = new Date()
        }
    }

    void beforeUpdate()
    {
        if( springSecurityService.principal?.hasProperty( "id" ) != null )
        {
            User user = springSecurityService.currentUser
            this.usuarioAlteracao = user?.username
            this.dataAtualizacao = new Date()
        }
        else
        {
            this.usuarioAlteracao = User.USUARIO_NAO_LOGADO_OU_SISTEMA
            this.dataAtualizacao = new Date()
        }
    }

    static listaClassesAuditadas(GrailsApplication grailsApplication){
        def classes = grailsApplication.getArtefacts("Domain")*.clazz
        return classes?.findAll{ it.superclass == Audit.class }
    }
}
