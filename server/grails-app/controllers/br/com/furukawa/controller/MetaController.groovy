package br.com.furukawa.controller

import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.Meta
import br.com.furukawa.service.LinhaDeProducaoService
import br.com.furukawa.service.PesquisaService

import java.text.SimpleDateFormat

class MetaController extends CrudController {
    PesquisaService pesquisaService;
    LinhaDeProducaoService linhaDeProducaoService;

    SimpleDateFormat SDF = new SimpleDateFormat('dd/MM/yyyy HH:mm:ss')

    MetaController() {
        super(Meta);
    }

    def query = {
        createAlias('linhaDeProducao', 'l')

        if (params.linhaDeProducao) {
            eq('l.nome', params.linhaDeProducao)
        }

        if (params.metaReprocessos) {
            eq("metaReprocessos", params.metaReprocessos as BigDecimal)
        }

        if (params.metaHK) {
            eq("metaHK", params.metaHK as BigDecimal)
        }

        if (params.inicioIntervaloInicioVigencia && params.fimIntervaloInicioVigencia) {
            between("inicioVigencia", SDF.parse(params.inicioIntervaloInicioVigencia as String), SDF.parse(params.fimIntervaloInicioVigencia as String))
        }

        if (params.inicioIntervaloFimVigencia && params.fimIntervaloFimVigencia) {
            between("fimVigencia", SDF.parse(params.inicioIntervaloFimVigencia as String), SDF.parse(params.fimIntervaloFimVigencia as String))
        }

        if (params.sort) {
            order(params.sort, params.order)
        } else {
            order "inicioVigencia", "desc"
        }
    }

    @Override
    def index() {
        params.max = Math.min(params.int('max') ?: 10, 100)

        def criteria = Meta.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def linhasDeProducao = pesquisaService.getLinhasDeProducao(getFornecedorLogado());

        def total = entities.totalCount ? entities.totalCount : 0

        def model = [:]
        model.put('entities', entities)
        model.put('total', total)
        model.put('linhasDeProducao', linhasDeProducao)

        respond model
    }

    @Override
    def getInstanceEntity() {
        params.inicioVigencia = SDF.parse(params.inicioVigencia as String)
        params.fimVigencia = SDF.parse(params.fimVigencia as String)

        super.getInstanceEntity()
    }

    @Override
    def getModelPadrao(){
        def model = [:]
        List<LinhaDeProducao> linhasDeProducao =
                linhaDeProducaoService.listaUltimaVersao(null,
                        null,
                        getFornecedorLogado(),
                        null,
                        1000,
                        0,
                        null,
                        null);

        model.put('linhasDeProducao', linhasDeProducao);

        return model
    }

    def show(Long id) {
        respond Meta.findById(id);
    }
}