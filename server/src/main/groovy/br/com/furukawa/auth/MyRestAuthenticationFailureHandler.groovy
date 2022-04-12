package br.com.furukawa.auth

import grails.plugin.springsecurity.rest.RestAuthenticationFailureHandler
import groovy.json.JsonBuilder
import org.springframework.security.core.AuthenticationException

import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class MyRestAuthenticationFailureHandler extends RestAuthenticationFailureHandler {
    @Override
    void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        response.setStatus(401)
        response.addHeader('WWW-Authenticate', 'Bearer')

        String msg = exception.getMessage()
        PrintWriter out = response.getWriter()
        response.setContentType("aplication/json")
        response.setCharacterEncoding("UTF-8")
        out.print(new JsonBuilder([message: msg]).toString())
        out.flush()
    }
}
