package br.com.furukawa.service

import br.com.furukawa.dtos.HistoricoSerialDTO
import br.com.furukawa.dtos.PedidoEBSDTO
import br.com.furukawa.dtos.ProdutoEBSDTO
import br.com.furukawa.dtos.SerialApoioDTO
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.ProdutoGrupoLinhaDeProducao
import br.com.furukawa.model.SerialFabricacao
import org.springframework.dao.DataIntegrityViolationException
import grails.gorm.transactions.Transactional


@Transactional
class ApoioService {

    SerialService serialService

    boolean salvar(def instance){
        instance.save(flush: true, failOnError: true)
    }

    boolean excluir(def instance) {
        Boolean registroExcluido = true

        try {
            instance.refresh()
            instance.delete(flush: true)
        } catch (DataIntegrityViolationException e) {
            registroExcluido = false
        }
        return registroExcluido
    }

    /* Métodos para Manipular a Lista de Seriais Teste */

    List<SerialApoioDTO> buscarSeriaisTeste() {
        List<SerialApoioDTO> seriais = new ArrayList<>()
        seriais.add(new SerialApoioDTO(12, "3022F8","21","29832209", "Cabo Vermelho"))
        seriais.add(new SerialApoioDTO(31,"4228T4", "20","39847274", "Conector"))
        seriais.add(new SerialApoioDTO(47,"2768H0" ,"21", "18430939", "Receptor"))
        seriais.add(new SerialApoioDTO(59,"1329K7" ,"20", "44372894", "Cabo Azul"))
        seriais.add(new SerialApoioDTO(73,"3342Q3" ,"21", "27346782", "Cabo Guia"))

        return seriais
    }

    SerialApoioDTO buscarSerialSelecionadoTeste(id){
        def serial
        List<SerialApoioDTO> seriais = buscarSeriaisTeste()
        seriais.forEach(){
            if(it.id == id) {
                serial = it
            }
        }
        return serial
    }


    List<HistoricoSerialDTO> buscarHistoricoDoSerialTeste (){
        List<HistoricoSerialDTO> apontamentos = new ArrayList<>()
        apontamentos.add(new HistoricoSerialDTO('12/02/2021 10:12:07','','Início da Produção'))
        apontamentos.add(new HistoricoSerialDTO('12/02/2021 12:34:32','','Encaixe'))
        apontamentos.add(new HistoricoSerialDTO('13/02/2021 11:47:12','Defeito na Conexão','Conexões'))
        apontamentos.add(new HistoricoSerialDTO('13/02/2021 15:53:41','','Testes de Transmissão'))
        apontamentos.add(new HistoricoSerialDTO('14/02/2021 12:26:52','Queda de Sinal','Testes de Sinal'))
        apontamentos.add(new HistoricoSerialDTO('15/02/2021 09:17:28','','Medição do Cabo'))
        apontamentos.add(new HistoricoSerialDTO('15/02/2021 13:42:38','Tamanho Inferior','Cortes'))
        apontamentos.add(new HistoricoSerialDTO('16/02/2021 11:23:13','','Agrupamento'))
        apontamentos.add(new HistoricoSerialDTO('16/02/2021 15:11:24','Composição Errada','Encapamento'))
        apontamentos.add(new HistoricoSerialDTO('17/02/2021 12:55:49','','Testes Físicos'))
        apontamentos.add(new HistoricoSerialDTO('17/02/2021 17:38:05','Transmissão de Sinal','Testes Finais'))

        return apontamentos
    }

    void sucatearSerial(SerialFabricacao serialFabricacao) {
        Apontamento apontamento = Apontamento.findBySerial(serialFabricacao)
        apontamento.processoAtual = null
        apontamento.serial.statusSerial = StatusSerialFabricacao.SUCATEADO
        serialFabricacao.lote?.removeFromSeriais(serialFabricacao)

        serialService.geraNovoSerialParaSubstituirSucata(serialFabricacao)

        serialFabricacao.dataSucateamento = new Date()
        salvar(apontamento)
        salvar(serialFabricacao)
    }

    List<SerialFabricacao> seriaisByGrupo(GrupoLinhaDeProducao grupo){
        List<LinhaDeProducao> linhas = grupo.linhas as List
        List<SerialFabricacao> serials = Apontamento.createCriteria().list {
            'in' 'linhaDeProducao', linhas
            serial {
                eq("statusSerial", StatusSerialFabricacao.PENDENTE_APOIO)
                ordemDeFabricacao {
                    ne("status", StatusOrdemFabricacao.CANCELADA)
                }
            }
            projections {
                property("serial")
            }
        }
        return serials
    }

}