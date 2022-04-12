import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService

class CriaFornecedoresJob {
    OracleService oracleService
    EmailService emailService

    static triggers = {
        simple name: 'simpleTrigger', startDelay: 1000, repeatCount: 1
    }

    def execute() {
        try {
            //oracleService.atualizaFornecedores()
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
