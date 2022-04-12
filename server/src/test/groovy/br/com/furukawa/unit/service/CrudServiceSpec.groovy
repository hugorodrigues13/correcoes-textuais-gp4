package br.com.furukawa.unit.service

import br.com.furukawa.service.CrudService
import grails.testing.services.ServiceUnitTest
import spock.lang.Specification

class CrudServiceSpec extends Specification implements ServiceUnitTest<CrudService>{

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect:"fix me"
            true == true
    }
}
