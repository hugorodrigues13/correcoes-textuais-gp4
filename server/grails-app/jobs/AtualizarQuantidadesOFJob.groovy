import br.com.furukawa.service.ApontamentoService

class AtualizarQuantidadesOFJob {

    ApontamentoService apontamentoService

    static triggers = {
        cron(cronExpression: "0 */5 * ? * *")
    }

    def execute() {
        apontamentoService.atualizarQuantidadesOrdensFabricacao()
    }
}
