package br.com.furukawa.controller

import br.com.furukawa.model.Acesso
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Role
import br.com.furukawa.model.User
import br.com.furukawa.model.UserRole

class BootStrap {

    def oracleService

    def init = { servletContext ->
//        oracleService.atualizaOrganizacoes()
//        oracleService.atualizaFornecedores()

//        User.withNewTransaction {
//            Role admin = new Role(authority: "ROLE_ADMINISTRADOR",
//                    descricao: "Acesso total ao sistema",
//                    nome: "Administrador",
//                    isEditavel: false,
//                    isRemovivel: false)

//            User user = new User(fullname: 'Administrador',
//                    email: 'admin@admin.com',
//                    username: 'admin',
//                    password: 'admin',
//                    enabled: true,
//                    isRemovivel: false,
//                    accountExpired: false,
//                    accountLocked: false,
//                    passwordExpired: false,
//                    token: 'marm10',
//                    matricula: '1212')

//            Organizacao fel = Organizacao.findByOrganizationID('121')
//            Organizacao sr = Organizacao.findByOrganizationID('324')

//            Acesso acesso = new Acesso(nome: "Acesso às principais organizações")
//            acesso.addToOrganizacoes(fel)
//            acesso.addToOrganizacoes(sr)
//            Fornecedor.findAllByOrganizationIdInList(['121', '324']).each {
//                acesso.addToFornecedores(it)
//            }

//            user.addToAcessos(acesso)

//            user.save(failOnError: true)
//            admin.save(failOnError: true)

//            UserRole.create user, admin, true
//        }

    }
    def destroy = {
    }
}
