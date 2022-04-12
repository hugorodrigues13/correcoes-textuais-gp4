package br.com.furukawa.auth

import br.com.furukawa.exceptions.LoginException
import br.com.furukawa.service.UserService
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.util.Assert

class AuthenticationProvider extends DaoAuthenticationProvider {

    UserService userService

    protected void additionalAuthenticationChecks(UserDetails userDetails,
                                                  UsernamePasswordAuthenticationToken authentication)
            throws AuthenticationException {
        Object details = authentication.details

        if(!details?.usarToken) {
            super.additionalAuthenticationChecks(userDetails, authentication)
        }

        List<String> permissoes = userService.permissoesByUser( userDetails ) as List<String>
        userDetails.setPermissoes(permissoes)
        if(details.organizacao && details.fornecedor) {
            userDetails.changeCampos(details.organizacao as String, details.fornecedor as String)
        }
    }

    @Override
    Authentication authenticate(Authentication authentication)
            throws AuthenticationException {
        Object details = authentication.details

        Assert.isInstanceOf(UsernamePasswordAuthenticationToken.class, authentication,
                { ->
                    messages.getMessage(
                            "AbstractUserDetailsAuthenticationProvider.onlySupports",
                            "Only UsernamePasswordAuthenticationToken is supported")
                })

        // Determine username
        String username = (authentication.getPrincipal() == null) ? "NONE_PROVIDED"
                : authentication.getName()

        boolean cacheWasUsed = true
        UserDetails user = this.userCache.getUserFromCache(username)

        if (user == null) {
            cacheWasUsed = false

            try {
                user = retrieveUser(username,
                        (UsernamePasswordAuthenticationToken) authentication)
            }
            catch (UsernameNotFoundException notFound) {
                logger.debug("User '" + username + "' not found")

                throw new LoginException(messages.getMessage(
                        "autenticacao.usuarioInexistente.message",
                        "Bad credentials",
                        details.locale as Locale))
            }

            Assert.notNull(user,
                    "retrieveUser returned null - a violation of the interface contract")
        }

        try {
            preAuthenticationChecks.check(user)
            additionalAuthenticationChecks(user,
                    (UsernamePasswordAuthenticationToken) authentication)
        }
        catch (AuthenticationException exception) {
            if (cacheWasUsed) {
                // There was a problem, so try again after checking
                // we're using latest data (i.e. not from the cache)
                cacheWasUsed = false
                user = retrieveUser(username,
                        (UsernamePasswordAuthenticationToken) authentication)
                preAuthenticationChecks.check(user)
                additionalAuthenticationChecks(user,
                        (UsernamePasswordAuthenticationToken) authentication)
            }
            else {
                if(!(exception instanceof LoginException)) {
                    throw new BadCredentialsException(messages.getMessage(
                            "autenticacao.senhaInvalida.message",
                            "Bad credentials",
                            details.locale as Locale))
                } else {
                    throw exception
                }
            }
        }

        postAuthenticationChecks.check(user)

        if (!cacheWasUsed) {
            this.userCache.putUserInCache(user)
        }

        Object principalToReturn = user

        if (forcePrincipalAsString) {
            principalToReturn = user.getUsername()
        }

        return createSuccessAuthentication(principalToReturn, authentication, user)
    }




}
