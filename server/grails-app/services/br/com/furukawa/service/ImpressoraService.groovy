package br.com.furukawa.service

import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaFolhaImpressao
import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaApontamento
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaRomaneio

import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.TipoImpressao
import br.com.furukawa.exceptions.ImpressoraException
import br.com.furukawa.model.ConfiguracaoGeral
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.ProdutoEtiqueta
import br.com.furukawa.model.Romaneio
import br.com.furukawa.model.SerialFabricacao
import grails.gorm.transactions.Transactional
import groovy.json.JsonSlurper

import javax.net.ssl.HostnameVerifier
import javax.net.ssl.SSLSession

import static groovy.json.JsonOutput.toJson

import java.text.SimpleDateFormat


@Transactional
class ImpressoraService {

    MensagemService mensagemService
    CrudService crudService
    UserService userService
    OracleService oracleService

    List<String> getImpressoras() {
        HostnameVerifier hv = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true
            }
        }

        String url = ConfiguracaoGeral.getBaseUrlImpressoras()
        def baseURL = new URL(url)
        HttpURLConnection connection = baseURL.openConnection()

        if(connection.getResponseCode() == 200) {
            def jsonArrayString = connection
                    .getInputStream()
                    .getText()
                    .replace('response(\'', '')
                    .replace('\')', '')
                    .replaceAll('\\\\', '')

            List<String> impressoras = new JsonSlurper().parseText(jsonArrayString) as ArrayList<String>
            return impressoras.collect {it.printer}
        }else{
            throw new ImpressoraException( "impressora.erroBuscaImpressoras.message", [] )
        }
    }

    RetornoImpressao gerarEtiqueta(String jsonBody) {
        String url = ConfiguracaoGeral.getUrlGerarPdfImpressora()

        HttpURLConnection connection = createConnection(url, jsonBody)
        try{
            new RetornoImpressao(success: true, base64Etiqueta: connection.inputStream.text)
        } catch(e) {
            println url
            println connection.errorStream.text
            println jsonBody
            new RetornoImpressao(success: false, message: "Error")
        } finally {
            try {
                connection.inputStream.close()
            } catch(Exception ignored) {

            }
        }
    }

    HttpURLConnection createConnection(String url, String jsonBody) {
        URL baseURL = new URL(url)
        HttpURLConnection connection = baseURL.openConnection()
        connection.addRequestProperty("Content-Type", "application/json")
        connection.setDoOutput(true)
        connection.setRequestMethod("POST")
        OutputStream os = connection.getOutputStream()

        byte[] input = jsonBody.getBytes("utf-8")
        os.write(input, 0, input.length)

        try {
            os.flush()
            os.close()
        } catch(Exception ignored) {

        }

        return connection
    }

    HttpURLConnection createConnectionRTDA(String url, String jsonBody) {
        URL baseURL = new URL(url)
        HttpURLConnection connection = baseURL.openConnection()
        connection.addRequestProperty("Content-Type", "application/json")
        connection.setDoOutput(true)
        connection.setRequestMethod("POST")
        OutputStream os = connection.getOutputStream()

        byte[] input = jsonBody.getBytes("utf-8")
        os.write(input, 0, input.length)

        try {
            os.flush()
            os.close()
        } catch(Exception ignored) {

        }

        return connection
    }


    void sendToRTDA() {
        String url = "http://10.41.112.114:5000/gp40"

        HttpURLConnection connection = createConnectionRTDA(url, """{
                "id": "dados",
                "v": {
                    "codigo_produto": "35080007",
                    "ordem_fabricacao": "000041-21",
                    "quantidade": 899,
                    "ordem_producao": "AFC-00001C"
                },
                "t": "1640021097397",
                "n": "STF", 
                "org": "FEL", 
                "source": "gp40", 
                "topic": "gp40"
}""")
        try{
            new RetornoImpressao(success: true, base64Etiqueta: connection.inputStream.text)
        } catch(e) {
            println url
            println connection.errorStream.text
            new RetornoImpressao(success: false, message: "Error")
        } finally {
            try {
                connection.inputStream.close()
            } catch(Exception ignored) {

            }
        }
    }

    RetornoImpressao gerarEtiquetaRomaneio(Romaneio romaneio){
        String json = new ImpressaoEtiquetaRomaneio(ConfiguracaoGeral.getIdentificadorDaEtiquetaRomaneio(), romaneio).getJsonStringEtiqueta()

        return gerarEtiqueta(json)
    }

    RetornoImpressao gerarEtiquetaSerial(String codigoProduto, String codigoEtiqueta, Set<SerialFabricacao> seriais, Integer quantidade, Integer copias, String numeroCaixaIdentificador){
        if(seriais && !seriais.isEmpty()) {
            Date dataAtual = new Date()
            OrdemDeFabricacao ordemDeFabricacao = seriais.first().ordemDeFabricacao
            OrdemDeProducao ordemDeProducao = ordemDeFabricacao?.ordemDeProducao
            String jsonBody = new ImpressaoEtiquetaApontamento(
                    codigoEtiqueta,
                    seriais,
                    codigoProduto,
                    ordemDeProducao,
                    ordemDeFabricacao,
                    dataAtual,
                    quantidade,
                    copias,
                    numeroCaixaIdentificador).getJsonStringEtiqueta()
            return gerarEtiqueta(jsonBody)
        }

        return null
    }

    RetornoImpressao gerarEtiquetaFolhaImpressao(OrdemDeFabricacao ordemDeFabricacao){
        List<ComponenteWIP> mps = oracleService.getComponentesRoteiroWIP(ordemDeFabricacao.codigoOrdemDeProducao, organizacaoLogada.organizationID.toLong(), organizacaoLogada.getIdioma(), true)
        if (!mps){
            throw new ImpressoraException("ordemFabricacao.folhaImpressao.semLinhas.message")
        }
        String json = new ImpressaoEtiquetaFolhaImpressao(
                    ConfiguracaoGeral.getIdentificadorDaEtiquetaFolhaImpressao(),
                    userService.getUsuarioLogado().fullname,
                    ordemDeFabricacao,
                    oracleService.buscaCatalogoDoProduto(organizacaoLogada, ordemDeFabricacao.codigoProduto),
                    mps
        ).getJsonStringEtiqueta()
        return gerarEtiqueta(json)
    }

    ImpressaoEtiquetaFolhaImpressao gerarDadosFolhaImpressao(OrdemDeFabricacao ordemDeFabricacao){
        List<ComponenteWIP> mps = oracleService.getComponentesRoteiroWIP(ordemDeFabricacao.codigoOrdemDeProducao, organizacaoLogada.organizationID.toLong(), organizacaoLogada.getIdioma(), true)
        ImpressaoEtiquetaFolhaImpressao json = new ImpressaoEtiquetaFolhaImpressao(
                ConfiguracaoGeral.getIdentificadorDaEtiquetaFolhaImpressao(),
                userService.getUsuarioLogado().fullname,
                ordemDeFabricacao,
                oracleService.buscaCatalogoDoProduto(organizacaoLogada, ordemDeFabricacao.codigoProduto),
                mps
        )

        return json
    }

    RetornoImpressao imprimirEtiquetaApontamento(String codigoProduto, String codigoEtiqueta, Set<SerialFabricacao> seriais, Impressora impressora, Integer quantidade, Integer copias, String numeroCaixaIdentificador) {

        ImpressaoEtiquetaApontamento impressaoEtiquetaApontamento = new ImpressaoEtiquetaApontamento(
                codigoEtiqueta,
                seriais,
                codigoProduto,
                seriais.first().ordemDeFabricacao?.ordemDeProducao,
                seriais.first().ordemDeFabricacao,
                new Date(),
                quantidade,
                copias,
                numeroCaixaIdentificador
        )

        String jsonBody = impressaoEtiquetaApontamento.getJsonStringEtiqueta()

        return imprimirEtiqueta(impressora, jsonBody, codigoEtiqueta)
    }

    RetornoImpressao imprimirEtiqueta(Impressora impressora, String jsonBody, String codigoEtiqueta) {
        Organizacao organizacao = getOrganizacaoLogada()
        String url = ConfiguracaoGeral.getUrlImprimirEtiqueta() + impressora.nome

        if (ConfiguracaoGeral.isImpressaoLigada()) {
            println url
            println jsonBody
            HttpURLConnection connection = createConnection(url, jsonBody)

            try {
                return new RetornoImpressao(success: true, message: connection.inputStream.text)
            } catch (Exception ignored) {
                return new RetornoImpressao(
                    success: false,
                    message: mensagemService.getMensagem(
                        "impressora.erroAoGerarEtiquetaApontamento.message",
                        null,
                        [codigoEtiqueta] as Object[],
                        Idioma.getLocaleByOrganizacao(organizacao)
                    )
                )
            } finally {
                try {
                    connection.inputStream.close()
                } catch(Exception ignored) {

                }
            }
        } else {
            return new RetornoImpressao(
                success: true,
                message: mensagemService.getMensagem(
                    "impressora.etiquetaEnviadaParaFilaDeImpressao.message",
                    null,
                    [codigoEtiqueta] as Object[],
                    Idioma.getLocaleByOrganizacao(organizacao)
                )
            )
        }
    }

    List<RetornoImpressao> getEtiquetaSerialAposApontamento(Impressora impressora,
                                                            ImpressaoApontamentoCaixa caixa,
                                                            Integer copias) {
        List<RetornoImpressao> retornoEtiquetas = new ArrayList<>()
        ProdutoEtiqueta prodEtiqueta = caixa.impressaoLote.produtoEtiqueta
        String numeroCaixaIdentificador = caixa.numeroCaixa
        prodEtiqueta.etiquetas.each { etiqueta ->
            if (impressora.tipoImpressao == TipoImpressao.AGENTE) {
                retornoEtiquetas.add(gerarEtiquetaSerial(prodEtiqueta.codigoProduto, etiqueta, caixa.seriais, caixa.seriais.size(), copias ?: prodEtiqueta.quantidadePorImpressao, numeroCaixaIdentificador))
            } else {
                retornoEtiquetas.add(imprimirEtiquetaApontamento(prodEtiqueta.codigoProduto, etiqueta, caixa.seriais, impressora, caixa.seriais.size(), copias ?: prodEtiqueta.quantidadePorImpressao, numeroCaixaIdentificador))
            }
        }

        return retornoEtiquetas
    }

    Organizacao getOrganizacaoLogada() {
        return crudService.getOrganizacaoLogada()
    }
}
