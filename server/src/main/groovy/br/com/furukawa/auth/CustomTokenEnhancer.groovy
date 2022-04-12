package br.com.furukawa.auth

import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.JWSSigner
import com.nimbusds.jose.crypto.MACSigner
import com.nimbusds.jwt.JWT
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import grails.plugin.springsecurity.rest.token.AccessToken
import grails.plugin.springsecurity.rest.token.generation.jwt.AbstractJwtTokenGenerator
import groovy.time.TimeCategory
import groovy.util.logging.Slf4j
import org.springframework.security.core.userdetails.UserDetails

@Slf4j
class CustomTokenEnhancer extends AbstractJwtTokenGenerator {

    Integer defaultExpiration = 36000

    String jwtSecret = '3b7f220f0674f4281120b4f7aa7997e9210cb9c5a0e1ea93cd098d1b824fa694'

    JWSSigner signer = new MACSigner(jwtSecret)

    @Override
    protected JWT generateAccessToken(JWTClaimsSet claimsSet) {
        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet)
        signedJWT.sign(signer)

        return signedJWT
    }

    @Override
    AccessToken generateAccessToken(UserDetails details, boolean withRefreshToken, Integer expiration = this.defaultExpiration) {
        log.debug "Serializing the principal received"
        String serializedPrincipal = serializePrincipal(details as MyUserDetails)
        if (!expiration){
            expiration = this.defaultExpiration
        }
        JWTClaimsSet.Builder builder = generateClaims(details as MyUserDetails, serializedPrincipal, expiration)

        log.debug "Generating access token..."
        String accessToken = generateAccessToken(builder.build()).serialize()

        String refreshToken
        if (withRefreshToken) {
            log.debug "Generating refresh token..."
            refreshToken = generateRefreshToken(details, serializedPrincipal, expiration).serialize()
        }

        return new AccessToken(details as MyUserDetails, details.authorities, accessToken, refreshToken, expiration)
    }

    JWTClaimsSet.Builder generateClaims(UserDetails details, String serializedPrincipal, Integer expiration) {
        JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder()
        builder.subject(details.username)

        log.debug( "Setting expiration to ${expiration}")
        Date now = new Date()
        builder.issueTime(now)
        use(TimeCategory) {
            builder.expirationTime(now + expiration.seconds)
        }

        builder.claim('roles', details.authorities?.collect { it.authority })
        builder.claim('principal', serializedPrincipal)

        log.debug( "Generated claim set: ${builder.build().toJSONObject().toString()}")
        return builder
    }

    protected JWT generateRefreshToken(UserDetails principal, String serializedPrincipal, Integer expiration) {
        JWTClaimsSet.Builder builder = generateClaims(principal as MyUserDetails, serializedPrincipal, expiration)
        builder.expirationTime(null)

        return generateAccessToken(builder.build())
    }


    protected String serializePrincipal(UserDetails principal) {
        try {
            return JwtService.serialize(principal as MyUserDetails)
        } catch (exception) {
            println( exception.message)
            log.debug("The principal class (${principal.class}) is not serializable. Object: ${principal}")
            return null
        }
    }


}
