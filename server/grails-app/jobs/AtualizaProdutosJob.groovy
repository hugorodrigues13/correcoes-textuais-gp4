import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.OrdemDeProducaoService

class AtualizaProdutosJob {
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
            ops.unique {[it.codigoProduto, it.fornecedor.organizationId]}.each {
                oracleService.atualizaProdutoDaOrdemDeProducao(it)
            }
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
