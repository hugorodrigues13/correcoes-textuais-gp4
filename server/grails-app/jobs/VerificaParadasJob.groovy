import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.RecursoService

class VerificaParadasJob {

    RecursoService recursoService

    static triggers = {
        cron( cronExpression: "0/20 * * ? * * *")
    }

    def execute() {
        recursoService.verificarParadas()
    }
}
