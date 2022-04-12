package br.com.furukawa.dtos.importer

import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.ebs.LoteTransacao
import br.com.furukawa.enums.TipoApontamentoMaterial
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.service.MensagemService
import br.com.furukawa.service.OracleService
import java.text.SimpleDateFormat

class ApontamentoDeMaterialImporter extends Importer {
    OracleService oracleService

    ApontamentoDeMaterialImporter(File file, OracleService oracleService, MensagemService mensagemService, Locale locale) {
        super(1, ["ordemDeProducao", "codigoProduto", "codigoLote", "tipo", "quantidade"],
                file, mensagemService, "apontamentoDeMaterial.importar.erros.", locale)
        this.oracleService = oracleService
    }

    @Override
    void prevalidar(Object[] objects) {
        List<String> ordensDeProducaoArquivo = objects*.ordemDeProducao.unique()
        Map<OrdemDeProducao, List<ComponenteWIP>> ordensDeProducao = ordensDeProducaoArquivo.collectEntries {
            OrdemDeProducao op
            List<ComponenteWIP> componentes = new ArrayList<>()
            try {
                op = OrdemDeProducao.getByCodigo(it as String)
                componentes = oracleService.getComponentesRoteiroWIP(it as String, op?.fornecedor?.organizationId, op?.getOrganizacaoOP()?.idioma, true)
            } catch(e) {

            }
            [(op): componentes]
        }

        objects.each { obj ->
            Map.Entry<OrdemDeProducao, List<ComponenteWIP>> op = ordensDeProducao.find {it.key && it.key.codigoOrdem == obj.ordemDeProducao }
            ComponenteWIP componenteWIP = op?.value?.find {it.codigoProduto == obj.codigoProduto}
            LoteTransacao loteTransacao = componenteWIP ? oracleService.buscarLotesDisponiveisParaTransacao(componenteWIP)?.find {it.numeroLote == obj.codigoLote} : null

            obj.ordemDeProducaoValidada = op?.key
            obj.componente = componenteWIP
            obj.loteValidado = loteTransacao
        }
    }

    @Override
    void validar(Object object) {
        if(!object.ordemDeProducao) {
            object.erros.add("op.nula")
        } else if(!object.ordemDeProducaoValidada) {
            object.erros.add("op.inexistente")
        }

        if (!object.codigoProduto){
            object.erros.add("cp.nulo")
        } else if (!object.componente){
            object.erros.add("cp.inexistente")
        }

        if (!object.codigoLote){
            object.erros.add("lote.nulo")
        } else if (!object.loteValidado){
            object.erros.add("lote.inexistente")
        }

        if(!object.tipo) {
            object.erros.add("tipo.nulo")
        } else {
            try {
                object.tipo = TipoApontamentoMaterial.valueOf(object.tipo)
            } catch(e) {
                object.erros.add("tipo.invalido")
            }
        }

        if (!object.quantidade){
            object.erros.add("qntd.nulo")
        } else {
            try {
                // excel utiliza "," para separar casas decimais, enquanto o java utiliza "."
                double quantidade = Double.parseDouble(object.quantidade.replace(",", "."))
                object.quantidade = quantidade.toBigDecimal()
                if (object.quantidade <= 0){
                    object.erros.add("qntd.maiorQueZero")
                } else if(!object.loteValidado || object.loteValidado.quantidadeDisponivel < object.quantidade) {
                    object.erros.add("qntd.maiorQueDisponivel")
                }
            } catch(e){
                object.erros.add("qntd.invalido")
            }
        }
    }
}
