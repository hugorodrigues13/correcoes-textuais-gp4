import br.com.furukawa.service.AsaichiService
import br.com.furukawa.service.EmailService
import groovy.time.TimeCategory

import java.text.DateFormat
import java.text.SimpleDateFormat

class AtualizaAsaichiJob {
    EmailService emailService
    AsaichiService asaichiService

    static triggers = {
        cron( cronExpression: "0 30 0 ? * *")
    }

    def execute() {
        try {
            Date data = new Date()
            DateFormat df = new SimpleDateFormat("MM/YY")
            String mes = df.format(data)

            asaichiService.atualizaDadosProducaoDefeitosMensal(mes)
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
