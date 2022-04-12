package br.com.furukawa.auth

import br.com.furukawa.enums.Idioma
import groovy.transform.CompileStatic
import org.springframework.security.web.authentication.WebAuthenticationDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource

import javax.servlet.http.HttpServletRequest

@CompileStatic
class AuthenticationDetailsSource extends WebAuthenticationDetailsSource {
    @Override
    WebAuthenticationDetails buildDetails(HttpServletRequest context) {
        def details = new OrganizationAuthenticationDetails(context)

        details.organizacao = obtainOrganization(context)
        details.fornecedor = obtainFornecedor(context)
        details.usarToken = obtainUsarToken(context)
        details.locale = obtainLocale(context)

        details
    }

    /**
     * Get the Organization from the request.
     * @param request
     * @return
     */
    private static String obtainOrganization(HttpServletRequest request) {
        return request.getProperty("organizacao")
    }

    private static String obtainFornecedor(HttpServletRequest request) {
        return request.getProperty("fornecedor")
    }

    private static Boolean obtainUsarToken(HttpServletRequest request) {
        return request.getProperty("usarToken")
    }

    private static Locale obtainLocale(HttpServletRequest request) {
        return Idioma.getLocale(request.getHeader("locale") ?: "pt_BR")
    }
}