package br.com.furukawa.servicos

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
import br.com.furukawa.dtos.ProdutosRetornoEBSDTO
import br.com.furukawa.dtos.RomaneioEBSDTO
import br.com.furukawa.dtos.RomaneioExportacaoDTO
import br.com.furukawa.dtos.RomaneioStatusIntegracaoDTO
import br.com.furukawa.dtos.TransacaoAjusteMaterialDTO
import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.ebs.LoteTransacao
import br.com.furukawa.dtos.ebs.MovimentacaoOrdemDeProducao
import br.com.furukawa.dtos.ebs.Recebimento
import br.com.furukawa.dtos.ebs.RoteiroWIP
import br.com.furukawa.dtos.ebs.TransacaoOrdemDeProducao
import br.com.furukawa.exceptions.OracleException
import br.com.furukawa.dtos.RetornoStatusOPEBSDTO
import br.com.furukawa.model.ConfiguracaoGeral
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import org.json.JSONArray
import org.json.XML
import org.json.JSONObject
import wslite.soap.SOAPClient
import wslite.soap.SOAPResponse

import java.text.DateFormat
import java.text.SimpleDateFormat

class ClienteSOAP {
    static SOAPClient getClient(String urlMetodo) {
        String baseEBS = ConfiguracaoGeral.getCaminhoEBS()
        String url = baseEBS + urlMetodo
        return new SOAPClient(url)
    }

    static List<OrganizacaoEBSDTO> buscaOrganizacoes() {
        List<OrganizacaoEBSDTO> organizacaoArrayList = new ArrayList<OrganizacaoEBSDTO>()
        try {
            SOAPResponse response = getClient("ConsultarOrganizacoes/Proxy/ConsultarOrganizacoesProxy?wsdl").send {}

            def organizacoes = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscaOrganizacoesResponse")?.return

            if (organizacoes && organizacoes instanceof JSONArray) {
                (0..organizacoes.length()-1).each {
                    organizacaoArrayList.add(new OrganizacaoEBSDTO( ((JSONArray) organizacoes).opt(it) as JSONObject) )
                }
            }
        } catch (Exception e) {
            println e?.message
        }

        return organizacaoArrayList
    }

    static List<OrdemDeVendaEBSDTO> buscarOrdemDeVenda(Organizacao organizacao, String ov, String codigo) {
        List<OrdemDeVendaEBSDTO> ordemDeVendaArrayList = new ArrayList<OrdemDeVendaEBSDTO>()
        try {
            SOAPResponse response = getClient("ConsultarOrdensDeVenda/Proxy/ConsultarOrdensDeVendaProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarOrdensDeVenda' {
                        offset(null)
                        max(null)
                        numeroOV(ov)
                        organizationID(organizacao.organizationID.toLong())
                        language(organizacao.idioma)
                        codigoProduto(codigo)
                        dataInicio(null)
                        dataFim(null)
                    }
                }
            }

            def ordens = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarOrdensDeVendaResponse")?.return?.map?.ordensDeVenda

            if (ordens) {
                if(ordens instanceof JSONArray) {
                    (0..ordens.length()-1).each {
                        ordemDeVendaArrayList.add(new OrdemDeVendaEBSDTO( ((JSONArray) ordens).opt(it) as JSONObject) )
                    }
                } else if(ordens instanceof JSONObject) {
                    ordemDeVendaArrayList.add(new OrdemDeVendaEBSDTO( ordens as JSONObject ) )
                }
            }
        } catch (Exception e) {
            println e?.message
        }

        return ordemDeVendaArrayList
    }

    static ProdutosRetornoEBSDTO buscaProdutos(ProdutoDTO produtoDTO, Integer offse, Integer maxi) {
        ProdutosRetornoEBSDTO produtosRetorno = new ProdutosRetornoEBSDTO()
        List<ProdutoEBSDTO> arraylistOfProdutos = new ArrayList<ProdutoEBSDTO>()
        try {
            SOAPResponse response = getClient("ConsultarItens/Proxy/ConsultarItensProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarInventoryItems' {
                        organizationId(produtoDTO.organizationID)
                        offset(offse)
                        max(maxi)
                        codigo(produtoDTO.codigo)
                        descricao(produtoDTO.descricao)
                        status(produtoDTO.status)
                        language(produtoDTO.language)
                        plannerCode(produtoDTO.plannerCode)
                    }
                }
            }

            def retorno = (XML.toJSONObject(response?.text?.toString())?.get("S:Envelope")?.get("S:Body")?.get("ns0:buscarInventoryItemsResponse")?.return)?.map
            def produtos = retorno.produtos
            if (produtos) {
                if(produtos instanceof JSONArray) {
                    (0..produtos.length()-1).each {
                        arraylistOfProdutos.add(new ProdutoEBSDTO( ((JSONArray) produtos).opt(it) as JSONObject) )
                    }
                } else if(produtos instanceof JSONObject) {
                    arraylistOfProdutos.add(new ProdutoEBSDTO( produtos as JSONObject ) )
                }

                produtosRetorno.produtos = arraylistOfProdutos
                produtosRetorno.totalPages = retorno.totalPages as Integer
            }
        } catch (Exception e) {
            println e?.message
        }

        return produtosRetorno
    }

    static PedidosRetornoEBSDTO buscarPedidoPorOrdemDeProducao(OrdemDeProducao ordemDeProducao) {
        return buscarPedidosDeCompra(ordemDeProducao.fornecedor, 0, 1, null, ordemDeProducao.getCodigoOrdem())
    }

    static PedidosRetornoEBSDTO buscarPedidosPorDataDaUltimaAtualizacao(Fornecedor fornecedor, int off, int mx, Date dataUltAtualizacao) {
        String formatoOP = fornecedor ? "${fornecedor.prefixoProducao}-______" : "___-______"
        return buscarPedidosDeCompra(fornecedor, off, mx, dataUltAtualizacao, formatoOP)
    }

    static PedidosRetornoEBSDTO buscarPedidosDeCompra(Fornecedor fornecedor, int off, int mx, Date dataUltAtualizacao, String formatoOP) {
        PedidosRetornoEBSDTO pedidosRetornoEBSDTO = new PedidosRetornoEBSDTO()
        List<PedidoEBSDTO> pedidosArrayList = new ArrayList<PedidoEBSDTO>()

        try {
            SOAPResponse response = getClient("ConsultarPedidos/Proxy/ConsultarPedidosProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarPedidos' {
                        offset(off)
                        max(mx)
                        organizationID(fornecedor.organizationId)
                        formatoLote(formatoOP)
                        language(fornecedor.getOrganizacaoDoFornecedor()?.idioma)
                        dataUltimaAtualizacao(getDataUltimaAtualizacaoFormadata(dataUltAtualizacao))
                    }
                }
            }

            Map pedidosRetorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarPedidosResponse")?.return?.map
            def pedidos = pedidosRetorno.pedidos

            if (pedidos) {
                if(pedidos instanceof JSONArray) {
                    (0..pedidos.length()-1).each {
                        pedidosArrayList.add(new PedidoEBSDTO( ((JSONArray) pedidos).opt(it) as JSONObject) )
                    }
                } else if(pedidos instanceof JSONObject) {
                    pedidosArrayList.add(new PedidoEBSDTO( pedidos as JSONObject ) )
                }

                pedidosRetornoEBSDTO.pedidos = pedidosArrayList
                pedidosRetornoEBSDTO.totalPages = pedidosRetorno.totalPages as Integer
            }
        } catch (Exception e) {
            println e?.message
        }

        return pedidosRetornoEBSDTO
    }

    static List<FornecedorListaRoteiroEBSDTO> buscaFornecedoresListasRoteiros(Organizacao organizacao, String codProduto) {
        List<FornecedorListaRoteiroEBSDTO> returnList = new ArrayList<FornecedorListaRoteiroEBSDTO>()
        try {
            SOAPResponse response = getClient("ConsultarListaRoteiro/Proxy/ConsultarListaRoteiroProxy?wsdl").send{
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarFornecedoresListasRoteiros' {
                        organizationID(organizacao.organizationID)
                        codigoProduto(codProduto)
                    }
                }
            }

            def fornecedoresListasRoteiros = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarFornecedoresListasRoteirosResponse")?.return
            if (fornecedoresListasRoteiros) {
                if (fornecedoresListasRoteiros instanceof JSONArray){
                    (0..fornecedoresListasRoteiros.length()).each {
                        returnList.add(new FornecedorListaRoteiroEBSDTO( ((JSONArray) fornecedoresListasRoteiros).opt(it) as JSONObject) )
                    }
                } else if (fornecedoresListasRoteiros instanceof JSONObject){
                    returnList.add(new FornecedorListaRoteiroEBSDTO(fornecedoresListasRoteiros))
                }

            }
        } catch (Exception e) {
            e.printStackTrace()
        }
        return returnList
    }

    static FornecedoresRetornoEBSDTO buscaFornecedores(Organizacao organizacao, int maxi, int off) {
        FornecedoresRetornoEBSDTO fornecedoresRetornoEBSDTO = new FornecedoresRetornoEBSDTO()
        List<FornecedorDTO> fornecedoresArrayList = new ArrayList<FornecedorDTO>()

        try {
            SOAPResponse response = getClient("ConsultarFornecedores/Proxy/ConsultarFornecedoresProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarFornecedores' {
                        offset(off)
                        max(maxi)
                        organizationID(organizacao.organizationID)
                    }
                }
            }

            def retorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarFornecedoresResponse")?.return?.map

            def fornecedores = retorno.fornecedores

            if (fornecedores) {
                if(fornecedores instanceof JSONArray) {
                    (0..fornecedores.length()-1).each {
                        fornecedoresArrayList.add(new FornecedorDTO( ((JSONArray) fornecedores).opt(it) as JSONObject) )
                    }
                } else if(fornecedores instanceof JSONObject) {
                    fornecedoresArrayList.add(new FornecedorDTO( fornecedores as JSONObject ) )
                }

                fornecedoresRetornoEBSDTO.fornecedores = fornecedoresArrayList
                fornecedoresRetornoEBSDTO.totalPages = retorno.totalPages
            }
        } catch (Exception e) {
            println e?.message
        }

        return fornecedoresRetornoEBSDTO
    }

    static List<String> buscaPlanejadores(Organizacao organizacao) {
        List<String> planejadoresList = new ArrayList<>()
        try {
            SOAPResponse response = getClient("ConsultarPlanejadores/Proxy/ConsultarPlanejadoresProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarPlanejadores' {
                        organizationID(organizacao.organizationID)
                    }
                }
            }

            def planejadores = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarPlanejadoresResponse")?.return?.planejadores

            if (planejadores && planejadores instanceof JSONArray) {
                (0..planejadores.length()-1).each {
                    planejadoresList.add(( ((JSONArray) planejadores).opt(it) as JSONObject).plannerCode as String )
                }
            }
        } catch (Exception e) {
            println e?.message
        }

        return planejadoresList
    }

    static List<ItemCatalogoDTO> buscaCatalogoDoProduto(String codigo, Organizacao organizacao) {
        List<ItemCatalogoDTO> itemCatalogoArrayList = new ArrayList<ItemCatalogoDTO>()
        try {
            SOAPResponse response = getClient("ConsultarCatalogoDoProduto/Proxy/ConsultarCatalogoDoProdutoProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarCatalogoDoProduto' {
                        organizationID(organizacao.organizationID)
                        codigoProduto(codigo)
                    }
                }
            }

            def catalogo = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarCatalogoDoProdutoResponse")?.return

            if (catalogo && catalogo instanceof JSONArray) {
                (0..catalogo.length()-1).each {
                    itemCatalogoArrayList.add(new ItemCatalogoDTO( ((JSONArray) catalogo).opt(it) as JSONObject) )
                }
            }
        } catch (Exception e) {
            println e?.message
        }

        return itemCatalogoArrayList
    }

    static void exportarPlanoDeProcesso(OrdemDeProducaoEBSDTO ordemDeProducaoEBSDTO) {
        try {
            String xml =
                    """ <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fur="http://furukawalatam.com">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <fur:exportarOrdemDeProducao>
                            ${ordemDeProducaoEBSDTO.asXML()}
                        </fur:exportarOrdemDeProducao>
                    </soapenv:Body>
                </soapenv:Envelope>"""

            SOAPResponse response = getClient("ExportacaoOrdem/Proxy/ExportacaoOrdemProxy?wsdl").send(xml)

            Map retorno = (XML.toJSONObject(response?.text?.toString())?.get("S:Envelope")?.get("S:Body")?.get("ns0:exportarOrdemDeProducaoResponse")?.return)?.map

            if (retorno) {
                if (retorno.status != "SUCESSO") {
                    throw new OracleException("servico.erroAoExportarOrdem.message", ordemDeProducaoEBSDTO.lote, retorno.erro as String)
                }
            }
        } catch(OracleException ex) {
            throw ex
        } catch (Exception ignored) {
            throw new OracleException("servico.erroAoExportarOrdem.message", ordemDeProducaoEBSDTO.lote)
        }
    }

    static void alterarOrdemDeProducao(OrdemDeProducaoEBSDTO ordemDeProducaoEBSDTO) {
        try {
            String xml =
                    """ <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fur="http://furukawalatam.com">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <fur:atualizarOrdemDeProducao>
                            ${ordemDeProducaoEBSDTO.asXML()}
                        </fur:atualizarOrdemDeProducao>
                    </soapenv:Body>
                </soapenv:Envelope>"""

            SOAPResponse response = getClient("AtualizarOrdemProducao/Proxy/AtualizarOrdemProducaoProxy?wsdl").send(xml)

            Map retorno = (XML.toJSONObject(response?.text?.toString())?.get("S:Envelope")?.get("S:Body")?.get("ns0:atualizarOrdemDeProducaoResponse")?.return)?.map

            if (retorno) {
                if (retorno.status != "SUCESSO") {
                    throw new OracleException("servico.erroAoExportarOrdem.message", ordemDeProducaoEBSDTO.lote, retorno.erro as String)
                }
            }
        } catch(OracleException ex) {
            throw ex
        } catch (Exception ignored) {
            throw new OracleException("servico.erroAoExportarOrdem.message", ordemDeProducaoEBSDTO.lote)
        }
    }

    static RetornoStatusOPEBSDTO buscaStatusOP(String codigoOrdemDeProducao) {
        RetornoStatusOPEBSDTO retornoStatus = null

        try {
            SOAPResponse response = getClient("ConsultarStatusOrdemProducao/Proxy/ConsultarStatusOrdemProducaoProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarStatusOrdemDeProducao' {
                        codigoOP(codigoOrdemDeProducao)
                    }
                }
            }

            def retorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarStatusOrdemDeProducaoResponse")?.return

            if (retorno && retorno instanceof JSONObject) {
                retornoStatus = new RetornoStatusOPEBSDTO(retorno)
            }
        } catch (Exception e) {
            println e?.message
        }

        return retornoStatus
    }

    static List<RomaneioEBSDTO> buscaDadosParaRomaneio(List<String> ordensProducao, Long organizationID) {
        List<RomaneioEBSDTO> romaneioArrayList = new ArrayList<RomaneioEBSDTO>()
        try {
            SOAPResponse response = getClient("ConsultarDadosParaRomaneio/Proxy/ConsultarDadosParaRomaneioProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscaDadosParaRomaneio' {
                        organizationId(organizationID)
                        ordensProducao.each {ordemProducao ->
                            ordensDeProducao(ordemProducao)
                        }
                    }
                }
            }

            def retorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscaDadosParaRomaneioResponse")?.return
            def lotesRomaneio = retorno?.lotesRomaneio

            if(lotesRomaneio instanceof JSONArray) {
                (0..lotesRomaneio.length()-1).each {
                    romaneioArrayList.add(new RomaneioEBSDTO( ((JSONArray) lotesRomaneio).opt(it) as JSONObject) )
                }
            } else if(lotesRomaneio instanceof JSONObject) {
                romaneioArrayList.add(new RomaneioEBSDTO( lotesRomaneio as JSONObject ) )
            }
        } catch (Exception e) {
            println e?.message
        }

        return ordensProducao.collect {op ->
            RomaneioEBSDTO romaneioEBSDTO = romaneioArrayList.find {it.ordemDeProducao == op}
            if(!romaneioEBSDTO) {
                romaneioEBSDTO = new RomaneioEBSDTO(ordemDeProducao: op)
            }

            return romaneioEBSDTO
        }
    }

    static List<RomaneioStatusIntegracaoDTO> getStatusRomaneiosAlteradosNoEBS(Date dataUltAtualizacao, String codRomaneio) {
        List<RomaneioStatusIntegracaoDTO> romaneioArrayList = new ArrayList<RomaneioStatusIntegracaoDTO>()
        try {
            SOAPResponse response = getClient("ConsultarStatusIntegracaoRomaneioNF/Proxy/ConsultarStatusIntegracaoRomaneioNFProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscaStatusIntegracaoRomaneioNF' {
                        dataUltimaAtualizacao(getDataUltimaAtualizacaoFormadata(dataUltAtualizacao))
                        codigoRomaneio(codRomaneio)
                    }
                }
            }

            def retorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscaStatusIntegracaoRomaneioNFResponse")?.return

            if(retorno && retorno.romaneios) {
                def lotesRomaneio = retorno?.romaneios

                if(lotesRomaneio instanceof JSONArray) {
                    (0..lotesRomaneio.length()-1).each {
                        romaneioArrayList.add(new RomaneioStatusIntegracaoDTO( ((JSONArray) lotesRomaneio).opt(it) as JSONObject) )
                    }
                } else if(lotesRomaneio instanceof JSONObject) {
                    romaneioArrayList.add(new RomaneioStatusIntegracaoDTO( lotesRomaneio as JSONObject ) )
                }
            }
        } catch (Exception e) {
            println e?.message
        }

        return romaneioArrayList
    }

    static void transacionarMateriaisAjusteOP(TransacaoAjusteMaterialDTO ajusteMaterialDTO) {
        try {
            SOAPResponse response = getClient("TransacionarMateriaisAjusteOP/Proxy/TransacionarMateriaisAjusteOPProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:transacionarMateriaisAjusteOrdemDeProducao' {
                        transacao {
                            sourceLineId(ajusteMaterialDTO.sourceLineId)
                            sourceHeaderId(ajusteMaterialDTO.sourceHeaderId)
                            usuario(ajusteMaterialDTO.usuario)
                            comentario(ajusteMaterialDTO.comentario)
                            transactionTypeId(ajusteMaterialDTO.transactionTypeId)
                            codigoOrdemDeProducao(ajusteMaterialDTO.codigoOrdemDeProducao)
                            organizationId(ajusteMaterialDTO.organizationId)
                            codigoOperacao(ajusteMaterialDTO.codigoOperacao)
                            wipSupplyType(ajusteMaterialDTO.wipSupplyType)
                            language(ajusteMaterialDTO.language)
                        }
                    }
                }
            }

            Map retorno = (XML.toJSONObject(response?.text?.toString())?.get("S:Envelope")?.get("S:Body")?.get("ns0:transacionarMateriaisAjusteOrdemDeProducaoResponse")?.return)?.map

            if (retorno) {
                if (retorno.status != "SUCESSO") {
                    throw new OracleException("servico.erroAoTransacionarMateriais.message", [retorno.mensagem as String] as Object[])
                }
            }
        } catch(OracleException ex) {
            throw ex
        } catch (Exception ignored) {
            throw new OracleException("servico.erroPadraoAoTransacionarMateriais.message")
        }
    }

    static void exportarRomaneio(RomaneioExportacaoDTO romaneioExportacaoDTO) {
        try {
            String xml =
                    """ <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fur="http://furukawalatam.com">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <fur:exportarRomaneio>
                            ${romaneioExportacaoDTO.asXML()}
                        </fur:exportarRomaneio>
                    </soapenv:Body>
                </soapenv:Envelope>"""

            SOAPResponse response = getClient("ExportarRomaneio/Proxy/ExportarRomaneioProxy?wsdl").send(xml)

            Map retorno = (XML.toJSONObject(response?.text?.toString())?.get("S:Envelope")?.get("S:Body")?.get("ns0:exportarRomaneioResponse")?.return)?.map

            if (retorno) {
                if (retorno.status != "SUCESSO") {
                    throw new OracleException("servico.erroAoExportarRomaneio.message", [retorno.erro as String] as Object[])
                }
            }
        } catch(OracleException ex) {
            throw ex
        } catch (Exception ignored) {
            throw new OracleException("servico.erroPadraoAoExportarRomaneio.message")
        }
    }

    static RoteiroWIP buscaRoteiroWIPEBS(String codigoOrdemDeProducao, Long orgId, String lang) {
        RoteiroWIP roteiroWIP = null

        try {
            SOAPResponse response = getClient("ConsultarRoteiroWIP/Proxy/ConsultarRoteiroWIPProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscaRoteiroWIP' {
                        lote(codigoOrdemDeProducao)
                        organizationID(orgId)
                        language(lang)
                    }
                }
            }

            def retorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscaRoteiroWIPResponse")?.return

            if (retorno && retorno instanceof JSONObject) {
                roteiroWIP = new RoteiroWIP(retorno)
            }
        } catch (Exception e) {
            println e?.message
        }

        return roteiroWIP
    }

    static List<Recebimento> buscaRecebimentos(Date dataAtualizacao, String codigoOP) {
        List<Recebimento> recebimentos = new ArrayList<Recebimento>()

        try {
            SOAPResponse response = getClient("ConsultarRecebimentos/Proxy/ConsultarRecebimentosProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscarRecebimentos' {
                        dataUltimaAtualizacao(getDataUltimaAtualizacaoFormadata(dataAtualizacao))
                        codigoOrdemDeProducao(codigoOP)
                    }
                }
            }

            def retorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscarRecebimentosResponse")?.return
            def listaRecebimentos = retorno?.recebimentos

            if(listaRecebimentos instanceof JSONArray) {
                (0..listaRecebimentos.length()-1).each {
                    recebimentos.add(new Recebimento( ((JSONArray) listaRecebimentos).opt(it) as JSONObject) )
                }
            } else if(listaRecebimentos instanceof JSONObject) {
                recebimentos.add(new Recebimento( listaRecebimentos as JSONObject ) )
            }
        } catch (Exception e) {
            println e?.message
        }

        return recebimentos
    }

    static void movimentarOrdemDeProducao(MovimentacaoOrdemDeProducao movimentacaoOrdemDeProducao) {
        try {
            String xml =
                    """ <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fur="http://furukawalatam.com">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <fur:movimentarOrdemDeProducao>
                            ${movimentacaoOrdemDeProducao.asXML()}
                        </fur:movimentarOrdemDeProducao>
                    </soapenv:Body>
                </soapenv:Envelope>"""

            SOAPResponse response = getClient("MovimentarOrdemDeProducao/Proxy/MovimentarOrdemDeProducaoProxy?wsdl").send(xml)

            Map retorno = (XML.toJSONObject(response?.text?.toString())?.get("S:Envelope")?.get("S:Body")?.get("ns0:movimentarOrdemDeProducaoResponse")?.return)?.map

            if (retorno) {
                if (retorno.status != "SUCESSO") {
                    throw new OracleException(retorno.erro as String, null)
                }
            }
        } catch(OracleException ex) {
            throw ex
        }
    }

    static void transacionarOrdemDeProducao(TransacaoOrdemDeProducao transacaoOrdemDeProducao) {
        try {
            String xml =
                    """ <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fur="http://furukawalatam.com">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <fur:transacionarOrdemDeProducao>
                            ${transacaoOrdemDeProducao.asXML()}
                        </fur:transacionarOrdemDeProducao>
                    </soapenv:Body>
                </soapenv:Envelope>"""

            SOAPResponse response = getClient("TransacionarOrdemDeProducao/Proxy/TransacionarOrdemDeProducaoProxy?wsdl").send(xml)

            Map retorno = (XML.toJSONObject(response?.text?.toString())?.get("S:Envelope")?.get("S:Body")?.get("ns0:transacionarOrdemDeProducaoResponse")?.return)?.map

            if (retorno) {
                if (retorno.status != "SUCESSO") {
                    throw new OracleException(retorno.erro as String, null)
                }
            }
        } catch(OracleException ex) {
            throw ex
        }
    }

    static List<LoteTransacao> getLotesDisponiveisParaTransacao(ComponenteWIP componenteWIP) {
        List<LoteTransacao> lotes = new ArrayList<LoteTransacao>()

        try {
            SOAPResponse response = getClient("ConsultarLotesDisponiveisParaTransacao/Proxy/ConsultarLotesDisponiveisParaTransacaoProxy?wsdl").send {
                body('xmlns:fur': 'http://furukawalatam.com') {
                    'fur:buscaLotesDisponiveisParaTransacao' {
                        organizationID(componenteWIP.organizationId)
                        codigoProduto(componenteWIP.codigoProduto)
                        codigoSubinventario(componenteWIP.codigoSubinventario)
                        locatorId(componenteWIP.locatorId)
                    }
                }
            }

            def retorno = XML.toJSONObject(response?.text?.toString()).get("S:Envelope")?.get("S:Body")?.get("ns0:buscaLotesDisponiveisParaTransacaoResponse")?.return
            def listaLotes = retorno?.lotes

            if(listaLotes instanceof JSONArray) {
                (0..listaLotes.length()-1).each {
                    lotes.add(new LoteTransacao( ((JSONArray) listaLotes).opt(it) as JSONObject) )
                }
            } else if(listaLotes instanceof JSONObject) {
                lotes.add(new LoteTransacao( listaLotes as JSONObject ) )
            }
        } catch (Exception e) {
            println e?.message
        }

        return lotes
    }

    static String getDataUltimaAtualizacaoFormadata(Date dataUltimaAtualizacao) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
        return dataUltimaAtualizacao ? df.format(dataUltimaAtualizacao) : null
    }
}
