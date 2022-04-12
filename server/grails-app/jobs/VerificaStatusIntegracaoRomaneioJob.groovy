import br.com.furukawa.service.RomaneioService

class VerificaStatusIntegracaoRomaneioJob {

    private final static long DOZE_HORAS = 1000L * 60L * 60L * 12
    RomaneioService romaneioService

    static triggers = {
        cron(cronExpression: "0 */5 * ? * *")
    }

    def execute() {
        romaneioService.verificarStatusIntegracaoRomaneio(new Date(new Date().getTime() - DOZE_HORAS))
    }
}
