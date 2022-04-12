package br.com.furukawa.controller

import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.importer.ImportResponse
import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.TipoApontamentoMaterial
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.ApontamentoDeMaterial
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import br.com.furukawa.service.ApontamentoDeMaterialService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.PesquisaService
import grails.converters.JSON
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest

import java.text.DateFormat
import java.text.SimpleDateFormat

class ApontamentoMaterialController extends CrudController {
    PesquisaService pesquisaService

    OracleService oracleService

    ApontamentoDeMaterialService apontamentoDeMaterialService

    def query = {
        if (params.ordemDeProducao){
            tLike('ordem_de_producao', '%' + params.ordemDeProducao + '%', delegate)
        }

        if(params.codigoProduto){
            tLike('codigo_produto', '%' + params.codigoProduto + '%', delegate)
        }

        if(params.codigoLote){
            tLike('codigo_lote', '%' + params.codigoLote + '%', delegate)
        }

        if(params.tipo && params.tipo != "TODOS"){
            tLike('tipo', '%' + params.tipo + '%', delegate)
        }

        if(params.dataInicial) {
            DateFormat sf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
            between('dataCriacao', sf.parse(params.dataInicial), sf.parse(params.dataFinal))
        }

        if(params.sort){
            order(params.sort != 'data' ? params.sort : 'dataCriacao', params.order)
        }else{
            order( 'dataCriacao', 'desc' )
        }
    }

    ApontamentoMaterialController() {
        super(ApontamentoDeMaterial)
    }

    def buscaOrdensDeProducao() {
        Fornecedor fornecedor = getFornecedorLogado()
        def model = [:]

        if(params.ordemDeProducao) {
            model.put("ordensDeProducao", pesquisaService.getOrdensProducao(fornecedor, params.ordemDeProducao as String))
        }

        respond model
    }

    def buscaMateriaisDaOrdemDeProducao() {
        def model = [:]
        Organizacao organizacao = getOrganizacaoLogada()
        Idioma linguagem = Idioma.getIdiomaByOrganizacao(organizacao)
        List<ComponenteWIP> componentes = oracleService.getComponentesRoteiroWIP(params.ordemDeProducao as String, organizacao.organizationID as Long, linguagem.descricao as String, true)
        model.put('materiais', componentes)

        respond model
    }

    def buscaLotesDisponiveisParaMateriaPrima() {
        def model = [:]

        ComponenteWIP componenteWIP = new ComponenteWIP(codigoProduto: params.codigoProduto,
                organizationId: params.long('organizationId'),
                codigoSubinventario: params.codigoSubinventario,
                locatorId: params.long('locatorId'))

        model.put('lotes', oracleService.buscarLotesDisponiveisParaTransacao(componenteWIP))

        respond model
    }

    def importar() {
        if (!(request instanceof MultipartHttpServletRequest)) {
            render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
            return
        }
        MultipartFile multipartFile = request.getFile("file")
        ImportResponse importResponse = apontamentoDeMaterialService.importar(multipartFile, getLocale())
        Fornecedor fornecedor = getFornecedorLogado()
        importResponse.validos.each {
            ApontamentoDeMaterial apontamentoDeMaterial = apontamentoDeMaterialService.salvarApontamentoDeMaterial(
                    it.codigoProduto as String,
                    it.ordemDeProducao as String,
                    it.codigoLote as String,
                    it.tipo as TipoApontamentoMaterial,
                    it.quantidade as BigDecimal,
                    fornecedor
            )

            oracleService.criaTransacaoDeAjusteDeComponenteNaOP(apontamentoDeMaterial)
        }

        def messages = []
        if (importResponse.invalidos) {
            messages.add(crudService.montaMensagem(TipoMensagem.ERROR_TYPE, "apontamentoDeMaterial.importar.erros", [importResponse.invalidos.length] as Object[]))
        }
        if (importResponse.validos) {
            messages.add(crudService.montaMensagem(TipoMensagem.SUCCESS_TYPE, "apontamentoDeMaterial.importar.sucesso", [importResponse.validos.length] as Object[]))
        }
        if (!importResponse.validos && !importResponse.invalidos) {
            messages.add(crudService.montaMensagem(TipoMensagem.WARNING_TYPE, "apontamentoDeMaterial.importar.vazio", [] as Object[]))
        }
        def response = crudService.montaListaDeMensagens(messages, getLocale())
        if (importResponse.invalidos && importResponse.fileCorrigida) {
            File file = importResponse.fileCorrigida
            response.put("fileCorrigida", file.bytes.encodeHex()?.toString())
            file.delete()
        }
        render status: 200, response as JSON
    }

    def save() {
        params.putAll(getParametros())

        ApontamentoDeMaterial apontamentoDeMaterial = apontamentoDeMaterialService.salvarApontamentoDeMaterial(
                params.codigoProduto as String,
                params.ordemDeProducao as String,
                params.codigoLote as String,
                params.tipo as TipoApontamentoMaterial,
                params.quantidade as BigDecimal,
                getFornecedorLogado()
        )

        oracleService.criaTransacaoDeAjusteDeComponenteNaOP(apontamentoDeMaterial)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, "apontamentoDeMaterial.apontamentoRealizadoComSucesso.message", getLocale()) as JSON
    }
}
