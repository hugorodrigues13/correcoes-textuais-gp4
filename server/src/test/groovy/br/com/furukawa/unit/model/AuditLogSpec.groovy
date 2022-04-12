package br.com.furukawa.unit.model

import br.com.furukawa.model.AuditLog
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class AuditLogSpec extends Specification implements DomainUnitTest<AuditLog> {

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect:"fix me"
            true == true
    }
}
