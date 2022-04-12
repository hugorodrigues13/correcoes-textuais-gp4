package br.com.furukawa.auth

import br.com.furukawa.model.User
import br.com.furukawa.service.UserService
import grails.plugin.springsecurity.rest.credentials.AbstractJsonPayloadCredentialsExtractor
import groovy.util.logging.Slf4j
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

import javax.servlet.http.HttpServletRequest

@Slf4j
class DefaultJsonPayloadCredentialsExtractor  extends AbstractJsonPayloadCredentialsExtractor{
    String username
    String password
    String organizacao
    UserService userService

    UsernamePasswordAuthenticationToken extractCredentials(HttpServletRequest httpServletRequest) {
        def jsonBody = getJsonBody(httpServletRequest)

        if (jsonBody) {
            String username = jsonBody.username
            String password = jsonBody.password
            String organizacao =  jsonBody.organizacao
            String fornecedor =  jsonBody.fornecedor
            String token =  jsonBody.token

            if(token) {
                httpServletRequest.setProperty("usarToken", true)
                User user = userService.getUserByToken(token)
                username = user?.username
                password = token
            }

            httpServletRequest.setProperty("organizacao", organizacao)
            httpServletRequest.setProperty("fornecedor", fornecedor)
            log.debug "Extracted credentials from JSON payload. Username: ${username}, password: ${password?.size()?'[PROTECTED]':'[MISSING]'}"

            new UsernamePasswordAuthenticationToken(username, password)
        } else {
            log.debug "No JSON body sent in the request"
            return null
        }
    }
}
