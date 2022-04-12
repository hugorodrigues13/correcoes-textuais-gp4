package br.com.furukawa.service

import grails.gorm.transactions.Transactional

@Transactional
class TesteService {

    List<String> getTiposTeste(){
        // TODO: consultar service
        return ["IL", "RL", "Fluke", "Visual", "Interferômetro", "Estanqueidade"]
    }

}
