import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.OrdemDeProducaoService

class AtualizaCatalogosJob {
    OracleService oracleService
    EmailService emailService
    OrdemDeProducaoService ordemDeProducaoService

    static triggers = {
        cron( cronExpression: "0 0 0/2 ? * *")
    }

    def execute() {
        try {
            List<Long> ids = ordemDeProducaoService.getOrdensDeProducaoIdsParaAtualizacaoMP()
            List<OrdemDeProducao> ops = OrdemDeProducao.getAll(ids)
            ops.unique {[it.codigoProduto, it.fornecedor.organizationId]}.each {
                println "atualizando catalogo ${it}"
                oracleService.atualizarCatalogos(it)
                println "fim catalogo ${it}"
            }
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
        }
    }
}
