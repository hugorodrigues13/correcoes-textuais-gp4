package br.com.furukawa.dtos.importer

import br.com.furukawa.dtos.FornecedorListaRoteiroEBSDTO
import br.com.furukawa.dtos.ProdutoDTO
import br.com.furukawa.exceptions.OrdemDeProducaoException
import br.com.furukawa.model.ClassePorPlanejador
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import br.com.furukawa.service.ClassePorPlanejadorService
import br.com.furukawa.service.MensagemService
import br.com.furukawa.service.OracleService
import br.com.furukawa.utils.DateUtils

import java.text.SimpleDateFormat

class OrdemDeProducaoImporter extends Importer {

    private final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy")

    Organizacao organizacao
    OracleService oracleService
    ClassePorPlanejadorService classePorPlanejadorService
    Fornecedor fornecedor

    OrdemDeProducaoImporter(File file, Organizacao organizacao, Fornecedor fornecedor, OracleService oracleService, ClassePorPlanejadorService classePorPlanejadorService, MensagemService mensagemService, Locale locale) {
        super(1, ["codigoProduto", "quantidade", "dataFinalizacao", "roteiro", "lista", "justificativa"],
                file, mensagemService, "geracaoOrdemProducao.importar.erros.", locale)
        this.organizacao = organizacao
        this.fornecedor = fornecedor
        this.oracleService = oracleService
        this.classePorPlanejadorService = classePorPlanejadorService
    }

    // invés de fazer uma consulta pra cada coluna
    // fazer apenas uma consultado pra cada código produto
    // idem para o fornecedor
    // assim, se 100 colunas possuirem o mesmo fornecedor, será feito apenas 1 consulta invés de 100
    @Override
    void prevalidar(Object[] objects) {
        Set<String> codigosProduto = objects*.codigoProduto
        Map<String, String> codigosProdutosValidos = codigosProduto
                .findAll({it})
                .collectEntries({it ->
                    [it, oracleService.buscarProdutos(organizacao, it, null).find({produto -> produto.codigo == it})?.codigo]})
        codigosProdutosValidos.each {entry ->
            String codigo = entry.getValue()
            def fornecedorListaRoteiros = codigo != null ? oracleService.getFornecedoresListasRoteiros(organizacao, codigo) : null
            String planejador = codigo != null ? oracleService.getPlanejadorDoProduto(organizacao, codigo) : null
            Long classePorPlanejador = codigo != null ? classePorPlanejadorService.getClassePorPlanejador(planejador, organizacao) : null

            objects.findAll({object -> object.codigoProduto == entry.getKey()}).each {object ->
                object.codigoProdutoValido = codigo
                object.fornecedorListaRoteiros = fornecedorListaRoteiros
                object.planejador = planejador
                object.classePorPlanejador = classePorPlanejador
            }
        }

        Set<String> fornecedores = objects*.fornecedor
        Map<String, Fornecedor> fornecedoresValidos = fornecedores
                .findAll({it})
                .collectEntries({[it, Fornecedor.findByOrganizationIdAndNomeIlike(organizacao?.organizationID as long, "%${it}%")]})
        fornecedoresValidos.each {entry ->
            objects.findAll({object -> object.fornecedor == entry.getKey()}).each {object ->
                object.fornecedorValido = entry.getValue()
            }
        }
    }

    @Override
    void validar(Object object) {
        if (!object.codigoProduto){
            object.erros.add("cp.nulo")
        } else {
            object.codigoProduto = object.codigoProdutoValido
            if (!object.codigoProduto){
                object.erros.add("cp.inexistente")
            }
        }
        if(!object.classePorPlanejador){
            object.erros.add("planejador.inexistente")
        }
        if (!object.quantidade){
            object.erros.add("qntd.nulo")
        } else {
            try {
                // excel utiliza "," para separar casas decimais, enquanto o java utiliza "."
                double quantidade = Double.parseDouble(object.quantidade.replace(",", "."))
                object.quantidade = quantidade.toInteger()
                if (object.quantidade <= 0){
                    object.erros.add("qntd.maiorQueZero")
                }
            } catch(e){
                object.erros.add("qntd.invalido")
            }
        }
        if (!object.dataFinalizacao){
            object.erros.add("data.nulo")
        } else {
            try {
                Date date = object.dataFinalizacao instanceof Date
                    ? object.dataFinalizacao
                    : DateUtils.corrigeAnoData(SDF.parse(object.dataFinalizacao))
                if (date < new Date()) throw new Exception()
            } catch(e){
                object.erros.add("data.invalido")
            }
        }


        if (object.fornecedorListaRoteiros){
            List<FornecedorListaRoteiroEBSDTO> listaRoteiros = object.fornecedorListaRoteiros
            if (listaRoteiros.isEmpty()){
                object.erros.add("listaRoteiro.nulo")
                object.erros.add("fornecedor.nulo")
            } else {
                if (object.roteiro == "00"){
                    object.roteiro = null
                }
                if (object.lista == "00"){
                    object.lista = null
                }
                FornecedorListaRoteiroEBSDTO fornecedorListaRoteiroEBSDTO = listaRoteiros.find({it.lista == object.lista && it.roteiro == object.roteiro && it.organizationID == organizacao.organizationID.toLong()})

                if(!fornecedorListaRoteiroEBSDTO) {
                    object.erros.add("fornecedor.invalido")
                } else {
                    object.fornecedor = Fornecedor.findByVendorIdAndOrganizationId(fornecedorListaRoteiroEBSDTO.idFornecedor as Long, organizacao.organizationID as Long)
                    object.idSite = fornecedorListaRoteiroEBSDTO.idSite
                    if (!object.fornecedor) {
                        object.erros.add("fornecedor.invalido")
                    } else {
                        if (object.fornecedor?.prefixoProducao == null){
                            object.erros.add("fornecedor.prefixo.invalido")
                        }
                        if (object.fornecedor.id != fornecedor.id){
                            object.erros.add("fornecedor.escolhido.invalido")
                        }
                    }
                }

                if (!listaRoteiros.any({it.roteiro == object.roteiro})){
                    object.erros.add("roteiro.naoPertence")
                }

                if (!listaRoteiros.any({it.lista == object.lista})){
                    object.erros.add("lista.naoPertence")
                }
            }
        } else {
            object.erros.add("fornecedor.nulo")
        }
    }
}
