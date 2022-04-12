import { all } from "redux-saga/effects";
import loginSaga from "./Login/loginSaga";
import userSaga from "./User/saga";
import auditoriaSaga from "./Auditoria/auditoriaSaga";
import logOperacaoSaga from "./LogOperacao/logOperacaoSaga";
import perfilSaga from "./Perfil/saga";
import confGeral from "./ConfiguracaoGeral/configGeralSaga";
import organizacaoSaga from "./Organizacao/saga";
import conector from "./Conector/saga";
import acessoSaga from "./Acesso/saga"
import recursoSaga from "./Recurso/saga"
import grupoRecursoSaga from "./GrupoRecurso/saga";
import grupoLinhaDeProducao from "./GrupoLinhaProducao/saga";
import classePorPlanejador from "./ClassePorPlanejador/saga";
import defeitoSaga from "./Defeito/Saga"
import produtoEtiquetaSaga from "./produtoEtiqueta/saga"
import impressoraSaga from "./Impressora/saga"
import geracaoOrdemDeProducaoSaga from "./GeracaoOrdemDeProducao/saga"
import linhaDeProducaoSaga from "./LinhaDeProducao/saga";
import prefixoProducaoFornecedorSaga from "./PrefixoProducaoFornecedor/saga"
import apontamentoSaga from "./Apontamento/saga"
import sequenciamentoSaga from "./Sequenciamento/saga"
import acompanhamentoOrdemProducaoSaga from "./AcompanhamentoOrdemProducao/saga";
import apoioSaga from "./Apoio/saga";
import faturamentoSaga from "./Faturamento/saga";
import serialSaga from "./Serial/saga";
import almoxarifadoSaga from "./Almoxarifado/saga";
import dashboardProgramacaoSaga from "./DashboardProgramacao/saga";
import dashboardProducaoSaga from "./DashboardProducao/saga"
import relatoriosSaga from "./Relatorios/saga"
import producaoSaga from "./Producao/saga"
import romaneioSaga from "./Romaneio/saga";
import ordemFabricacaoSaga from "./OrdemDeFabricacao/saga";
import motivoParadaSaga from "./MotivosDeParada/saga";
import tempoApontamentoSaga from "./TempoApontamento/saga";
import reimpressaoEtiquetasSaga from "./ReimpressaoEtiquetas/saga";
import paradaSaga from "./Parada/saga";
import turnosSaga from "./Turno/saga";
import recebimentoSaga from "./Recebimento/saga"
import planejamentoDiarioSaga from "./PlanejamentoDiario/saga";
import apontamentosPendentesSaga from "./ApontamentosPendentes/saga";
import asaichiSaga from "./Asaichi/saga";
import metasSaga from './Metas/saga';
import transformacaoLoteSaga from "./TransformacaoLote/saga";
import apontamentoDeMaterialSaga from './ApontamentoDeMaterial/saga';

export default function* rootSaga() {
  yield all([
    loginSaga,
    userSaga,
    auditoriaSaga,
    logOperacaoSaga,
    perfilSaga,
    confGeral,
    organizacaoSaga,
    grupoRecursoSaga,
    conector,
    recursoSaga,
    acessoSaga,
    defeitoSaga,
    grupoLinhaDeProducao,
    classePorPlanejador,
    impressoraSaga,
    produtoEtiquetaSaga,
    geracaoOrdemDeProducaoSaga,
    linhaDeProducaoSaga,
    prefixoProducaoFornecedorSaga,
    apontamentoSaga,
    sequenciamentoSaga,
    acompanhamentoOrdemProducaoSaga,
    apoioSaga,
    faturamentoSaga,
    serialSaga,
    almoxarifadoSaga,
    dashboardProgramacaoSaga,
    dashboardProducaoSaga,
    metasSaga,
    relatoriosSaga,
    producaoSaga,
    romaneioSaga,
    ordemFabricacaoSaga,
    motivoParadaSaga,
    tempoApontamentoSaga,
    reimpressaoEtiquetasSaga,
    turnosSaga,
    planejamentoDiarioSaga,
    paradaSaga,
    recebimentoSaga,
    apontamentosPendentesSaga,
    asaichiSaga,
    transformacaoLoteSaga,
    apontamentoDeMaterialSaga
  ]);
}
