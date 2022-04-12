package br.com.furukawa.controller

import br.com.furukawa.dtos.filtros.FiltroAuditLog
import br.com.furukawa.model.AuditLog

class AuditoriaController {

    def auditoriaService

    def index() {
        FiltroAuditLog filter = FiltroAuditLog.build(params)

        def model = auditoriaService.pesquisaDeAuditLog(filter)

        respond model
    }

    def show(Long id) {
        respond AuditLog.get(id)
    }
}
