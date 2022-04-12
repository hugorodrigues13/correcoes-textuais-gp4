package br.com.furukawa.auth

import groovy.transform.Canonical
import groovy.transform.CompileStatic
import org.springframework.security.web.authentication.WebAuthenticationDetails

import javax.servlet.http.HttpServletRequest

@Canonical
@CompileStatic
class OrganizationAuthenticationDetails extends WebAuthenticationDetails {
    String organizacao
    String fornecedor
    Boolean usarToken
    Locale locale

    OrganizationAuthenticationDetails(HttpServletRequest request) {
        super(request)
    }
}
