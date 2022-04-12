package br.com.furukawa.service

import br.com.furukawa.model.ProdutoEtiqueta
import grails.gorm.transactions.Transactional

@Transactional
class EtiquetaService {

    Set<ProdutoEtiqueta> getEtiquetasPorProdutoAndRecursos(String codigoProduto, List<Long> idsRecursos) {
        return ProdutoEtiqueta.createCriteria().list({
            eq('codigoProduto', codigoProduto)
            grupos {
                recursos {
                    'in' 'id', idsRecursos
                }
            }
        }) as Set<ProdutoEtiqueta>
    }
}
