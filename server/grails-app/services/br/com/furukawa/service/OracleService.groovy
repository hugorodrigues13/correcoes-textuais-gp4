package br.com.furukawa.service

import br.com.furukawa.dtos.FornecedorDTO
import br.com.furukawa.dtos.FornecedorListaRoteiroEBSDTO
import br.com.furukawa.dtos.FornecedoresRetornoEBSDTO
import br.com.furukawa.dtos.ItemCatalogoDTO
import br.com.furukawa.dtos.OrdemDeProducaoEBSDTO
import br.com.furukawa.dtos.OrdemDeVendaEBSDTO
import br.com.furukawa.dtos.OrganizacaoEBSDTO
import br.com.furukawa.dtos.PedidoEBSDTO
import br.com.furukawa.dtos.PedidosRetornoEBSDTO
import br.com.furukawa.dtos.ProdutoDTO
import br.com.furukawa.dtos.ProdutoEBSDTO
import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.ebs.LoteTransacao
import br.com.furukawa.dtos.ebs.MovimentacaoOrdemDeProducao
import br.com.furukawa.dtos.ebs.Recebimento
import br.com.furukawa.dtos.ebs.RoteiroWIP
import br.com.furukawa.dtos.RetornoStatusOPEBSDTO
import br.com.furukawa.dtos.RomaneioEBSDTO
import br.com.furukawa.dtos.RomaneioExportacaoDTO
import br.com.furukawa.dtos.RomaneioStatusIntegracaoDTO
import br.com.furukawa.dtos.TransacaoAjusteMaterialDTO
import br.com.furukawa.dtos.ebs.TransacaoOrdemDeProducao
import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusTransacaoRecebimento
import br.com.furukawa.exceptions.OracleException
import br.com.furukawa.exceptions.OrdemDeProducaoException
import br.com.furukawa.model.ApontamentoDeMaterial
import br.com.furukawa.model.ComponenteOPWIP
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.HistoricoApontamento
import br.com.furukawa.model.ItemCatalogo
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Produto
import br.com.furukawa.model.RecebimentoNF
import br.com.furukawa.servicos.ClienteSOAP
import grails.gorm.transactions.Transactional
import groovy.time.TimeCategory
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery

import java.text.SimpleDateFormat

@Transactional
class OracleService {
    CrudService crudService
    EmailService emailService
    OrdemDeProducaoService ordemDeProducaoService
    SessionFactory sessionFactory
    MensagemService mensagemService

    static final PRODUTO_NAO_ENCONTRADO = "Produto não encontrado!"

    void atualizaOrganizacoes() {
        List<OrganizacaoEBSDTO> organizacoes = ClienteSOAP.buscaOrganizacoes()

        List<Organizacao> organizacoesSalvar = new ArrayList<Organizacao>()

        organizacoes.each { organizacao ->
            Organizacao organizacaoGPA = Organizacao.findByOrganizationID(organizacao.id as String)
            if (!organizacaoGPA) {
                organizacaoGPA = new Organizacao(organizationID: organizacao.id as String)
            }

            organizacaoGPA.organizationCode = organizacao.codigo
            organizacaoGPA.unidadeOperacional = organizacao.unidadeOperacional
            organizacaoGPA.endereco = organizacao.endereco
            organizacaoGPA.pais = organizacao.pais
            organizacaoGPA.cidade = organizacao.cidade
            organizacaoGPA.descricao = organizacao.nome
            organizacoesSalvar.add(organizacaoGPA)
        }

        organizacoesSalvar*.save(flush: true)
    }

    void atualizarCatalogos(OrdemDeProducao op){
        List<ItemCatalogoDTO> catalogos = buscaCatalogoDoProduto(op.fornecedor.organizacaoDoFornecedor, op.codigoProduto, true)
        if(catalogos && !catalogos.isEmpty()) {
            List<ItemCatalogo> itensSalvar = new ArrayList<>()
            ItemCatalogo.findAllByCodigoProdutoAndOrganizationId(op.codigoProduto, op.fornecedor.organizationId)*.delete(flush: true)
            catalogos.each {
                itensSalvar.add(new ItemCatalogo(codigoProduto: it.codigoProduto, organizationId:  it.organizationId, nome: it.nome, valor: it.valor))
            }

            itensSalvar*.save(flush: true, failOnError: true)
        }
    }

    void atualizaListaMateriasPrimasOrdensDeProducao(OrdemDeProducao op) {
        Organizacao organizacao = op.fornecedor.getOrganizacaoDoFornecedor()
        RoteiroWIP roteiroWIP = ClienteSOAP.buscaRoteiroWIPEBS(op.getCodigoOrdem(), organizacao.organizationID.toLong(), organizacao.idioma)

        if(roteiroWIP) {
            List<ComponenteWIP> componentes = roteiroWIP.operacoes*.componentes.flatten() as List<ComponenteWIP>

            if(componentes && !componentes.isEmpty()) {
                List<ComponenteOPWIP> componentesSalvar = []
                ComponenteOPWIP.findAllByOrdemDeProducao(op)*.delete(flush: true)
                componentes.each { componente ->
                    componentesSalvar.add(new ComponenteOPWIP(componente, op))
                }

                componentesSalvar*.save(flush: true, failOnError: true)
            }
        }
    }

    void atualizaOrdemDeProducao(String codigoOrdem) {
        OrdemDeProducao ordemDeProducao = OrdemDeProducao.getByCodigo(codigoOrdem)

        List<PedidoEBSDTO> pedidosAtualizar = new ArrayList<ProdutoEBSDTO>()
        List<OrdemDeProducao> ordensDeProducaoSalvar = new ArrayList<OrdemDeProducao>()
        PedidosRetornoEBSDTO pedidosRetorno = ClienteSOAP.buscarPedidoPorOrdemDeProducao(ordemDeProducao)

        if(pedidosRetorno.pedidos) {
            pedidosAtualizar.addAll(pedidosRetorno.pedidos)
        }

        String codigoOP = ordemDeProducao.getCodigoOrdem()
        PedidoEBSDTO pedidoAtualizado = pedidosAtualizar.find {it.lote == codigoOP && !it.possuiFlagCancelado() }
        PedidoEBSDTO pedidoCancelado = pedidosAtualizar.find { it.lote == codigoOP && it.possuiFlagCancelado() }
        PedidoEBSDTO pedidoEBSDTO = pedidoCancelado ?: pedidoAtualizado

        if(pedidoEBSDTO) {
            ordemDeProducao.wipEntityID = pedidoEBSDTO.wipEntityID
            if (ordemDeProducao.quantidade != pedidoEBSDTO.qtde){
                Long qtdDispFabricacao = OrdemDeFabricacao.findAllByOrdemDeProducaoAndStatusNotEqual(ordemDeProducao, StatusOrdemFabricacao.CANCELADA)
                        .sum({ it.quantidadeTotal }) ?: 0
                ordemDeProducao.quantidadeDisponivelFabricacao = pedidoEBSDTO.qtde - qtdDispFabricacao
            }
            ordemDeProducao.quantidade = pedidoEBSDTO.qtde
            ordemDeProducao.quantidadeEntregue = pedidoEBSDTO.qtdeComplete
            ordemDeProducao.wipStatusType = StatusOrdemDeProducaoWIP.getById(pedidoEBSDTO.statusType)
            ordemDeProducao.release = pedidoEBSDTO.release
            ordemDeProducao.linha = pedidoEBSDTO.linha
            ordemDeProducao.pedido = pedidoEBSDTO.pedido
            ordemDeProducao.status = StatusOrdemProducao.EXPORTACAO_FINALIZADA
            ordemDeProducao.erroExportacao = ""
            ordemDeProducao.codigoServico = pedidoEBSDTO.codigoServico
            if(pedidoEBSDTO.dataEntrega) {
                ordemDeProducao.dataPrevisaoFinalizacao = pedidoEBSDTO.dataEntrega
            }
        } else if(ordemDeProducaoService.opPodeSerAtualizada(ordemDeProducao)) {
            RetornoStatusOPEBSDTO retornoStatus = ClienteSOAP.buscaStatusOP(codigoOP)

            if(retornoStatus) {
                if(retornoStatus.hasFalha()) {
                    ordemDeProducao.status = StatusOrdemProducao.ERRO_EXPORTACAO
                    ordemDeProducao.erroExportacao = retornoStatus.erro
                } else if(retornoStatus.isExportacaoFinalizada()) {
                    ordemDeProducao.status = StatusOrdemProducao.EXPORTACAO_FINALIZADA
                }
            }
        }

        ordensDeProducaoSalvar.add(ordemDeProducao)
        ordensDeProducaoSalvar*.save(flush: true)
    }

    void atualizaOrdensDeProducao() {
        Date dataUltimaAtualizacao
        use( TimeCategory ) {
            dataUltimaAtualizacao = new Date() - 1.hour
        }

        List<PedidoEBSDTO> pedidosAtualizar = new ArrayList<ProdutoEBSDTO>()
        List<OrdemDeProducao> ordensDeProducaoSalvar = new ArrayList<OrdemDeProducao>()

        List<Fornecedor> fornecedoresComOrdensDeProducao = OrdemDeProducao.createCriteria().listDistinct {
            projections {
                groupProperty('fornecedor')
            }
        }

        int offset = 0, max = 500

        fornecedoresComOrdensDeProducao.each {fornecedor ->
            offset = 0
            PedidosRetornoEBSDTO pedidosRetorno = buscarPedidos(fornecedor, offset, max, dataUltimaAtualizacao)

            if(pedidosRetorno.pedidos) {
                pedidosAtualizar.addAll(pedidosRetorno.pedidos)

                if (pedidosRetorno.totalPages > 1) {
                    while (offset < pedidosRetorno.totalPages * max) {
                        offset += max

                        PedidosRetornoEBSDTO pedidosPagina = buscarPedidos(fornecedor, offset, max, dataUltimaAtualizacao)

                        if(pedidosPagina.pedidos) {
                            pedidosAtualizar.addAll(pedidosPagina.pedidos)
                        }
                    }
                }
            }
        }

        List<Long> ids = ordemDeProducaoService.getOrdensDeProducaoIdsParaAtualizacaoMP()
        List<OrdemDeProducao> ordensVerificarGP = OrdemDeProducao.getAll(ids)
        List<OrdemDeProducao> ordensVerificarOracle = pedidosAtualizar.collect { OrdemDeProducao.getByCodigo(it.lote)}
        List<OrdemDeProducao> ordensVerificar = ordensVerificarGP + ordensVerificarOracle

        if(fornecedoresComOrdensDeProducao && !fornecedoresComOrdensDeProducao.isEmpty()) {
            ordensVerificar.each {ordemDeProducao ->
                String codigoOP = ordemDeProducao.getCodigoOrdem()
                PedidoEBSDTO pedidoAtualizado = pedidosAtualizar.find {it.lote == codigoOP && !it.possuiFlagCancelado() }
                PedidoEBSDTO pedidoCancelado = pedidosAtualizar.find { it.lote == codigoOP && it.possuiFlagCancelado() }
                PedidoEBSDTO pedidoEBSDTO = pedidoCancelado ?: pedidoAtualizado

                if(pedidoEBSDTO) {
                    ordemDeProducao.wipEntityID = pedidoEBSDTO.wipEntityID
                    if (ordemDeProducao.quantidade != pedidoEBSDTO.qtde){
                        Long qtdDispFabricacao = OrdemDeFabricacao.findAllByOrdemDeProducaoAndStatusNotEqual(ordemDeProducao, StatusOrdemFabricacao.CANCELADA)
                                .sum({ it.quantidadeTotal }) ?: 0
                        ordemDeProducao.quantidadeDisponivelFabricacao = pedidoEBSDTO.qtde - qtdDispFabricacao
                    }
                    ordemDeProducao.quantidade = pedidoEBSDTO.qtde
                    ordemDeProducao.quantidadeEntregue = pedidoEBSDTO.qtdeComplete
                    ordemDeProducao.wipStatusType = StatusOrdemDeProducaoWIP.getById(pedidoEBSDTO.statusType)
                    ordemDeProducao.release = pedidoEBSDTO.release
                    ordemDeProducao.linha = pedidoEBSDTO.linha
                    ordemDeProducao.pedido = pedidoEBSDTO.pedido
                    ordemDeProducao.status = StatusOrdemProducao.EXPORTACAO_FINALIZADA
                    ordemDeProducao.erroExportacao = ""
                    ordemDeProducao.codigoServico = pedidoEBSDTO.codigoServico
                    if(pedidoEBSDTO.dataEntrega) {
                        ordemDeProducao.dataPrevisaoFinalizacao = pedidoEBSDTO.dataEntrega
                    }
                } else if(ordemDeProducaoService.opPodeSerAtualizada(ordemDeProducao)) {
                    RetornoStatusOPEBSDTO retornoStatus = ClienteSOAP.buscaStatusOP(codigoOP)

                    if(retornoStatus) {
                        if(retornoStatus.hasFalha()) {
                            ordemDeProducao.status = StatusOrdemProducao.ERRO_EXPORTACAO
                            ordemDeProducao.erroExportacao = retornoStatus.erro
                        } else if(retornoStatus.isExportacaoFinalizada()) {
                            ordemDeProducao.status = StatusOrdemProducao.EXPORTACAO_FINALIZADA
                        }
                    }
                }

                ordensDeProducaoSalvar.add(ordemDeProducao)
            }

            ordensDeProducaoSalvar*.save(flush: true)
        }
    }

    void atualizaFornecedores() {
        List<Fornecedor> fornecedoresSalvar = new ArrayList<Fornecedor>()
        List<FornecedorDTO> fornecedoresAtualizar = new ArrayList<FornecedorDTO>()
        List<Organizacao> todasAsOrganizacoes = Organizacao.getAll()

        int offset = 0, max = 500

        todasAsOrganizacoes.each { organizacao ->
            offset = 0
            FornecedoresRetornoEBSDTO fornecedoresRetorno = buscarFornecedores(organizacao, max, offset)

            if(fornecedoresRetorno.fornecedores) {
                fornecedoresAtualizar.addAll(fornecedoresRetorno.fornecedores)

                if (fornecedoresRetorno.totalPages > 1) {
                    while (offset < fornecedoresRetorno.totalPages * max) {
                        offset += max

                        FornecedoresRetornoEBSDTO fornecedoresPagina = buscarFornecedores(organizacao, max, offset)

                        if(fornecedoresPagina.fornecedores) {
                            fornecedoresAtualizar.addAll(fornecedoresPagina.fornecedores)
                        }
                    }
                }
            }
        }

        fornecedoresAtualizar.each { FornecedorDTO fornecedor ->
            Fornecedor fornecedorGP = Fornecedor.findByVendorIdAndOrganizationId(fornecedor.vendorID, fornecedor.organizationID)
            if (!fornecedorGP) {
                fornecedorGP = new Fornecedor(vendorId: fornecedor.vendorID, organizationId: fornecedor.organizationID)
            }

            if( fornecedorGP.nome != fornecedor.vendorName) {
                fornecedorGP.nome = fornecedor.vendorName
                fornecedoresSalvar.add(fornecedorGP)
            }
        }

        fornecedoresSalvar*.save(flush: true)
    }

    List<String> getPlanejadores(Organizacao organizacao) {
        return ClienteSOAP.buscaPlanejadores(organizacao)
    }

    List<OrdemDeVendaEBSDTO> buscaOrdensDeVenda(Organizacao organizacao, String numeroOV, String codigoProduto) {
        return ClienteSOAP.buscarOrdemDeVenda(organizacao, numeroOV, codigoProduto)
    }

    List<OrdemDeVendaEBSDTO> buscarOrdensDeVendaComFornecedores(Organizacao organizacao, String numeroOV, String codigoProduto) {
        List<OrdemDeVendaEBSDTO> ordensDeVendaEBS = buscaOrdensDeVenda(organizacao, numeroOV, codigoProduto)
        List<String> produtos = ordensDeVendaEBS*.codigoProduto.unique()
        produtos.each {produto ->
            List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros = getFornecedoresListasRoteiros(organizacao, produto)
            ordensDeVendaEBS.find({it.codigoProduto == produto}).fornecedoresListasRoteiros = fornecedoresListasRoteiros
            for (def ordem : ordensDeVendaEBS){
                if (ordem.codigoProduto == produto){
                    ordem.fornecedoresListasRoteiros = fornecedoresListasRoteiros
                }
            }
        }
        // TODO checar se não tem fornecedoresListasRoteiros será movido para o serviço soap
        return ordensDeVendaEBS.findAll({!it.fornecedoresListasRoteiros.isEmpty()})
    }

    List<ProdutoEBSDTO> buscarProdutos(Organizacao organizacao, String codigo, String descricao) {
        ProdutoDTO produtoDTO = new ProdutoDTO(organizationID: organizacao.organizationID.toLong(),
                codigo: codigo,
                descricao: descricao,
                status: 'Active',
                language: organizacao.idioma)
        return ClienteSOAP.buscaProdutos(produtoDTO, 0, 5).produtos
    }

    List<ItemCatalogoDTO> buscaCatalogoDoProduto(Organizacao organizacao, String codigoProduto, boolean buscarDoOracle = false) {
        if(buscarDoOracle) {
            return ClienteSOAP.buscaCatalogoDoProduto(codigoProduto, organizacao)?.sort {it.nome}
        } else {
            List<ItemCatalogo> itens = ItemCatalogo.findAllByCodigoProdutoAndOrganizationId(codigoProduto, organizacao.organizationID.toLong())
            return itens.collect {
                new ItemCatalogoDTO(it)
            }?.sort {it.nome}
        }
    }

    FornecedoresRetornoEBSDTO buscarFornecedores(Organizacao organizacao, int max, int offset) {
        return ClienteSOAP.buscaFornecedores(organizacao, max, offset)
    }

    void exportarOrdemDeProducao(OrdemDeProducao ordemDeProducao, Organizacao organizacao, String contaContabil) {
        String dataFormatada = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(ordemDeProducao.dataPrevisaoFinalizacao)

        OrdemDeProducaoEBSDTO ordemDeProducaoEBSDTO = new OrdemDeProducaoEBSDTO()
        ordemDeProducaoEBSDTO.organizationID = organizacao.organizationID.toLong()
        ordemDeProducaoEBSDTO.contaContabil = contaContabil
        ordemDeProducaoEBSDTO.user = "VZIPPERER"
        ordemDeProducaoEBSDTO.lote = ordemDeProducao.getCodigoOrdem()
        ordemDeProducaoEBSDTO.codigoProduto = ordemDeProducao.codigoProduto
        ordemDeProducaoEBSDTO.roteiro = ordemDeProducao.roteiro
        ordemDeProducaoEBSDTO.lista = ordemDeProducao.lista
        ordemDeProducaoEBSDTO.dataPrevisaoFinalizacao = dataFormatada
        ordemDeProducaoEBSDTO.quantidade = ordemDeProducao.quantidade
        ordemDeProducaoEBSDTO.groupID = 10001
        ordemDeProducaoEBSDTO.idFornecedor = ordemDeProducao.fornecedor?.vendorId
        ordemDeProducaoEBSDTO.idSite = ordemDeProducao.idSite

        ClienteSOAP.exportarPlanoDeProcesso(ordemDeProducaoEBSDTO)

        ordemDeProducao.status = StatusOrdemProducao.EXPORTACAO_INICIADA

        ordemDeProducao.save(flush: true)
    }

    void alterarOrdemDeProducao(OrdemDeProducao ordemDeProducao, Organizacao organizacao) {
        String dataFormatada = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(ordemDeProducao.dataPrevisaoFinalizacao)

        OrdemDeProducaoEBSDTO ordemDeProducaoEBSDTO = new OrdemDeProducaoEBSDTO()
        ordemDeProducaoEBSDTO.organizationID = organizacao.organizationID.toLong()
        ordemDeProducaoEBSDTO.user = "VZIPPERER"
        ordemDeProducaoEBSDTO.lote = ordemDeProducao.getCodigoOrdem()
        ordemDeProducaoEBSDTO.codigoProduto = ordemDeProducao.codigoProduto
        ordemDeProducaoEBSDTO.roteiro = ordemDeProducao.roteiro
        ordemDeProducaoEBSDTO.lista = ordemDeProducao.lista
        ordemDeProducaoEBSDTO.dataPrevisaoFinalizacao = dataFormatada
        ordemDeProducaoEBSDTO.quantidade = ordemDeProducao.quantidade
        ordemDeProducaoEBSDTO.groupID = 10001
        ordemDeProducaoEBSDTO.statusType = ordemDeProducao.wipStatusType?.id

        ClienteSOAP.alterarOrdemDeProducao(ordemDeProducaoEBSDTO)
    }

    RoteiroWIP getRoteiroWIP(String codigoOrdemDeProducao, Long organizationId, String language) {
        return ClienteSOAP.buscaRoteiroWIPEBS(codigoOrdemDeProducao, organizationId, language)
    }

    List<ComponenteWIP> getComponentesRoteiroWIP(String codigoOrdemDeProducao, Long organizationId, String language, boolean verificaOracle) {
        List<ComponenteOPWIP> componentes = ComponenteOPWIP.findAllByOrdemDeProducao(OrdemDeProducao.getByCodigo(codigoOrdemDeProducao))

        if(componentes && !componentes.isEmpty()) {
            return componentes.collect {ComponenteWIP.montaPorComponenteOP(it)}
        } else if(verificaOracle) {
            RoteiroWIP roteiroWIP = ClienteSOAP.buscaRoteiroWIPEBS(codigoOrdemDeProducao, organizationId, language)

            if(!roteiroWIP) {
                throw new OrdemDeProducaoException("ordemDeProducao.naoEncontradaNoOracle.message", [codigoOrdemDeProducao] as Object[])
            }

            return roteiroWIP.operacoes*.componentes.flatten() as List<ComponenteWIP>
        } else {
            return []
        }
    }

    PedidosRetornoEBSDTO buscarPedidos(Fornecedor fornecedor, int offset, int max, Date dataUltimaAtualizacao) {
        return ClienteSOAP.buscarPedidosPorDataDaUltimaAtualizacao(fornecedor, offset, max, dataUltimaAtualizacao)
    }

    @Transactional(readOnly = true)
    String getDescricaoDoProduto(String codigoProduto, Organizacao organizacao = getOrganizacaoLogada()) {
        Produto produto = Produto.findByCodigoAndOrganizationId(codigoProduto, organizacao.organizationID.toLong())

        if(produto) {
            return produto.descricao
        }

        List<ProdutoEBSDTO> produtos = buscarProdutos(organizacao, codigoProduto, '')

        if(produtos && !produtos.isEmpty())
            return produtos.first().descricao

        return PRODUTO_NAO_ENCONTRADO
    }

    String getDescricaoDoProdutoComValidacao(String codigoProduto, Organizacao organizacao) {
        String descricao = getDescricaoDoProduto(codigoProduto, organizacao)

        if(descricao == PRODUTO_NAO_ENCONTRADO)
            throw new OracleException("oracle.produtoNaoEncontradoParaOrganizacao.message", [codigoProduto, organizacao.organizationCode] as Object[])

        return descricao
    }

    Organizacao getOrganizacaoLogada() {
        return crudService.getOrganizacaoLogada()
    }

    List<FornecedorListaRoteiroEBSDTO> getFornecedoresListasRoteiros(Organizacao organizacao, String codigoProduto) {
        List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros = ClienteSOAP.buscaFornecedoresListasRoteiros(organizacao, codigoProduto)
        fornecedoresListasRoteiros.findAll {
            !it.idFornecedor && it.codigoProduto && it.organizationID && it.organizationID != 121 // se não tiver fornecedor, mas tiver código e organização
        }.each {
            Fornecedor padrao = Fornecedor.getFurukawaEletricLatamSa(it.organizationID)
            it.idFornecedor = padrao.vendorId
            it.nomeFornecedor = padrao.nome
        }
        fornecedoresListasRoteiros.removeIf {it.nomeFornecedor == null }
        return fornecedoresListasRoteiros
    }

    String getPlanejadorDoProduto(Organizacao organizacao, String codigoProduto) {
        List<ProdutoDTO> produtos = buscarProdutos(organizacao, codigoProduto, '')

        if(produtos && !produtos.isEmpty())
            return produtos.first().plannerCode

        return PRODUTO_NAO_ENCONTRADO
    }

    Long getInventoryItemIdDoProduto(Organizacao organizacao, String codigoProduto) {
        List<ProdutoDTO> produtos = buscarProdutos(organizacao, codigoProduto, '')

        if(produtos && !produtos.isEmpty())
            return produtos.first().inventoryItemId

        return null
    }

    void criaTransacaoDeAjusteDeComponenteNaOP(TransacaoAjusteMaterialDTO transacao) {
        ClienteSOAP.transacionarMateriaisAjusteOP(transacao)
    }

    List<RomaneioEBSDTO> getDadosParaRomaneio(List<String> ordensDeProducao, Organizacao organizacao) {
        return ClienteSOAP.buscaDadosParaRomaneio(ordensDeProducao, organizacao.organizationID.toLong())
    }

    void exportaRomaneio(RomaneioExportacaoDTO romaneioExportacaoDTO) {
        ClienteSOAP.exportarRomaneio(romaneioExportacaoDTO)
    }

    List<RomaneioStatusIntegracaoDTO> getRomaneiosAlteradosNoEBS(Date ultimaAtualizacao, String codigoRomaneio){
        return ClienteSOAP.getStatusRomaneiosAlteradosNoEBS(ultimaAtualizacao, codigoRomaneio)
    }

    void atualizaRecebimentos() {
        Date dataUltimaAtualizacao
        use( TimeCategory ) {
            dataUltimaAtualizacao = new Date() - 12.hour
        }

        List<Recebimento> recebimentos = ClienteSOAP.buscaRecebimentos(dataUltimaAtualizacao, null)
        List<RecebimentoNF> recebimentosSalvar = new ArrayList<>()

        recebimentos.each {recebimento ->
            RecebimentoNF recebimentoNF = RecebimentoNF.findByInterfaceTransactionId(recebimento.interfaceTransactionId)

            if(!recebimentoNF) {
                recebimentoNF = new RecebimentoNF(interfaceTransactionId: recebimento.interfaceTransactionId)
                recebimentoNF.ordemDeProducao = recebimento.ordemDeProducao
                recebimentoNF.notaFiscal = recebimento.notaFiscal
                recebimentoNF.quantidade = recebimento.quantidade
                recebimentoNF.sequenciaOperacao = recebimento.sequenciaOperacao
                recebimentoNF.dataCriacao = new Date()
                recebimentoNF.dataUltimaAtualizacao = new Date()

                recebimentosSalvar.add(recebimentoNF)
            }
        }

        recebimentosSalvar*.save(flush: true, failOnError: true)
    }

    void movimentaOrdensDeProducao(RecebimentoNF recebimentoNF) {
            OrdemDeProducao op = OrdemDeProducao.getByCodigo(recebimentoNF.ordemDeProducao)
            if(op) {
                Organizacao organizacao = op.getOrganizacaoOP()
                Long organizationId = organizacao?.organizationID?.toLong()
                if(recebimentoNF.getQuantidadeLotes()?.size()) {
                    RoteiroWIP roteiroWIP = getRoteiroWIP(recebimentoNF.ordemDeProducao, organizationId, organizacao?.idioma)
                    if(roteiroWIP) {
                        MovimentacaoOrdemDeProducao movimentacaoOrdemDeProducao = new MovimentacaoOrdemDeProducao(recebimentoNF, organizationId, roteiroWIP)

                        try {
                            ClienteSOAP.movimentarOrdemDeProducao(movimentacaoOrdemDeProducao)
                            recebimentoNF.status = StatusTransacaoRecebimento.MOVIMENTADA
                        } catch(OracleException ex) {
                            recebimentoNF.erroExportacao = ex.mensagem
                        } catch(Exception ex) {
                            recebimentoNF.erroExportacao = ex.message
                        }
                    } else {
                        recebimentoNF.erroExportacao = "Estrutura WIP não encontrada."
                    }
                } else {
                    recebimentoNF.erroExportacao = "Lotes não encontrados para transação."
                }

                recebimentoNF.dataUltimaAtualizacao = new Date()
                recebimentoNF.save(flush: true)
            }
    }

    void concluirOrdensDeProducao(RecebimentoNF recebimentoNF) {
        OrdemDeProducao op = OrdemDeProducao.getByCodigo(recebimentoNF.ordemDeProducao)
        if(op) {
            Organizacao organizacao = op.getOrganizacaoOP()
            Long organizationId = organizacao?.organizationID?.toLong()
            RoteiroWIP roteiroWIP = getRoteiroWIP(recebimentoNF.ordemDeProducao, organizationId, organizacao?.idioma)

            if(roteiroWIP) {
                TransacaoOrdemDeProducao transacaoOrdemDeProducao = TransacaoOrdemDeProducao.criaTransacaoConclusao(recebimentoNF, op, roteiroWIP)

                if(transacaoOrdemDeProducao.itens.any {it.lotes.size()}) {
                    try {
                        ClienteSOAP.transacionarOrdemDeProducao(transacaoOrdemDeProducao)
                        recebimentoNF.status = StatusTransacaoRecebimento.CONCLUIDA
                    } catch(OracleException ex) {
                        recebimentoNF.erroExportacao = ex.mensagem
                    } catch(Exception ex) {
                        recebimentoNF.erroExportacao = ex.message
                    }
                } else {
                    recebimentoNF.erroExportacao = "Lotes não encontrados para transação."
                }
            } else {
                recebimentoNF.erroExportacao = "Estrutura WIP não encontrada."
            }

            recebimentoNF.dataUltimaAtualizacao = new Date()
            recebimentoNF.save(flush: true)
        }
    }

    void transacionarApontamentosPendentes(){
        List<HistoricoApontamento> historicos = HistoricoApontamento.findAllByPendenteTransacao(true)
        if (!historicos) return
        historicos.each {ultimoHistorico ->
            String codigoOperacao = ultimoHistorico?.grupoRecurso?.operacao

            if(ultimoHistorico && codigoOperacao) {
                Organizacao organizacao = ultimoHistorico.organizacaoDoFornecedor
                try {

                    String codigoOP = ultimoHistorico.apontamento.serial.getCodigoOrdemExterna()

                    TransacaoAjusteMaterialDTO transacao = new TransacaoAjusteMaterialDTO()
                    transacao.sourceLineId = ultimoHistorico.id
                    transacao.sourceHeaderId = ultimoHistorico.id
                    transacao.codigoOrdemDeProducao = codigoOP
                    transacao.organizationId = organizacao.organizationID.toLong()
                    transacao.codigoOperacao = codigoOperacao
                    transacao.language = organizacao.getIdioma()

                    ClienteSOAP.transacionarMateriaisAjusteOP(transacao)
                    ultimoHistorico.erroTransacao = null // remove o erro caso tenha ocorrido um erro na ultima job
                } catch(OracleException e){
                    ultimoHistorico.erroTransacao = mensagemService.getMensagem(e.mensagem, e.message, e.args, Idioma.getLocaleByOrganizacao(organizacao))
                } catch(Exception ex){
                    ultimoHistorico.erroTransacao = ex.message
                }

                ultimoHistorico.save(flush: true)
            }
        }
        atualizarApontamentosNaoTransacionados(historicos.findAll({!it.erroTransacao})*.id)
    }

    void atualizarApontamentosNaoTransacionados(List<Long> ids){
        if (ids) {
            String updateQuery = """
            UPDATE gp40.HISTORICO_APONTAMENTO hist
            SET hist.pendente_transacao = 0
            WHERE hist.id IN (${ids.join(", ")})
            """
            NativeQuery query = sessionFactory.currentSession.createSQLQuery(updateQuery)
            query.executeUpdate()
        }
    }

    List<LoteTransacao> buscarLotesDisponiveisParaTransacao(ComponenteWIP componenteWIP) {
        return ClienteSOAP.getLotesDisponiveisParaTransacao(componenteWIP)
    }

    void criaTransacaoDeAjusteDeComponenteNaOP(ApontamentoDeMaterial apontamentoDeMaterial) {
        OrdemDeProducao op = OrdemDeProducao.getByCodigo(apontamentoDeMaterial.ordemDeProducao)
        if(op) {
            Organizacao organizacao = op.getOrganizacaoOP()
            Long organizationId = organizacao?.organizationID?.toLong()
            RoteiroWIP roteiroWIP = getRoteiroWIP(apontamentoDeMaterial.ordemDeProducao, organizationId, organizacao?.idioma)

            if(roteiroWIP) {
                TransacaoOrdemDeProducao transacaoOrdemDeProducao = TransacaoOrdemDeProducao.criaTransacaoAjusteComponente(apontamentoDeMaterial, op, roteiroWIP)
                    try {
                        ClienteSOAP.transacionarOrdemDeProducao(transacaoOrdemDeProducao)
                    } catch(OracleException ex) {
                        apontamentoDeMaterial.erroExportacao = ex.mensagem
                    } catch(Exception ex) {
                        apontamentoDeMaterial.erroExportacao = ex.message
                    }
            } else {
                apontamentoDeMaterial.erroExportacao = "Estrutura WIP não encontrada."
            }
        }
    }

    void atualizaProdutoDaOrdemDeProducao(OrdemDeProducao ordemDeProducao) {
        PedidosRetornoEBSDTO retorno = ClienteSOAP.buscarPedidoPorOrdemDeProducao(ordemDeProducao)
        PedidoEBSDTO pedidoEBSDTO

        if(retorno && retorno.pedidos && !retorno.pedidos?.isEmpty() && (pedidoEBSDTO = retorno.pedidos.first())) {
            Produto produto = Produto.findByCodigoAndOrganizationId(pedidoEBSDTO.codigoProduto, pedidoEBSDTO.organizationID)

            if(!produto) {
                produto = new Produto(codigo: pedidoEBSDTO.codigoProduto, organizationId: pedidoEBSDTO.organizationID)
            }

            produto.codigosDUN?.clear()

            produto.inventoryItemId = pedidoEBSDTO.inventoryItemID
            produto.descricao = pedidoEBSDTO.descricaoProduto
            produto.codigoEAN13 = pedidoEBSDTO.ean13
            produto.statusCode = pedidoEBSDTO.inventoryItemStatusCode
            produto.tipo = pedidoEBSDTO.tipo
            produto.peso = pedidoEBSDTO.peso
            produto.pesoEmbalagem = pedidoEBSDTO.pesoEmbalagem
            produto.plannerCode = pedidoEBSDTO.plannerCode

            pedidoEBSDTO.codigosDun.each {
                produto.addToCodigosDUN(codigo: it.codigoDun, conversionRate: it.conversionRate, unidade: it.unidade)
            }

            produto.save(flush: true, failOnError: true)
        }
    }
}
