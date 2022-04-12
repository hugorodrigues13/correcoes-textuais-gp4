package br.com.furukawa.service

import br.com.furukawa.dtos.filtros.FiltroRomaneio
import br.com.furukawa.dtos.RomaneioEntitiesTotalDTO
import br.com.furukawa.dtos.RomaneioExportacaoDTO
import br.com.furukawa.dtos.RomaneioExportacaoLinhaDTO
import br.com.furukawa.dtos.RomaneioListaDTO
import br.com.furukawa.dtos.RomaneioEBSDTO
import br.com.furukawa.dtos.RomaneioStatusIntegracaoDTO
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioRomaneioXLSX
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioRomaneioXLSXItem
import br.com.furukawa.enums.StatusHistoricoRomaneio
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusRomaneio
import br.com.furukawa.enums.StatusRomaneioNotaFiscal
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.exceptions.RomaneioException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.HistoricoRomaneio
import br.com.furukawa.model.Lote
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Romaneio
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.ProdutoRomaneio
import br.com.furukawa.model.RomaneioNotaFiscal
import br.com.furukawa.model.ServicoRomaneio
import br.com.furukawa.model.User
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.BigDecimalType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import javax.persistence.Query
import java.text.SimpleDateFormat

class RomaneioService {

    CrudService crudService
    OracleService oracleService
    SimpleDateFormat SDF = new SimpleDateFormat("YY")
    SessionFactory sessionFactory
    UserService userService
    LogOperacaoService logOperacaoService
    MensagemService mensagemService

    List<RomaneioEBSDTO> getDadosParaRomaneioFromLotes(List<Integer> lotesIds, Organizacao organizacao){
        List<Lote> lotes = Lote.getAll(lotesIds)
        Map<String, Set<Lote>> ordemToLote = [:]
        List<String> ordensDeProducao = lotes
                .collect({Lote lote ->
                    def ordens = lote.getSeriais()*.getOrdemDeFabricacao()*.getOrdemDeProducao()
                    ordens.each {ordem ->
                        Set<Lote> ordemLotes = ordemToLote.getOrDefault(ordem.getCodigoOrdem(), new HashSet<>())
                        ordemLotes.add(lote)
                        ordemToLote.put(ordem.getCodigoOrdem(), ordemLotes)
                    }
                    return ordens
                })
                .flatten()
                .collect({ OrdemDeProducao it -> it.getCodigoOrdem()})
                .unique()

        if (ordensDeProducao.isEmpty()) return []
        List<RomaneioEBSDTO> dados = oracleService.getDadosParaRomaneio(ordensDeProducao, organizacao)
        dados.each {
            it.valido = it.servico != null && it.codigoProduto != null
            it.lote = ordemToLote.get(it.ordemDeProducao)
        }
        return dados.sort({it.valido})
    }

    RomaneioEntitiesTotalDTO buscarRomaneiosPorFiltros(FiltroRomaneio filter) {
        String sql = buscaRomaneioSql(filter)
        Integer total = getTotalRegistros(sql)
        List<RomaneioListaDTO> entidades = listaEntidades(sql, filter.max, filter.offset)

        RomaneioEntitiesTotalDTO retorno = new RomaneioEntitiesTotalDTO(entities: entidades, total: total)

        return retorno
    }

    Integer getTotalRegistros(String sqlList) {
        def sqlCount = """
            SELECT count(*)
            FROM ($sqlList)
            """

        NativeQuery queryTotal = sessionFactory.currentSession.createSQLQuery(sqlCount)

        return queryTotal.uniqueResult() as Integer
    }

    List<RomaneioListaDTO> listaEntidades(String sqlList, Integer max, Integer offset) {
        Query query = sessionFactory.currentSession.createSQLQuery(sqlList)

        query.addScalar("id", new LongType())
        query.addScalar("numero", new StringType())
        query.addScalar("ano", new StringType())
        query.addScalar("emissao", new StringType())
        query.addScalar("notaFiscalEncomenda", new StringType())
        query.addScalar("notaFiscalRetorno", new StringType())
        query.addScalar("status", new StringType())
        query.addScalar("quantidadeTotal", new BigDecimalType())
        query.addScalar("valorTotal", new BigDecimalType())
        query.setResultTransformer(Transformers.aliasToBean(RomaneioListaDTO.class))
        query.setMaxResults(max as Integer)
        query.setFirstResult(offset as Integer)


        return query.list() as List<RomaneioListaDTO>
    }

    void salvar(ArrayList<Integer> lotesIds, Fornecedor fornecedorLogado, User usuarioLogado){
        String ano = SDF.format(new Date())
        String codigo = Romaneio.getProximoNumeroRomaneio(ano)

        List<RomaneioEBSDTO> dados = getDadosParaRomaneioFromLotes(lotesIds, fornecedorLogado.getOrganizacaoDoFornecedor()).findAll({it.valido})
        Set<Lote> lotesValidos = dados*.lote.flatten().unique()
        Romaneio romaneio = new Romaneio()
        Date data = new Date()
        romaneio.emissao = data
        romaneio.numero = codigo
        romaneio.ano = ano
        romaneio.status = StatusRomaneio.ABERTO
        romaneio.fornecedor = fornecedorLogado
        romaneio.notaFiscalRetorno = new RomaneioNotaFiscal()
        romaneio.notaFiscalEncomenda = new RomaneioNotaFiscal()
        lotesValidos.each { lote ->
            lote.setStatusLote(StatusLote.ROMANEIO)
            romaneio.addToLotes(lote)
            crudService.salvar(lote)
        }

        inserirDados(romaneio, dados)

        romaneio.addToHistorico(new HistoricoRomaneio(data: data, status: StatusHistoricoRomaneio.ABERTO, usuario: usuarioLogado?.fullname))

        crudService.salvar(romaneio)
    }

    void inserirDados(Romaneio romaneio, List<RomaneioEBSDTO> dados) {
        Map<String, List<RomaneioEBSDTO>> servicos = dados.groupBy {it.servico}
        dados*.lote.flatten().unique().each {Lote lote ->
            List<OrdemDeProducao> ops = lote.getOrdensDeProducao()
            List<String> codigosServicos = ops*.codigoServico.unique()

            codigosServicos.each {codigoServico ->
                List<RomaneioEBSDTO> produtosServico = servicos.get(codigoServico)

                produtosServico.groupBy {it.precoUnitario}.each {preco ->
                    List<RomaneioEBSDTO> produtos = preco.value?.findAll({ops*.codigoOrdem.contains(it.ordemDeProducao)})
                    if (!produtos) return

                    RomaneioEBSDTO primeiroProduto = produtos.get(0)
                    ServicoRomaneio servico = new ServicoRomaneio()

                    servico.codigo = codigoServico
                    servico.unidade = primeiroProduto.unidade
                    servico.valorUnitario = primeiroProduto.precoUnitario
                    servico.lote = lote

                    produtos.each {produtoDto ->
                        ProdutoRomaneio produtoRomaneio = new ProdutoRomaneio()
                        produtoRomaneio.codigo = produtoDto.codigoProduto
                        produtoRomaneio.unidade = produtoDto.unidade
                        produtoRomaneio.quantidade = lote.seriais.findAll{serial -> serial.getCodigoOrdemExterna() == produtoDto.ordemDeProducao}.size()
                        produtoRomaneio.valorUnitario = produtoDto.precoUnitario
                        produtoRomaneio.valorTotal = produtoDto.precoUnitario * produtoDto.qtde
                        produtoRomaneio.pedidoDeCompra = produtoDto.pedido
                        produtoRomaneio.release = produtoDto.release
                        produtoRomaneio.linha = produtoDto.linha
                        produtoRomaneio.volume = Math.ceil(produtoRomaneio.quantidade / produtoDto.taxaDeConversao) as int
                        produtoRomaneio.ordemDeProducao = OrdemDeProducao.getByCodigo(produtoDto.ordemDeProducao)

                        servico.addToProdutos(produtoRomaneio)
                    }
                    servico.quantidade = servico.produtos.sum({it.quantidade}) as long
                    servico.valorTotal = servico.quantidade * servico.valorUnitario
                    romaneio.addToServicos(servico)
                }
            }
        }
    }

    File exportaRomaneioParaXlsx(Romaneio romaneio, Locale locale, List<String> colunas){
        List<ServicoRomaneio> servicos = romaneio.servicosOrdenados

        if (servicos.isEmpty()){
            throw new RelatorioException("relatorios.nadaEncontrado.message",  null)
        }

        List<RelatorioRomaneioXLSXItem> itens = new ArrayList<RelatorioRomaneioXLSXItem>()

        servicos.each({ servico ->
            itens.add(new RelatorioRomaneioXLSXItem(servico))
            servico.produtos.each { produto ->
                itens.add(new RelatorioRomaneioXLSXItem(produto))
            }
        })

        RelatorioExcel relatorioRomaneio = new RelatorioRomaneioXLSX(
                organizacao: crudService.getOrganizacaoLogada().getDescricao(),
                fornecedor: crudService.getFornecedorLogado().getNome(),
                itens: itens,
                colunas: colunas,
                filtros: ['romaneio': romaneio.codigoRomaneio],
                mensagemService: mensagemService,
                locale: locale
        )

        return relatorioRomaneio.gerar()
    }

    String buscaRomaneioSql(FiltroRomaneio filter) {
        SimpleDateFormat formatador = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        String where = " WHERE 1=1 "
        String join = " "
        String orderBy = ""

        where += " AND ROMANEIO.FORNECEDOR_ID = ${crudService.getFornecedorLogado().id} "

        if (filter.codigoProduto){
            where += " AND PRODUTO.CODIGO LIKE '%${filter.codigoProduto}%' "
        }

        if (filter.romaneio) {
            where += " AND (ROMANEIO.NUMERO || '/' || ROMANEIO.ANO) LIKE '%${filter.romaneio}%' "
        }

        if (filter.lote) {
            where += " AND (LOTE.numero_lote || LOTE.semana || LOTE.ano) LIKE '%${filter.lote?.toUpperCase()}%' "
        }

        if (filter.nota) {
            where += " AND (NF_ENCOMENDA.CODIGO like '%${filter.nota}%' OR NF_RETORNO.CODIGO like '%${filter.nota}%') "
        }

        if (filter.dataInicial && filter.dataFinal) {
            String incialFormat = formatador.format(new Date(filter.dataInicial as Long))
            String finalFormat = formatador.format(new Date(filter.dataFinal as Long))
            where += " AND ROMANEIO.EMISSAO between to_date('${incialFormat}', 'DD/MM/YYYY hh24:mi:ss') and to_date('${finalFormat}', 'DD/MM/YYYY hh24:mi:ss') "
        }

        if (filter.status) {
            where += " AND ROMANEIO.STATUS = '${filter.status}' "
        }

        if (filter.ultimas24Horas == "true") {
            Date agora = new Date()
            Calendar calendar = Calendar.getInstance()
            calendar.setTime(agora)
            calendar.add(Calendar.HOUR, -24)
            Date ultimas24horas = calendar.getTime()

            String incialFormat = formatador.format(new Date(ultimas24horas.getTime()))
            String finalFormat = formatador.format(new Date(agora.getTime()))

            where += " AND ROMANEIO.EMISSAO between to_date('${incialFormat}', 'DD/MM/YYYY hh24:mi:ss') and to_date('${finalFormat}', 'DD/MM/YYYY hh24:mi:ss') "
        }

        if (filter.ordenacao.order && filter.ordenacao.sort) {
            if (filter.ordenacao.sort == "romaneio") {
                filter.ordenacao.sort = "numero"
            }
            orderBy = " ORDER BY ${filter.ordenacao.sort == "emissao" ? "c.emissao" : filter.ordenacao.sort} ${filter.ordenacao.order} "
        }

        if(filter.numero || filter.ordemFabricacao || filter.ordemProducao) {
            String andWhere = ""

            if(filter.ordemProducao) {
                def (String fornecedor, String codigoOp) = filter.ordemProducao.split("-")
                andWhere += "${fornecedor ? " AND F.PREFIXO_PRODUCAO='${fornecedor}'" : ""} ${codigoOp ? " AND OP.NUMERO='${codigoOp}'" : ""}"
            }

            if(filter.ordemFabricacao) {
                def (String numero, String ano) = filter.ordemFabricacao.split("-")
                andWhere += " ${numero ? " AND ofa.NUMERO='${numero}'" : ""} ${ano ? " AND ofa.ano='${ano}'" : ""}"
            }

            if(filter.numero) {
                def (String numero, String ano) = filter.numero.split("-")
                andWhere += "${numero ? " AND sf.codigo='${numero}'" : ""} ${ano ? " AND sf.ano='${ano}'" : ""}"
            }

            where += """ AND ( select count(*) from (SELECT ls.lote_id, count(*) from gp40.lote_serial ls
                                  inner JOIN gp40.serial_fabricacao sf
                                         ON ls.serial_id = sf.id
                                  inner join gp40.ordem_de_fabricacao ofa
                                         ON sf.ordem_de_fabricacao_id = ofa.id
                                  inner JOIN gp40.ordem_de_producao op
                                         ON ofa.ordem_de_producao_id = op.id
                                  inner JOIN gp40.FORNECEDOR f
                                         ON op.FORNECEDOR_ID = f.id
                                         AND f.id = romaneio.fornecedor_id
                                 where 1=1
                                 ${andWhere}
            group by ls.lote_id) a where a.lote_id=lote.id) > 0"""
        }

        return """SELECT C.id AS id,
                           C.numero AS numero,
                           C.ano AS ano,
                           to_char(C.emissao, 'DD/MM/YYYY HH24:MI:SS') AS emissao,
                           C.NF_ENCOMENDA AS notaFiscalEncomenda,
                           C.NF_RETORNO AS notaFiscalRetorno,
                           C.status AS status,
                           Sum(C.quantidade)  AS quantidadeTotal,
                           Sum(C.valor_total) AS valorTotal
                    FROM  (SELECT DISTINCT ROMANEIO.id,
                                           ROMANEIO.numero,
                                           ROMANEIO.ano,
                                           ROMANEIO.emissao,
                                           NF_ENCOMENDA.CODIGO NF_ENCOMENDA,
                                           NF_RETORNO.CODIGO NF_RETORNO,
                                           ROMANEIO.status,
                                           SERVICO.quantidade,
                                           SERVICO.valor_total
                           FROM   gp40.romaneio ROMANEIO
                                  LEFT JOIN gp40.servico_romaneio SERVICO
                                         ON ROMANEIO.id = SERVICO.romaneio_id
                                  LEFT JOIN gp40.lote_romaneio LOTEROMANEIO
                                         ON ROMANEIO.id = LOTEROMANEIO.romaneio_id
                                  LEFT JOIN gp40.lote LOTE
                                         ON LOTEROMANEIO.lote_id = LOTE.id
                                  left join gp40.ROMANEIO_NF NF_ENCOMENDA
                                           on ROMANEIO.NOTA_FISCAL_ENCOMENDA_ID = NF_ENCOMENDA.ID
                                  left join gp40.ROMANEIO_NF NF_RETORNO
                                           on ROMANEIO.NOTA_FISCAL_RETORNO_ID = NF_RETORNO.ID  
                                  LEFT JOIN gp40.produto_romaneio PRODUTO
                                         ON SERVICO.id = PRODUTO.servico_id       
                                  ${join} 
                                  ${where} 
                          ) C
                    GROUP  BY C.id,
                              C.numero,
                              C.ano,
                              C.emissao,
                              C.NF_ENCOMENDA,
                              C.NF_RETORNO,
                              C.status
                    ${orderBy}
                        """
    }

    void verificarStatusIntegracaoRomaneio(Date ultimaAtualizacao) {
        List<RomaneioStatusIntegracaoDTO> romaneiosAlterados = oracleService.getRomaneiosAlteradosNoEBS(ultimaAtualizacao, null)

        salvarHistoricoRomaneioIntegracao(romaneiosAlterados)
    }

    void verificarStatusIntegracaoRomaneioDoCodigo(String codigoRomaneio) {
        List<RomaneioStatusIntegracaoDTO> romaneiosAlterados = oracleService.getRomaneiosAlteradosNoEBS(null, codigoRomaneio)

        salvarHistoricoRomaneioIntegracao(romaneiosAlterados)
    }

    boolean podeAtualizarHistoricoPorStatus(Romaneio romaneio) {
        return [StatusRomaneio.AGUARDANDO_NFF, StatusRomaneio.FALHA_NFF].contains(romaneio.status)
    }

    void salvarHistoricoRomaneioIntegracao(List<RomaneioStatusIntegracaoDTO> romaneiosAlterados){
        romaneiosAlterados.each { dto ->
            Romaneio romaneio = Romaneio.get(dto.idRomaneio)

            if ((!romaneio || !podeAtualizarHistoricoPorStatus(romaneio))) return

            if (dto.nenhumaAlteracaoNasNFs(romaneio)  && (!dto.mensagemIntegracao || dto.mensagemIntegracao == romaneio.mensagemIntegracao)) return

            HistoricoRomaneio historico = new HistoricoRomaneio()
            historico.codigoNotaFiscalEncomenda = dto.codigoNFEncomenda
            historico.codigoNotaFiscalRetorno = dto.codigoNFRetorno
            historico.statusIntegracao = dto.getStatusIntegracaoRomaneio()
            historico.data = new Date()
            historico.usuario = "EBS"
            historico.status = StatusHistoricoRomaneio.INTEGRACAO
            historico.motivo = dto.mensagemIntegracao

            if (!romaneio.notaFiscalRetorno) romaneio.notaFiscalRetorno = new RomaneioNotaFiscal()
            if (!romaneio.notaFiscalEncomenda) romaneio.notaFiscalEncomenda = new RomaneioNotaFiscal()
            // caso venha uma nota primeiro que a outra, não sobreescrever a outra como nulo
            romaneio.notaFiscalRetorno.codigo = dto.codigoNFRetorno ?: romaneio.notaFiscalRetorno.codigo
            romaneio.notaFiscalRetorno.status = dto.getStatusRomaneioNotaFiscalRetorno() ?: romaneio.notaFiscalRetorno.status
            romaneio.notaFiscalEncomenda.codigo = dto.codigoNFEncomenda ?: romaneio.notaFiscalEncomenda.codigo
            romaneio.notaFiscalEncomenda.status = dto.getStatusRomaneioNotaFiscalEncomenda() ?: romaneio.notaFiscalEncomenda.status
            romaneio.mensagemIntegracao = dto.mensagemIntegracao

            if (dto.hasErroNaIntegracao()){
                romaneio.status = StatusRomaneio.FALHA_NFF
            } else if (dto.isFinalizado()){
                romaneio.status = StatusRomaneio.FECHADO
                historico.status = StatusHistoricoRomaneio.FECHADO
            }

            romaneio.addToHistorico(historico)
            crudService.salvar(romaneio)
        }
    }

    void exportaRomaneioParaEBS(Romaneio romaneio) {
        RomaneioExportacaoDTO romaneioExportacaoDTO = new RomaneioExportacaoDTO()

        romaneioExportacaoDTO.organizationIdExecutor = 321
        romaneioExportacaoDTO.organizationIdSolicitante = 121
        romaneioExportacaoDTO.codigoRomaneio = romaneio.getCodigoRomaneio()
        romaneioExportacaoDTO.idRomaneio = romaneio.id
        romaneioExportacaoDTO.quantidadeVolume = romaneio.getVolumeEditadoOuTotalDosServicos()

        romaneio.getServicosOrdenados().each { servico ->
            RomaneioExportacaoLinhaDTO linhaServico = new RomaneioExportacaoLinhaDTO()
            linhaServico.idLinhaGP = 0
            linhaServico.inventoryItemId = oracleService.getInventoryItemIdDoProduto(romaneio.getOrganizacaoRomaneio(), servico.getCodigo())
            linhaServico.quantidade = servico.quantidade
            linhaServico.precoUnitario = servico.valorUnitario
            linhaServico.descricao = servico.getDescricao()
            romaneioExportacaoDTO.linhas.add(linhaServico)

            servico.produtos?.sort {it.ordemDeProducao?.numero}?.each { produto ->
                RomaneioExportacaoLinhaDTO linhaProduto = new RomaneioExportacaoLinhaDTO()
                linhaProduto.idLinhaGP = produto.id
                linhaProduto.inventoryItemId = oracleService.getInventoryItemIdDoProduto(romaneio.getOrganizacaoRomaneio(), produto.getCodigo())
                linhaProduto.quantidade = produto.quantidade
                linhaProduto.precoUnitario = 0
                linhaProduto.ordemDeProducao = produto.getCodigoOrdemDeProducao()
                linhaProduto.pedido = produto.pedidoDeCompra
                linhaProduto.release = produto.release
                linhaProduto.linha = produto.linha
                romaneioExportacaoDTO.linhas.add(linhaProduto)
            }
        }

        oracleService.exportaRomaneio(romaneioExportacaoDTO)
    }

    Map<String, BigDecimal> getQuantidadesPorLotePorNF(String nfRetorno, String codigoOrdemDeProducao) {
        Romaneio romaneio = Romaneio.createCriteria().list {
            notaFiscalEncomenda {
                eq 'codigo', nfRetorno
            }
        }

        if(romaneio) {
            return romaneio.getQuantidadesPorLotesDaOrdemDeProducao(codigoOrdemDeProducao)
        }

        return new HashMap<String, BigDecimal>()
    }


    void editarNotasFiscais(Romaneio romaneio, String nfEncomenda, String nfRetorno) {
        if (!userService.getUsuarioLogado().isEditorNF()){
            throw new RomaneioException("romaneio.editarNfs.naoEhEditor.message")
        }
        if (romaneio.getStatus().isAberto() && (!nfEncomenda || !nfRetorno)){
            throw new RomaneioException("romaneio.editarNfs.semNf.message")
        }

        if (nfEncomenda){
            if(!romaneio.notaFiscalEncomenda) romaneio.notaFiscalEncomenda = new RomaneioNotaFiscal()
            romaneio.notaFiscalEncomenda.codigo = nfEncomenda
            romaneio.notaFiscalEncomenda.status = StatusRomaneioNotaFiscal.FINALIZADO
        }

        if (nfRetorno){
            if(!romaneio.notaFiscalRetorno) romaneio.notaFiscalRetorno = new RomaneioNotaFiscal()
            romaneio.notaFiscalRetorno.codigo = nfRetorno
            romaneio.notaFiscalRetorno.status = StatusRomaneioNotaFiscal.FINALIZADO
        }

        criarHistoricoRomaneioManual(romaneio, nfEncomenda, nfRetorno)
        romaneio.status = StatusRomaneio.FECHADO
        crudService.salvar(romaneio)
    }

    void criarHistoricoRomaneioManual(Romaneio romaneio, String nfEncomenda, String nfRetorno){
        HistoricoRomaneio historico = new HistoricoRomaneio()
        historico.codigoNotaFiscalEncomenda = nfEncomenda
        historico.codigoNotaFiscalRetorno = nfRetorno
        historico.data = new Date()
        historico.usuario = userService.getUsuarioLogado().getFullname()
        historico.motivo = "Edição Manual"

        historico.status = StatusHistoricoRomaneio.FECHADO

        romaneio.addToHistorico(historico)
    }

}
