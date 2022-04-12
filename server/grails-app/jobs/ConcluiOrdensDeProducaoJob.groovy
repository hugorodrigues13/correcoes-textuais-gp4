import br.com.furukawa.enums.StatusJob
import br.com.furukawa.enums.StatusTransacaoRecebimento
import br.com.furukawa.model.JobGP
import br.com.furukawa.model.RecebimentoNF
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService
import groovy.time.TimeCategory

class ConcluiOrdensDeProducaoJob {

    OracleService oracleService
    EmailService emailService
    CrudService crudService

    static final String JOB_NAME = "CONCLUIR_OPS"

    static triggers = {
        cron(cronExpression: "0 0/3 * ? * *")
    }

    def execute() {
        boolean newJob = false
        JobGP jobGP = JobGP.findByNomeAndStatus(JOB_NAME, StatusJob.EM_EXECUCAO)

        if (!jobGP) {
            jobGP = new JobGP(nome: JOB_NAME)
            newJob = true
        }

        if (newJob || jobGP.ultimaExecucao <= dataMaximaExecucaoJob()) {
            jobGP.ultimaExecucao = new Date()
            try {
                List<RecebimentoNF> recebimentos = RecebimentoNF.findAllByStatusAndVersionLessThanAndIsConcluirManualmente(StatusTransacaoRecebimento.MOVIMENTADA, 480, false)
                recebimentos.each {recebimentoNF ->
                    oracleService.concluirOrdensDeProducao(recebimentoNF)
                }
            } catch(Exception exception) {
                emailService.enviaEmailDeErro(exception)
            } finally {
                jobGP.status = StatusJob.FINALIZADO
                jobGP.fim = new Date()
                crudService.salvar(jobGP)
            }
        } else { //excedido o tempo maximo de execucao
            jobGP.status = StatusJob.FINALIZADO
            jobGP.fim = new Date()
            crudService.salvar(jobGP)
        }
    }

    Date dataMaximaExecucaoJob() {
        Date execucaoMaxima
        use(TimeCategory) {
            execucaoMaxima = new Date() - 10.minute
        }
        return execucaoMaxima
    }
}
