package br.com.furukawa.unit.model

import br.com.furukawa.model.Role
import br.com.furukawa.model.User
import br.com.furukawa.model.UserRole
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class UserRoleSpec extends Specification implements DomainUnitTest<UserRole> {

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
        expect:"fix me"
            true == true
    }

    void testEquals() {
        given:
        User user = new User()
        user.id = 123

        User userDiferente = new User()
        userDiferente.id = 321

        Role role = new Role()
        role.id = 213

        UserRole userRole = new UserRole()
        userRole.user = user
        userRole.role = role

        UserRole userRoleDiferente = new UserRole()
        userRoleDiferente.user = userDiferente
        userRoleDiferente.role = role

        expect:
        true == userRole.equals(userRole)
        false == userRole.equals(null)
        false == userRole.equals(userRoleDiferente)
    }
}
