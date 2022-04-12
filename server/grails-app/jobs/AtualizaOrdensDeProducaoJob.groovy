import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService

class AtualizaOrdensDeProducaoJob {
    OracleService oracleService
    EmailService emailService

    static triggers = {
        cron( cronExpression: "0 0 * ? * *")
    }

    def execute() {
        try {
            oracleService.atualizaOrdensDeProducao()
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
