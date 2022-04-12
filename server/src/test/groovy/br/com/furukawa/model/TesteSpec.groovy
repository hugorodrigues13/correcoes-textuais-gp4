package br.com.furukawa.model

import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class TesteSpec extends Specification implements DomainUnitTest<Teste> {

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect:"fix me"
            true == false
    }
}
