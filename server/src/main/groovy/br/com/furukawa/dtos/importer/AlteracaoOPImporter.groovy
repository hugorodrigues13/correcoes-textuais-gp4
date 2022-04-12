package br.com.furukawa.dtos.importer

import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.service.MensagemService
import br.com.furukawa.service.OracleService
import br.com.furukawa.utils.DateUtils

import java.text.SimpleDateFormat

class AlteracaoOPImporter extends Importer {
    private final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy")

    Organizacao organizacao
    OracleService oracleService

    AlteracaoOPImporter(File file, Organizacao organizacao, OracleService oracleService, MensagemService mensagemService, Locale locale) {
        super(1, ["ordemDeProducao", "quantidade", "dataFinalizacao", "statusWIP"],
                file, mensagemService, "acompanhamentoOrdemProducao.atualizarEmMassa.erros.", locale)
        this.organizacao = organizacao
        this.oracleService = oracleService
    }

    void validar(Object object) {
        if(!object.ordemDeProducao) {
            object.erros.add("op.nula")
        } else if(!object.ordemDeProducaoValidada) {
            object.erros.add("op.inexistente")
        }

        if(!object.quantidade && !object.dataFinalizacao && !object.statusWIP){
            object.erros.add("op.semAlteracoes")
        }

        if (object.quantidade){
            try {
                // excel utiliza "," para separar casas decimais, enquanto o java utiliza "."
                double quantidade = Double.parseDouble(object.quantidade.replace(",", "."))
                object.quantidade = quantidade.toInteger()
                if (object.quantidade <= 0){
                    object.erros.add("qntd.maiorQueZero")
                } else if(quantidade > object.ordemDeProducaoValidada?.quantidade) {
                    object.erros.add("quantidade.aumentar")
                } else if(quantidade < object.ordemDeProducaoValidada?.totalPecasSequenciadas) {
                    object.erros.add("quantidade")
                }
            } catch(e){
                object.erros.add("qntd.invalido")
            }
        }

        if(object.statusWIP && !StatusOrdemDeProducaoWIP.statusAlteracao.contains(object.statusWIP as StatusOrdemDeProducaoWIP)) {
            object.erros.add('statusWIP.invalido')
        }

        if (object.dataFinalizacao){
            try {
                Date date = object.dataFinalizacao instanceof Date
                        ? object.dataFinalizacao
                        : DateUtils.corrigeAnoData(SDF.parse(object.dataFinalizacao))
                if (date < new Date()) throw new Exception()
            } catch(e){
                object.erros.add("data.invalido")
            }
        }
    }

    @Override
    void prevalidar(Object[] objects) {
        List<String> ordensDeProducaoArquivo = objects*.ordemDeProducao.unique()
        Map<String, OrdemDeProducao> ordensDeProducao = ordensDeProducaoArquivo.collectEntries {
            OrdemDeProducao op
            try {
                op = OrdemDeProducao.getByCodigo(it as String)
            } catch(e) {}
            [(it): op]
        }

        objects.each { obj ->
            Map.Entry<String, OrdemDeProducao> op = ordensDeProducao.find {it.key == obj.ordemDeProducao }

            obj.ordemDeProducaoValidada = op?.value
        }
    }
}
