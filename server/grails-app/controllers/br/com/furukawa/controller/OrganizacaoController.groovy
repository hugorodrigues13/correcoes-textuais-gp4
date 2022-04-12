package br.com.furukawa.controller

import br.com.furukawa.model.Organizacao
import br.com.furukawa.service.MyUserDetailsService
import grails.plugin.springsecurity.SpringSecurityService

class OrganizacaoController {
    MyUserDetailsService myUserDetailsService
    SpringSecurityService springSecurityService

    def getOrganizacoes(){
        respond Organizacao.list( sort: "id" )
    }
}
