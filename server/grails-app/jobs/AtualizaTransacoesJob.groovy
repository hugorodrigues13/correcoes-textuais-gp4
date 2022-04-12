import br.com.furukawa.service.ApontamentoService
import br.com.furukawa.service.OracleService

class AtualizaTransacoesJob {

    OracleService oracleService

    static triggers = {
        cron(cronExpression: "0 */1 * ? * *")
    }

    def execute() {
        try {
            oracleService.transacionarApontamentosPendentes()
        } catch(Exception e) {
            println e
        }

    }


}
