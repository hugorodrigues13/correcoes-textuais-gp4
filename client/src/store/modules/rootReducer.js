import { combineReducers } from "redux";
import { alertasReducer } from "./Alertas/alertasReducer";
import { sessaoReducer } from "./Login/loginReducer";
import { usersReducer } from "./User/reducer";
import { auditoriaReducer } from "./Auditoria/auditoriaReducer";
import { logOperacaoReducer } from "./LogOperacao/logOperacaoReducer";
import { perfilReducer } from "./Perfil/reducer";
import { confGeralReducer } from "./ConfiguracaoGeral/configGeralReducer";
import {organizacaoReducer} from "./Organizacao/reducer";
import {requestManagerReducer} from "./RequestManager/reducer";
import { recursoReducer } from "./Recurso/reducer"
import { conectorReducer } from "./Conector/reducer";
import {grupoRecursoReducer} from "./GrupoRecurso/reducer";
import { defeitoReducer } from "./Defeito/Reducer";
import { impressoraReducer } from "./Impressora/reducer";
import { produtoEtiquetaReducer } from "./produtoEtiqueta/reducer";
import { acessoReducer } from "./Acesso/reducer"
import { linhaDeProducaoReducer } from "./LinhaDeProducao/reducer";
import {grupoLinhaProducaoReducer} from './GrupoLinhaProducao/reducer'
import {classePorPlanejadorReducer} from './ClassePorPlanejador/reducer';
import {geracaoOrdemDeProducaoReducer} from "./GeracaoOrdemDeProducao/reducer";
import {prefixoProducaoFornecedorReducer} from './PrefixoProducaoFornecedor/reducer';
import { apontamentoReducer } from "./Apontamento/reducer";
import {sequenciamentoReducer} from "./Sequenciamento/reducer";
import { menuItemReducer } from "./MenuItem/reducer";
import { acompanhamentoOrdemDeProducaoReducer} from "./AcompanhamentoOrdemProducao/reducer";
import {apoioReducer} from "./Apoio/reducer";
import { metasReducer } from './Metas/reducer';
import { faturamentoReducer} from "./Faturamento/reducer";
import { serialReducer } from "./Serial/reducer";
import { almoxarifadoReducer } from "./Almoxarifado/reducer";
import {dashboardProgramacaoReducer} from "./DashboardProgramacao/reducer";
import { dashboardProducaoReducer } from "./DashboardProducao/reducer";
import {relatoriosReducer} from "./Relatorios/reducer";
import {producaoReducer} from "./Producao/reducer";
import {romaneioReducer} from "./Romaneio/reducer";
import {ordemFabricacaoReducer} from "./OrdemDeFabricacao/reducer";
import {motivoDeParadaReducer} from "./MotivosDeParada/reducer";
import {tempoApontamentoReducer} from "./TempoApontamento/reducer";
import {reimpressaoEtiquetasReducer} from "./ReimpressaoEtiquetas/reducer";
import {turnosReducer} from "./Turno/reducer";
import {recebimentoReducer} from "./Recebimento/reducer"
import {planejamentoDiarioReducer} from "./PlanejamentoDiario/reducer";
import {paradaReducer} from "./Parada/reducer";
import {asaichiReducer} from "./Asaichi/reducer";
import {apontamentosPendentesReducer} from "./ApontamentosPendentes/reducer";
import {transformacaoLoteReducer} from "./TransformacaoLote/reducer";
import {apontamentoDeMaterialReducer} from "./ApontamentoDeMaterial/reducer";

export default combineReducers({
  sessaoReducer,
  alertasReducer,
  users: usersReducer,
  auditoria: auditoriaReducer,
  logOperacao: logOperacaoReducer,
  perfil: perfilReducer,
  confGeral: confGeralReducer,
  organizacao: organizacaoReducer,
  requestManager: requestManagerReducer,
  conector: conectorReducer,
  recurso: recursoReducer,
  acesso: acessoReducer,
  grupoRecurso: grupoRecursoReducer,
  grupoLinhaProducao: grupoLinhaProducaoReducer,
  classePorPlanejador: classePorPlanejadorReducer,
  defeito: defeitoReducer,
  produtoEtiqueta: produtoEtiquetaReducer,
  impressora: impressoraReducer,
  geracaoOrdemDeProducao: geracaoOrdemDeProducaoReducer,
  linhaDeProducao: linhaDeProducaoReducer,
  prefixoProducaoFornecedor: prefixoProducaoFornecedorReducer,
  apontamento: apontamentoReducer,
  menuItem: menuItemReducer,
  sequenciamento: sequenciamentoReducer,
  acompanhamentoOrdemProducao: acompanhamentoOrdemDeProducaoReducer,
  apoio: apoioReducer,
  faturamento: faturamentoReducer,
  serial: serialReducer,
  almoxarifado: almoxarifadoReducer,
  dashboardProgramacao: dashboardProgramacaoReducer,
  dashboardProducao: dashboardProducaoReducer,
  relatorios: relatoriosReducer,
  producao: producaoReducer,
  romaneio: romaneioReducer,
  ordemFabricacao: ordemFabricacaoReducer,
  motivoParada: motivoDeParadaReducer,
  metas: metasReducer,
  tempoApontamento: tempoApontamentoReducer,
  reimpressaoEtiquetas: reimpressaoEtiquetasReducer,
  turnos: turnosReducer,
  planejamentoDiario: planejamentoDiarioReducer,
  parada: paradaReducer,
  recebimento: recebimentoReducer,
  apontamentosPendentes: apontamentosPendentesReducer,
  asaichi: asaichiReducer,
  transformacaoLote: transformacaoLoteReducer,
  apontamentoDeMaterial: apontamentoDeMaterialReducer
});
