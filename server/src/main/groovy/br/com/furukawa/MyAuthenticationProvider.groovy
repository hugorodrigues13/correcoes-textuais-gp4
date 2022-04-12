package br.com.furukawa

import br.com.furukawa.model.User
import br.com.furukawa.service.UserService
import grails.plugin.springsecurity.userdetails.GrailsUser
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.GrantedAuthority

class MyAuthenticationProvider implements AuthenticationProvider {
	def springSecurityService
	UserService userService

	@Override
	Authentication authenticate(Authentication customAuth) {
		User.withTransaction { status ->
			User user = User.findByUsername(customAuth.principal)
			if (user) {
				if(user.enabled){
					if (user?.password == springSecurityService.encodePassword(customAuth.credentials)) {

						Collection<GrantedAuthority> authorities = user.authorities.collect {
							new SimpleGrantedAuthority(it.authority)
						}
						def userDetails = new GrailsUser(user.username, user.password, true, true, true, true, authorities, user.id)

						def token = new UsernamePasswordAuthenticationToken(userDetails, user.password, userDetails.authorities)

						token.details = customAuth.details
						return token
				}
				} else
					throw new BadCredentialsException("Log in failed - identity could not be verified")
			}
			else { return null }
		}
	}

	@Override
	boolean supports(Class<? extends Object> aClass) {
		return true

	}
}
