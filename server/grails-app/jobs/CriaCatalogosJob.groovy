import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService

class CriaCatalogosJob {
    OracleService oracleService
    EmailService emailService

    static triggers = {
        simple name: 'simpleTrigger', startDelay: 1000, repeatCount: 1
    }

    def execute() {
        try {
            //oracleService.atualizarCatalogos()
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
