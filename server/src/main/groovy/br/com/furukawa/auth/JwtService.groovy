package br.com.furukawa.auth

import com.nimbusds.jose.JOSEException
import com.nimbusds.jose.crypto.MACVerifier
import com.nimbusds.jose.crypto.RSADecrypter
import com.nimbusds.jwt.EncryptedJWT
import com.nimbusds.jwt.JWT
import com.nimbusds.jwt.JWTParser
import com.nimbusds.jwt.SignedJWT
import grails.core.GrailsApplication
import grails.plugin.springsecurity.rest.token.generation.jwt.RSAKeyProvider
import grails.util.Holders
import groovy.util.logging.Slf4j
import org.springframework.security.core.userdetails.UserDetails

import java.util.zip.GZIPInputStream
import java.util.zip.GZIPOutputStream

/**
 * Helper to perform actions with JWT tokens
 */
@Slf4j
class JwtService {

    String jwtSecret
    RSAKeyProvider keyProvider
    GrailsApplication grailsApplication

    /**
     * Parses and verifies (for signed tokens) or decrypts (for encrypted tokens) the given token
     *
     * @param tokenValue a JWT token
     * @return a {@link JWT} object
     * @throws JOSEException when verification/decryption fails
     */
    JWT parse(String tokenValue) {
        JWT jwt = JWTParser.parse(tokenValue)

        if (jwt instanceof SignedJWT) {
            log.debug "Parsed an HMAC signed JWT"

            SignedJWT signedJwt = jwt as SignedJWT
            if(!signedJwt.verify(new MACVerifier(jwtSecret))) {
                throw new JOSEException('Invalid signature')
            }
        } else if (jwt instanceof EncryptedJWT) {
            log.debug "Parsed an RSA encrypted JWT"

            EncryptedJWT encryptedJWT = jwt as EncryptedJWT
            RSADecrypter decrypter = new RSADecrypter(keyProvider.privateKey)

            // Decrypt
            encryptedJWT.decrypt(decrypter)
        }

        return jwt
    }

    static String serialize(MyUserDetails userDetails) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream()
        GZIPOutputStream gzipOut = new GZIPOutputStream(baos)
        ObjectOutputStream objectOut = new ObjectOutputStream(gzipOut)
        MyUserDetails myUserDetails = new MyUserDetails(userDetails.username,"123456789", userDetails.enabled, userDetails.accountNonExpired,
                userDetails.credentialsNonExpired, userDetails.accountNonLocked, userDetails.authorities, userDetails.id, userDetails.get_acessos(), userDetails._organizacaoSelecionada, userDetails._fornecedorSelecionado)
        objectOut.writeObject(myUserDetails)
        objectOut.close()
        byte[] outputBytes = baos.toByteArray()
        return outputBytes.encodeBase64()
    }

    static UserDetails deserialize(String userDetails) {
        byte[] inputBytes = userDetails.decodeBase64()
        ByteArrayInputStream bais = new ByteArrayInputStream(inputBytes)
        GZIPInputStream gzipIn = new GZIPInputStream(bais)
        ContextClassLoaderAwareObjectInputStream objectIn = new ContextClassLoaderAwareObjectInputStream(gzipIn)
        MyUserDetails userDetailsObject = objectIn.readObject() as UserDetails
        objectIn.close()
        return userDetailsObject
    }

}


@Slf4j
class ContextClassLoaderAwareObjectInputStream extends ObjectInputStream {

    public ContextClassLoaderAwareObjectInputStream(InputStream is) throws IOException {
        super(is)
    }

    @Override
    protected Class<?> resolveClass(ObjectStreamClass desc) throws IOException, ClassNotFoundException {
        ClassLoader currentTccl = null
        try {
            currentTccl = Holders.grailsApplication.classLoader
            return currentTccl.loadClass(desc.name)
        } catch (Exception e) {
            log.debug e.message
        }

        return super.resolveClass(desc)
    }
}
