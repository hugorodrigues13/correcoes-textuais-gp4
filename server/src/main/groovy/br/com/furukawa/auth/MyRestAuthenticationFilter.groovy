package br.com.furukawa.auth

import grails.plugin.springsecurity.rest.RestAuthenticationFilter
import grails.plugin.springsecurity.rest.token.AccessToken
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails

import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class MyRestAuthenticationFilter extends RestAuthenticationFilter {
    @Override
    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = request as HttpServletRequest
        HttpServletResponse httpServletResponse = response as HttpServletResponse

        //Only apply filter to the configured URL
        // "Applying authentication filter to this request"

        if (requestMatcher.matches(httpServletRequest)) {

            //Only POST is supported
            if (httpServletRequest.method != 'POST') {
                // "${httpServletRequest.method} HTTP method is not supported. Setting status to ${HttpServletResponse.SC_METHOD_NOT_ALLOWED}"
                httpServletResponse.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED)
                return
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication()
            Authentication authenticationResult

            UsernamePasswordAuthenticationToken authenticationRequest = credentialsExtractor.extractCredentials(httpServletRequest)
            authenticationRequest.details = authenticationDetailsSource.buildDetails(httpServletRequest)

            try {
                // "Trying to authenticate the request"
                authenticationResult = authenticationManager.authenticate(authenticationRequest)

                if (authenticationResult.authenticated) {
                    // "Request authenticated. Storing the authentication result in the security context"
                    // "Authentication result: ${authenticationResult}"

                    AccessToken accessToken = tokenGenerator.generateAccessToken(authenticationResult.principal as UserDetails)
                    // "Generated token: ${accessToken}"

                    tokenStorageService.storeToken(accessToken.accessToken, authenticationResult.principal as UserDetails)
                    authenticationEventPublisher.publishTokenCreation(accessToken)
                    authenticationSuccessHandler.onAuthenticationSuccess(httpServletRequest, httpServletResponse, accessToken)
                    SecurityContextHolder.context.setAuthentication(accessToken)
                } else {
                    // "Not authenticated. Rest authentication token not generated."
                }
            } catch (AuthenticationException ae) {
                // "Authentication failed: ${ae.message}"
                authenticationFailureHandler.onAuthenticationFailure(httpServletRequest, httpServletResponse, ae)
            }
        } else {
            chain.doFilter(request, response)
        }
    }
}
