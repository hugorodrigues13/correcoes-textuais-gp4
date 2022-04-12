package br.com.furukawa.auth

import grails.converters.JSON
import grails.plugin.springsecurity.rest.oauth.OauthUser
import grails.plugin.springsecurity.rest.token.AccessToken
import grails.plugin.springsecurity.rest.token.rendering.AccessTokenJsonRenderer
import groovy.util.logging.Slf4j
import org.pac4j.core.profile.CommonProfile
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

import org.springframework.util.Assert

/**
 * Generates a JSON response like the following: <code>{"username":"john.doe","roles":["USER","ADMIN"],"access_token":"1a2b3c4d"}</code>.
 * If the principal is an instance of {@link grails.plugin.springsecurity.rest.oauth.OauthUser}, also "email" ({@link CommonProfile#getEmail()}) and
 * "displayName" ({@link CommonProfile#getDisplayName()}) will be rendered
 */
@Slf4j
class DefaultAccessTokenJsonRenderer implements AccessTokenJsonRenderer {

    /* Configuração Manual do JSON de retorno */
    String usernamePropertyName="username"
    String tokenPropertyName="access_token"
    String authoritiesPropertyName="roles"
    String permissoesPropertyName="permissoes"

    Boolean useBearerToken=true

    String generateJson(AccessToken accessToken) {
        Assert.isInstanceOf(UserDetails, accessToken.principal, "A UserDetails implementation is required")
        UserDetails userDetails = accessToken.principal as MyUserDetails

        def result = [
                (usernamePropertyName) : userDetails.username,
                (authoritiesPropertyName) : accessToken.authorities.collect { GrantedAuthority role -> role.authority },
                (permissoesPropertyName) : userDetails.getPermissoes()
        ]

        if (useBearerToken) {
            result.token_type = 'Bearer'
            result.access_token = accessToken.accessToken

            if (accessToken.expiration) {
                result.expires_in = accessToken.expiration
            }

            if (accessToken.refreshToken) result.refresh_token = accessToken.refreshToken

        } else {
            result["$tokenPropertyName"] = accessToken.accessToken
        }

        if (userDetails instanceof OauthUser) {
            CommonProfile profile = (userDetails as OauthUser).userProfile
            result.with {
                email = profile.email
                displayName = profile.displayName
            }
        }

        def jsonResult = result as JSON

        log.debug "Generated JSON:\n${jsonResult.toString(true)}"

        return jsonResult.toString()
    }
}
