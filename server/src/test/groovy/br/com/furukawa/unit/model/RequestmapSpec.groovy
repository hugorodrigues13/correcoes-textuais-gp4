package br.com.furukawa.unit.model

import br.com.furukawa.model.Requestmap
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class RequestmapSpec extends Specification implements DomainUnitTest<Requestmap> {

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect: "fix me"
        true == true
    }

    void testToString() {
        given:
        Requestmap requestmap = new Requestmap()
        requestmap.url = url
        requestmap.configAttribute = configAttribute
        requestmap.descricao = descricao

        when:
        String retorno = requestmap.toString()

        then:
        assert retorno == requestmap.descricao

        where:
        descricao   | url   | configAttribute
        "descrição" | "url" | "configAttribute"
        ""          | "url" | "configAttribute"
        " "         | "url" | "configAttribute"
    }
}
