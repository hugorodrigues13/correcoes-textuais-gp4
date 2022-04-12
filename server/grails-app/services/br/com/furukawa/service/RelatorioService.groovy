package br.com.furukawa.service

import br.com.furukawa.dtos.ApontamentoPendenteDTO
import br.com.furukawa.dtos.FaturamentoDTO
import br.com.furukawa.dtos.OrdemDeFabricacaoDTO
import br.com.furukawa.dtos.OrdemDeProducaoDTO
import br.com.furukawa.dtos.ProducaoMensalDTO
import br.com.furukawa.dtos.RomaneioListaDTO
import br.com.furukawa.dtos.SerialFabricacaoDTO
import br.com.furukawa.dtos.filtros.FiltroRelatorioSerial
import br.com.furukawa.dtos.filtros.FiltroSerial
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioApontamentoPendenteItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioApontamentoPendenteListagem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioEtiqueta
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioEtiquetaItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioFaturamentoCaixas
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioFaturamentoCaixasItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioGrupoLinhaProducao
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioGrupoLinhaProducaoItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioFaturamentoListagem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioFaturamentoListagemItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioOrdemFabricacao
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioOrdemFabricacaoItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioOrdemProducao
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioOrdemProducaoItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioPlanejamentoDiario
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioPlanejamentoDiarioItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioProducaoMensalItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioProducaoMensalListagem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioRomaneio
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioRomaneioItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioSerial
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioSerialItem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioSerialListagem
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioSerialListagemItem
import br.com.furukawa.dtos.relatorios.pdf.impl.RelatorioLoteItem
import br.com.furukawa.dtos.relatorios.pdf.impl.RelatorioLotes
import br.com.furukawa.dtos.relatorios.pdf.RelatorioPDF
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.PlanejamentoDiario
import br.com.furukawa.model.User
import br.com.furukawa.model.ProdutoEtiqueta
import grails.gorm.transactions.Transactional

import java.text.DateFormat
import java.text.SimpleDateFormat

@Transactional
class RelatorioService {

    SerialService serialService
    CrudService crudService
    MensagemService mensagemService
    EtiquetaService etiquetaService

    File gerarRelatorioSerial(FiltroRelatorioSerial filtro, Locale locale) throws RelatorioException, Exception{
        List<RelatorioSerialItem> seriais = serialService.getSeriaisRelatorio(crudService.getFornecedorLogado(), filtro)
        if (seriais.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        DateFormat df = new SimpleDateFormat(filtro.dataFinalizacao.padrao)
        Map<String, String> filtrosUsados = paramsToFilters([periodo: filtro.dataFinalizacao ? df.format(filtro.dataFinalizacao.dataInicial) + "-" + df.format(filtro.dataFinalizacao.dataFinal) : "", linha: filtro.linhaProducao, lote: filtro.lote, codigoProduto: filtro.codigoProduto, ordemProducao: filtro.ordemProducao, ordemFabricacao: filtro.ordemFabricacao, statusOrdemFabricacao: filtro.statusOrdemFabricacao.join(","), grupoLinhas: filtro.grupoLinhaProducao])
        RelatorioExcel relatorioSerial = new RelatorioSerial(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: seriais, completo: filtro.completo,
                filtros: filtrosUsados,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioSerial.gerar()
    }

    File gerarRelatorioLotes(List<FaturamentoDTO> lotes, Fornecedor fornecedor, User user, Locale locale) throws RelatorioException, Exception{
        try {
            if (lotes.isEmpty()){
                throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
            }
            List<RelatorioLoteItem> itens = lotes.collect({new RelatorioLoteItem(it.codigoLote, it.codigoProduto, it.descricaoProduto, it.quantidade)})
            RelatorioPDF relatorio = new RelatorioLotes(itens, fornecedor, user, mensagemService, locale)
            return relatorio.gerar()
        } catch(e){
            throw e
        }
    }

    File gerarRelatorioOrdensProducao(List<OrdemDeProducaoDTO> ops, List<String> colunas, Map<String, String> filtros, Locale locale){
        try {
            if (ops.isEmpty()){
                throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
            }
            List<RelatorioOrdemProducaoItem> itens = ops.collect({new RelatorioOrdemProducaoItem(it.codigoOrdem, it.codigoProduto, it.descricaoProduto, it.quantidade as String, it.planejador, it.lista, it.roteiro, it.fornecedor, it.pedido, it.quantidadeRestante as String, it.quantidadeEntregue as String, it.quantidadePendenteRomaneio as String, it.quantidadeTransito as String, it.erroExportacao, it.status, it.statusOracle, it.dataCriacao, it.dataPrevisaoFinalizacao, it.linha, it.release?.isNumber() ? it.release.toLong() : 0, it.codigoServico, it.totalSequenciado, it.totalPecasProducao, it.totalPecasFinalizadas, it.justificativa, it.modelo, it.comprimento, it.grupoLinhas)})
            RelatorioExcel relatorioOrdemProducao = new RelatorioOrdemProducao(
                    organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                    fornecedor: crudService.getFornecedorLogado().getNome(),
                    itens: itens,
                    colunas: colunas,
                    filtros: filtros,
                    mensagemService: mensagemService,
                    locale: locale
            )
            return relatorioOrdemProducao.gerar()
        } catch(e){
            throw e
        }
    }

    File gerarRelatorioOrdensFabricacao(List<OrdemDeFabricacaoDTO> ofs, List<String> colunas, Map<String, String> filtros, Locale locale){
        try {
            if (ofs.isEmpty()){
                throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
            }
            colunas.add("dataUltimaImpressao")
            List<RelatorioOrdemFabricacaoItem> itens = ofs.collect({new RelatorioOrdemFabricacaoItem(it)})
            RelatorioExcel relatorioOrdemFabricacao = new RelatorioOrdemFabricacao(
                    organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                    fornecedor: crudService.getFornecedorLogado().getNome(),
                    itens: itens,
                    colunas: colunas,
                    filtros: filtros,
                    mensagemService: mensagemService,
                    locale: locale
            )
            return relatorioOrdemFabricacao.gerar()
        } catch(e){
            throw e
        }
    }

    File gerarRelatorioRomaneio(List<RomaneioListaDTO> entities, List<String> colunas, Map<String, String> filtros, Locale locale){
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<RelatorioRomaneioItem> itens = entities.collect({new RelatorioRomaneioItem(it)})
        RelatorioExcel relatorioRomaneio = new RelatorioRomaneio(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: filtros,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioRomaneio.gerar()
    }

    File gerarRelatorioSeriaisListagem(List<SerialFabricacaoDTO> entities, List<String> colunas, Map<String, String> filtros, Locale locale){
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<RelatorioSerialListagemItem> itens = entities.collect({new RelatorioSerialListagemItem(it)})
        RelatorioExcel relatorioSerial = new RelatorioSerialListagem(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: filtros,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioSerial.gerar()
    }

    File gerarRelatorioApontamentosPendentesListagem(List<ApontamentoPendenteDTO> entities, List<String> colunas, Map<String, String> filtros, Locale locale){
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<String> colunasFiltrada = colunas.findAll{ !it.equals("periodo") && !it.equals("status") }
        List<RelatorioApontamentoPendenteItem> itens = entities.collect({new RelatorioApontamentoPendenteItem(it)})
        RelatorioExcel relatorioApontamentoPendente = new RelatorioApontamentoPendenteListagem(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunasFiltrada,
                filtros: filtros,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioApontamentoPendente.gerar()
    }

    File gerarRelatorioProducaoMensal(List<ProducaoMensalDTO> entities, Map<String, String> filtros, List<String> colunas, Locale locale){
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<RelatorioProducaoMensalItem> itens = entities.collect({new RelatorioProducaoMensalItem(it)})
        RelatorioExcel relatorioProducaoMensal = new RelatorioProducaoMensalListagem(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: filtros,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioProducaoMensal.gerar()
    }

    File gerarRelatorioFaturamentoCaixa(Lote lote, Locale locale){
        List<ImpressaoApontamentoCaixa> entities = lote.caixas
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<RelatorioFaturamentoCaixasItem> itens = entities.collect({new RelatorioFaturamentoCaixasItem(it)})
        RelatorioExcel relatorioFaturamentoCaixas = new RelatorioFaturamentoCaixas(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                filtros: ['lote': lote.getCodigoLote()],
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioFaturamentoCaixas.gerar()
    }

    File gerarRelatorioGrupoLinhas(List<GrupoLinhaDeProducao> entities, List<String> colunas, Map<String, String> filtros, Locale locale){
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<RelatorioGrupoLinhaProducaoItem> itens = entities.collect({grupo -> grupo.produtos.collect({produto -> new RelatorioGrupoLinhaProducaoItem(produto)})}).flatten()
        RelatorioExcel relatorioGldp = new RelatorioGrupoLinhaProducao(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: filtros,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioGldp.gerar()
    }

    File gerarRelatorioFaturamentoListagem(List<FaturamentoDTO> entities, List<String> colunas, Map<String, String> filtros, Locale locale){
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<RelatorioFaturamentoListagemItem> itens = entities.collect({new RelatorioFaturamentoListagemItem(it)})
        RelatorioExcel relatorioFaturamentoListagem = new RelatorioFaturamentoListagem(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: filtros,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioFaturamentoListagem.gerar()
    }

    File gerarRelatorioPlanejamentoDiario(List<PlanejamentoDiario> entities, List<String> colunas, Map<String, String> filtros, Locale locale){
        if (entities.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }
        List<RelatorioPlanejamentoDiarioItem> itens = entities.collect({new RelatorioPlanejamentoDiarioItem(it)})
        RelatorioExcel relatorioPlanejamentoDiario = new RelatorioPlanejamentoDiario(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: filtros,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioPlanejamentoDiario.gerar()
    }

    File gerarRelatorioEtiqueta(List<ProdutoEtiqueta> entities, String serial, String codigoProduto, String etiquetas, String quantidadeAgrupamento, String copias, String grupoRecurso, Locale locale) throws RelatorioException, Exception {
        List<String> colunas = ["codigoProduto", "etiquetas", "quantidadeAgrupamento", "copias", "serial", "grupos"]

        if (entities.isEmpty()) {
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }

        List<RelatorioEtiquetaItem> itens = entities.collect({new RelatorioEtiquetaItem(it.serial as Boolean, it.codigoProduto as String, it.etiquetas.join(",") as String, it.quantidadeDeEtiquetas as Integer, it.quantidadePorImpressao as Integer, it.grupos*.nome.sort().join(",") as String)})
        Map<String, String> filtrosUsados = paramsToFilters([serial: serial, codigoProduto: codigoProduto, etiquetas: etiquetas, quantidadeAgrupamento: quantidadeAgrupamento, copias: copias, grupoRecurso: grupoRecurso])
        RelatorioExcel relatorioEtiqueta = new RelatorioEtiqueta(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: filtrosUsados,
                mensagemService: mensagemService,
                locale: locale
        )
        return relatorioEtiqueta.gerar()
    }

    Map<String, String> paramsToFilters(Map<String, String> params){
        return params
                .findAll({it.value})
    }

}
