package br.com.furukawa.unit.model

import br.com.furukawa.model.User
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class UserSpec extends Specification implements DomainUnitTest<User> {

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect:"fix me"
            true == true
    }

    void testIsAtivo() {
        given:
        User userEnabled = new User()
        userEnabled.enabled = true

        User userNotEnabled = new User()
        userNotEnabled.enabled = false

        expect:
        true == userEnabled.isAtivo()
        false == userNotEnabled.isAtivo()
    }
}
