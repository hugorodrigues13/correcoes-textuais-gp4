package br.com.furukawa.auth

import org.springframework.security.crypto.password.DelegatingPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.crypto.password.StandardPasswordEncoder

class MyPasswordEncoder {

    @SuppressWarnings("deprecation")
    static PasswordEncoder createDelegatingPasswordEncoder() {
        Map<String, PasswordEncoder> encoders = new HashMap<>()
        encoders.put("sha256", new CustomLegacyPasswordEncoder("SHA-256"))

        DelegatingPasswordEncoder delegatingPasswordEncoder = new DelegatingPasswordEncoder("sha256", encoders)
        //setting custom encoder as a default encoder
        delegatingPasswordEncoder.setDefaultPasswordEncoderForMatches(new CustomLegacyPasswordEncoder("SHA-256"))

        return delegatingPasswordEncoder
    }

    private MyPasswordEncoder() {}
}
