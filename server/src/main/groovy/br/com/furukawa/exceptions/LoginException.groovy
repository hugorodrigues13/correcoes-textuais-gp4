package br.com.furukawa.exceptions

import org.springframework.security.core.AuthenticationException

class LoginException extends AuthenticationException {
    String message

    LoginException(String msg) {
        super(msg)
        this.message = msg
    }
}
