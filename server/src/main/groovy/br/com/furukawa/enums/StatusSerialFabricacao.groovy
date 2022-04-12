package br.com.furukawa.enums

enum StatusSerialFabricacao {
    /**
     *  Item sucateado pelo Apoio. Novo serial devera ser gerado.
     */
    SUCATEADO,
    /**
     * Item excedeu o numero maximo de apontamentos em determinado processo e foi enviado ao Apoio.
     */
    PENDENTE_APOIO,
    /**
     *  Apontamento do item ainda nao foi iniciado.
     */
    PENDENTE_APONTAMENTO,
    /**
     * Item ja foi apontado no primeiro processo, mas ainda nao no ultimo.
     */
    APONTAMENTO_INICIADO,
    /**
     * Item foi apontado no ultimo processo.
     */
    APONTAMENTO_FINALIZADO


    static List<StatusSerialFabricacao> getStatusDashboard() {
        return [APONTAMENTO_INICIADO, PENDENTE_APOIO, APONTAMENTO_FINALIZADO, SUCATEADO]
    }

    String getPropriedadeSerial() {
        switch (this) {
            case APONTAMENTO_INICIADO:
                return 'data_Inicio_Apontamento'
                break
            case PENDENTE_APOIO:
                return 'data_Envio_Apoio'
                break
            case APONTAMENTO_FINALIZADO:
                return 'data_Ultimo_Apontamento'
                break
            case SUCATEADO:
                return 'data_Sucateamento'
                break
            default:
                return ''

        }
    }

    List<String> getOutrasProperidadesSerial(){
        switch (this) {
            case APONTAMENTO_INICIADO:
                return ['data_Envio_Apoio', 'data_Ultimo_Apontamento', 'data_Sucateamento']
            case PENDENTE_APOIO:
                return ['data_Ultimo_Apontamento', 'data_Sucateamento']
            case APONTAMENTO_FINALIZADO:
                return ['data_Sucateamento']
            case SUCATEADO:
                return []
            default:
                return []

        }
    }

    static List<StatusSerialFabricacao> getStatusIniciados(){
        return [StatusSerialFabricacao.APONTAMENTO_INICIADO, StatusSerialFabricacao.APONTAMENTO_FINALIZADO, StatusSerialFabricacao.PENDENTE_APOIO]
    }

    static List<StatusSerialFabricacao> getStatusNaoIniciados(){
        return [StatusSerialFabricacao.PENDENTE_APONTAMENTO]
    }

}
