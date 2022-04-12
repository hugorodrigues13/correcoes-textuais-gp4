import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.OrdemDeProducaoService

class AtualizaComponentesWIPJob {
    OracleService oracleService
    OrdemDeProducaoService ordemDeProducaoService
    EmailService emailService

    static triggers = {
        cron( cronExpression: "0 0 0/1 ? * *")
    }

    def execute() {
        try {
            List<Long> ids = ordemDeProducaoService.getOrdensDeProducaoIdsParaAtualizacaoMP()
            List<OrdemDeProducao> ops = OrdemDeProducao.getAll(ids)

            ops.each {op ->
                oracleService.atualizaListaMateriasPrimasOrdensDeProducao(op)
            }
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
