package br.com.furukawa.service

import grails.testing.services.ServiceUnitTest
import spock.lang.Specification

class TesteServiceSpec extends Specification implements ServiceUnitTest<TesteService>{

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect:"fix me"
            true == false
    }
}
