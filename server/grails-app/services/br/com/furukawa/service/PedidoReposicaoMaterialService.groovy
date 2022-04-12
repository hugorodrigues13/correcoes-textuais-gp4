package br.com.furukawa.service

import br.com.furukawa.dtos.ItemPedidoMaterialDTO
import br.com.furukawa.exceptions.ServicosException
import br.com.furukawa.model.ItemPedidoReposicaoMaterial
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.PedidoReposicaoMaterial
import br.com.furukawa.model.Recurso
import grails.gorm.transactions.Transactional

import java.text.ParseException
import java.text.SimpleDateFormat

@Transactional
class PedidoReposicaoMaterialService {

    OracleService oracleService
    CrudService crudService

    void salvarPedidoReposicaoMaterial(Long idRecurso,
                                       String chavePrimaria,
                                       String previsaoEntrega,
                                       List<ItemPedidoMaterialDTO> itens) {
        PedidoReposicaoMaterial pedidoReposicaoMaterial = new PedidoReposicaoMaterial()
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm")
        Recurso recurso = Recurso.get(idRecurso)

        validaParametrosPedidoMaterial(recurso, previsaoEntrega, chavePrimaria, itens)

        Organizacao organizacao = recurso.getOrganizacaoRecurso()
        pedidoReposicaoMaterial.chavePrimaria = chavePrimaria
        pedidoReposicaoMaterial.recurso = recurso

        try {
            pedidoReposicaoMaterial.previsaoEntrega = format.parse(previsaoEntrega)
        } catch(ParseException ignored) {
            throw new ServicosException("pedidoReposicaoMaterial.dataPrevisaoInvalida.message", null, 422)
        }

        montaItensPedidoReposicaoMaterial(itens, organizacao, pedidoReposicaoMaterial)

        pedidoReposicaoMaterial.save(flush: true, failOnError: true)
    }

    void montaItensPedidoReposicaoMaterial(List<ItemPedidoMaterialDTO> itens,
                                           Organizacao organizacao,
                                           PedidoReposicaoMaterial pedidoReposicaoMaterial) {
        itens.each {
            ItemPedidoReposicaoMaterial item = new ItemPedidoReposicaoMaterial()
            item.descricaoProduto = oracleService.getDescricaoDoProdutoComValidacao(it.codigo as String, organizacao)
            item.codigoProduto = it.codigo
            item.quantidade = it.quantidade

            validaItemPedidoMaterial(item)

            pedidoReposicaoMaterial.addToItens(item)
        }
    }

    private void validaParametrosPedidoMaterial(Recurso recurso, String previsaoEntrega, String chavePrimaria, List<ItemPedidoMaterialDTO> itens) {
        if(!itens || itens.isEmpty()) {
            throw new ServicosException("pedidoReposicaoMaterial.itens.nullable.message", null, 422)
        }

        if (!recurso) {
            throw new ServicosException("pedidoReposicaoMaterial.recurso.inexistente.message", null, 422)
        }

        if (!previsaoEntrega) {
            throw new ServicosException("pedidoReposicaoMaterial.previsaoEntrega.nullable.message", null, 400)
        }

        if (!chavePrimaria) {
            throw new ServicosException("pedidoReposicaoMaterial.chavePrimaria.nullable.message", null, 400)
        }

        // se existir outro com a mesma chave primária e estiver pendente, simplesmente informar.
        if (PedidoReposicaoMaterial.findByChavePrimariaAndIsLiberado(chavePrimaria, false)){
            throw new ServicosException("pedidoReposicaoMaterial.chavePrimaria.duplicate.message", null, 200)
        }
    }

    private void validaItemPedidoMaterial(ItemPedidoReposicaoMaterial itemPedidoReposicaoMaterial) {
        if(!itemPedidoReposicaoMaterial.codigoProduto) {
            throw new ServicosException("pedidoReposicaoMaterial.itens.codigoProduto.nullable.message", null, 422)
        }

        if(itemPedidoReposicaoMaterial.quantidade == null) {
            throw new ServicosException("pedidoReposicaoMaterial.itens.quantidade.nullable.message", [itemPedidoReposicaoMaterial.codigoProduto] as Object[], 422)
        }
    }
}
