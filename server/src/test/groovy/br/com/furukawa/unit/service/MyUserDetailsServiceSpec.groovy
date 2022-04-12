package br.com.furukawa.unit.service

import br.com.furukawa.service.MyUserDetailsService
import grails.testing.services.ServiceUnitTest
import spock.lang.Specification

class MyUserDetailsServiceSpec extends Specification implements ServiceUnitTest<MyUserDetailsService>{

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect:"fix me"
            true == true
    }
}
