package br.com.furukawa

import br.com.furukawa.model.User
import grails.plugins.orm.auditable.resolvers.AuditRequestResolver
import org.grails.web.servlet.mvc.GrailsWebRequest

class DefaultAuditRequestResolver implements AuditRequestResolver {

    def userService

    @Override
    String getCurrentActor() {
        if( userService.springSecurityService.principal ) {
            return userService.springSecurityService.principal.username
        } else {
            return User.USUARIO_NAO_LOGADO_OU_SISTEMA
        }
    }

    @Override
    String getCurrentURI() {
        GrailsWebRequest request = GrailsWebRequest.lookup()
        request?.request?.requestURI
    }
}