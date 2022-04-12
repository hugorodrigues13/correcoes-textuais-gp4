import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService

class AtualizaFornecedoresJob {
    OracleService oracleService
    EmailService emailService

    static triggers = {
        cron( cronExpression: "0 0 3 ? * *")
    }

    def execute() {
        try {
            oracleService.atualizaFornecedores()
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
