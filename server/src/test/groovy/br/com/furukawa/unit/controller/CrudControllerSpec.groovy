package br.com.furukawa.unit.controller

import br.com.furukawa.controller.CrudController
import br.com.furukawa.model.User
import grails.testing.web.controllers.ControllerUnitTest
import spock.lang.Specification

class CrudControllerSpec extends Specification implements ControllerUnitTest<CrudController> {

    def setup() {
    }

    def cleanup() {
    }

    void beforeList() {
        given:
        CrudController crudController = new CrudController(Class)
        def resposta

        when:
        resposta = crudController.beforeList()

        then:
        resposta == null
    }

    void beforeSave() {
        given:
        CrudController crudController = new CrudController(Class)
        def resposta

        when:
        resposta = crudController.beforeSave(new User(), [])

        then:
        resposta == null
    }

    void setCollettions() {
        given:
        CrudController crudController = new CrudController(Class)
        def resposta

        when:
        resposta = crudController.setCollettions(new User())

        then:
        resposta == null
    }

    void beforeDelete() {
        given:
        CrudController crudController = new CrudController(Class)
        def resposta

        when:
        resposta = crudController.beforeDelete(new User())

        then:
        resposta == null
    }

    void editaModelDoEdit() {
        given:
        CrudController crudController = new CrudController(Class)

        def model = [:]
        model.put("valor", "valor")

        def modelSemelhante = [:]
        modelSemelhante.put("valor", "valor")

        def modelDiferente = [:]
        modelDiferente.put("valor", "teste")

        def modelDiferente2 = [:]
        modelDiferente2.put("teste", "valor")

        def resposta

        when:
        resposta = crudController.editaModelDoEdit(model)

        then:
        resposta == model
        resposta == modelSemelhante
        resposta != modelDiferente
        resposta != modelDiferente2
    }

    void editaModelDoSave() {
        given:
        CrudController crudController = new CrudController(Class)

        def model = [:]
        model.put("valor", "valor")

        def modelSemelhante = [:]
        modelSemelhante.put("valor", "valor")

        def modelDiferente = [:]
        modelDiferente.put("valor", "teste")

        def modelDiferente2 = [:]
        modelDiferente2.put("teste", "valor")

        def resposta

        when:
        resposta = crudController.editaModelDoSave(model)

        then:
        resposta == model
        resposta == modelSemelhante
        resposta != modelDiferente
        resposta != modelDiferente2
    }
}