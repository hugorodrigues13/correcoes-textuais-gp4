import br.com.furukawa.service.RTDAService

class EnviaDadosRTDAJob {
    RTDAService RTDAService

    static triggers = {
        cron( cronExpression: "0 0/5 * ? * *")
    }

    def execute() {
        RTDAService.enviarDados()
    }
}
