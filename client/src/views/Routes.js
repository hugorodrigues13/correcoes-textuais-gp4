import React from "react";
import { Switch, Route } from "react-router-dom";

import Dashboard from "./Dashboard/Dashboard";
import DashboardCadastro from "./DashboardCadastro/Dashboard";
import DashboardProducao from "./DashboardProducao/Dashboard";
import DashboardProgramacao from "./DashboardProgramacao/Dashboard";
import DashboardRelatorios from "./DashboardRelatorios/Dashboard";
import DashboardAuditoria from "./DashboardAuditoria/Dashboard";
import DashboardConfiguracoes from "./DashboardConfiguracoes/Dashboard";
import DashboardSeguranca from "./DashboardSeguranca/Dashboard";

import UserList from "./User/List";
import UserForm from "./User/ContainerForm";
import AuditList from "./Auditoria/List";
import AuditShow from "./Auditoria/Show";
import LogOperacao from "./LogOperacao/List";
import LogOperacaoShow from "./LogOperacao/Show";
import Error404 from "./errors/Error404";
import ErrorRender from "./errors/ErrorRender";
import Sobre from "./Sobre/Sobre";
import PerfilList from "./Perfil/List";
import PerfilForm from "./Perfil/ContainerForm";
import ConfGeralList from "./ConfGeral/List";
import ConectorList from "./Conector/List";
import ConectorForm from "./Conector/ContainerForm";
import GrupoRecursoList from "./GrupoRecurso/List";
import OrdemFabricaoList from "./OrdemDeFabricacao/List";
import GrupoRecursoForm from "./GrupoRecurso/ContainerForm";
import AcessoList from "./Acesso/List"
import GrupoLinhaProducaoList from "./GrupoLinhaProducao/List"
import GrupoLinhaProducaoForm from "./GrupoLinhaProducao/ContainerForm"
import AcessoForm from "./Acesso/ContainerForm"
import RecursoList from "./Recurso/List"
import RecursoForm from "./Recurso/ContainerForm";
import DefeitoList from "./Defeito/List"
import DefeitoForm from "./Defeito/ContainerForm"
import linhaDeProducaoList from "./LinhaDeProducao/List";
import linhaDeProducaoForm from "./LinhaDeProducao/ContainerForm";
import ImpressoraList from "./Impressora/List"
import ImpressoraForm from "./Impressora/ContainerForm"
import ProdutoEtiquetaList from "./produtoEtiqueta/List"
import ProdutoEtiquetaForm from "./produtoEtiqueta/ContainerForm"
import Sequenciamento from "./Sequenciamento/Container";
import AcompanhamentoOrdemProducaoList from "./AcompanhamentoOrdemProducao/List"
import AcompanhamentoFormContainer from "./AcompanhamentoOrdemProducao/FormContainer"
import MetasList from './Metas/List';
import MetasForm from './Metas/FormContainer';
import AlmoxarifadoList from "./Almoxarifado/Almoxarifado"
import GeracaoOrdemDeProducaoForm from "./GeracaoOrdemDeProducao/Form";
import PrefixoProducaoFornecedorList from "./Fornecedor/List"
import FornecedorForm from "./Fornecedor/ContainerForm";
import ApontamentoForm from "./Apontamento/Form"
import Apoio from "./Apoio/Container";
import ClassePorPlanejadorList from "./ClassePorPlanejador/List";
import ClassePorPlanejadorForm from "./ClassePorPlanejador/ContainerForm";
import FaturamentoList from "./Faturamento/List";
import SerialList from "./Serial/List";
import RomaneioList from "./Romaneio/List";
import ParadasList from "./Parada/List";

import PrivateRoute from "../components/PrivateRoute";
import { CLIENT_URL } from "../config";

import * as MENU from "./mapToRoutes";
import {
    DASHBOARD_AUDITORIA,
    DASHBOARD_CADASTROS, DASHBOARD_CONFIGURACOES,
    DASHBOARD_PRODUCAO,
    DASHBOARD_PROGRAMACAO,
    DASHBOARD_RELATORIOS, DASHBOARD_SEGURANCA
} from "./mapToRoutes";
import RelatorioSerial from "./Relatorios/RelatorioSerial";
import RelatorioProducao from "./Relatorios/RelatorioProducao";
import RomaneioFormContainer from "./Romaneio/FormContainer";
import MotivosDeParada from "./MotivosDeParada/List";
import MotivosDeParadaFormContainer from "./MotivosDeParada/FormContainer";
import TempoApontamentoList from "./TempoApontamento/List";
import ReimpressaoEtiquetas from "./ReimpressaoEtiquetas/ReimpressaoEtiqueta";
import TurnosList from "./Turno/List";
import TurnosFormContainer from "./Turno/FormContainer";
import PlanejamentoDiarioList from "./PlanejamentoDiario/List";
import PlanejamentoDiarioFormContainer from "./PlanejamentoDiario/FormContainer";
import RecebimentoList from "./Recebimento/List";
import ApontamentosPendentesList from "./ApontamentosPendentes/List";
import TransformacaoLoteForm from "./TransformacaoLote/Form";
import AsaichiList from "./Asaichi/List";
import ApontamentoDeMaterial from "./ApontamentoDeMaterial/Container";
import ApontamentoDeMaterialList from "./ApontamentoDeMaterial/List";


export default function Routes() {
  return (
    <Switch>
      {/* USER */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/seg/user"}
        entity={MENU.USER}
        component={UserList}
      />
      <PrivateRoute
        path={CLIENT_URL + "/seg/user/form/:id"}
        entity={MENU.USER}
        component={UserForm}
      />
      <PrivateRoute
        path={CLIENT_URL + "/seg/user/form"}
        entity={MENU.USER}
        component={UserForm}
      />
      <Route path={CLIENT_URL + "/seg/user/perfil"} component={UserForm} />

      {/* Auditoria */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/audit/auditoria"}
        component={AuditList}
        entity={MENU.AUDIT}
      />
      <PrivateRoute
        exact
        path={CLIENT_URL + "/audit/auditoria/:id/show"}
        component={AuditShow}
        entity={MENU.AUDIT}
      />

      {/* Log Operacao */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/audit/logOperacao"}
        component={LogOperacao}
        entity={MENU.LOG}
      />
      <PrivateRoute
        exact
        path={CLIENT_URL + "/audit/logOperacao/:id/show"}
        component={LogOperacaoShow}
        entity={MENU.LOG}
      />

      {/* Perfil */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/seg/perfil"}
        component={PerfilList}
        entity={MENU.PERFIL}
      />
      <PrivateRoute
        exact
        path={CLIENT_URL + "/seg/perfil/form"}
        component={PerfilForm}
        entity={MENU.PERFIL}
      />
      <PrivateRoute
        exact
        path={CLIENT_URL + "/seg/perfil/form/:id"}
        component={PerfilForm}
        entity={MENU.PERFIL}
      />

      {/* Planejamento Diário */}

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/planejamentoDiario"}
        component={PlanejamentoDiarioList}
        entity={MENU.PLANEJAMENTO_DIARIO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/planejamentoDiario/form"}
        component={PlanejamentoDiarioFormContainer}
        entity={MENU.PLANEJAMENTO_DIARIO}
      />

      <PrivateRoute
        path={CLIENT_URL + "/prog/planejamentoDiario/form/:id"}
        component={PlanejamentoDiarioFormContainer}
        entity={MENU.PLANEJAMENTO_DIARIO}
      />

      {/* Turnos */}

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/turno"}
        component={TurnosList}
        entity={MENU.TURNOS}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/turno/form"}
        component={TurnosFormContainer}
        entity={MENU.TURNOS}
      />

      <PrivateRoute
        path={CLIENT_URL + "/cad/turno/form/:id"}
        component={TurnosFormContainer}
        entity={MENU.TURNOS}
      />

      {/*Motivos de Parada*/}

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/motivoDeParada"}
        component={MotivosDeParada}
        entity={MENU.MOTIVO_DE_PARADA}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/motivoDeParada/form"}
        component={MotivosDeParadaFormContainer}
        entity={MENU.MOTIVO_DE_PARADA}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/motivoDeParada/form/:id"}
        component={MotivosDeParadaFormContainer}
        entity={MENU.MOTIVO_DE_PARADA}
      />

      {/*Grupo Recurso*/}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/grupoRecurso"}
        component={GrupoRecursoList}
        entity={MENU.GRUPO_RECURSO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/grupoRecurso/form"}
        component={GrupoRecursoForm}
        entity={MENU.GRUPO_RECURSO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/grupoRecurso/form/:id"}
        component={GrupoRecursoForm}
        entity={MENU.GRUPO_RECURSO}
      />

      {/* Cong Geral */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/confGeral"}
        component={ConfGeralList}
        entity={MENU.CONFIG}
      />

      {/* Conectores */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/conector"}
        component={ConectorList}
        entity={MENU.CONECTOR}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/conector/form"}
        component={ConectorForm}
        entity={MENU.CONECTOR}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/conector/form/:id"}
        component={ConectorForm}
        entity={MENU.CONECTOR}
      />

      {/* Recurso */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/recurso"}
        component={RecursoList}
        entity={MENU.RECURSO}
      />
      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/recurso/form"}
        component={RecursoForm}
        entity={MENU.RECURSO}
      />
      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/recurso/form/:id"}
        component={RecursoForm}
        entity={MENU.RECURSO}
      />

      {/* Acesso */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/seg/acesso"}
        component={AcessoList}
        entity={MENU.ACESSO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/grupoLinhaProducao"}
        component={GrupoLinhaProducaoList}
        entity={MENU.GRUPO_LINHA_PRODUCAO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/grupoLinhaProducao/form"}
        component={GrupoLinhaProducaoForm}
        entity={MENU.GRUPO_LINHA_PRODUCAO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/grupoLinhaProducao/form/:id"}
        component={GrupoLinhaProducaoForm}
        entity={MENU.GRUPO_LINHA_PRODUCAO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/seg/acesso/form"}
        component={AcessoForm}
        entity={MENU.ACESSO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/seg/acesso/form/:id"}
        component={AcessoForm}
        entity={MENU.ACESSO}
      />

      {/* Defeito */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/defeito"}
        component={DefeitoList}
        entity={MENU.DEFEITO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/defeito/form"}
        component={DefeitoForm}
        entity={MENU.DEFEITO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/defeito/form/:id"}
        component={DefeitoForm}
        entity={MENU.DEFEITO}
      />

      {/*Relatórios*/}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/rel/seriais"}
        component={RelatorioSerial}
        entity={MENU.RELATORIO_SERIAIS}
      />
      
      <PrivateRoute
        exact
        path={CLIENT_URL + "/rel/producao"}
        component={RelatorioProducao}
        entity={MENU.RELATORIO_PRODUCAO}
      />

      {/* Transformação de Lote*/}

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/transformacaoLote"}
        component={TransformacaoLoteForm}
        entity={MENU.TRANSFORMACAO_LOTE}
      />

      {/*Ordem de Fabricação*/}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/ordemFabricacao"}
        component={OrdemFabricaoList}
        entity={MENU.ORDEM_FABRICACAO}
      />

      {/*Sequenciamento de Fabricação*/}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/sequenciamento"}
        component={Sequenciamento}
        entity={MENU.SEQUENCIAMENTO}
      />

      {/* Acompanhamento de Ordem de Produção */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/acompanhamentoOrdemProducao"}
        component={AcompanhamentoOrdemProducaoList}
        entity={MENU.ACOMPANHAMENTO}
      />

      {/* Metas */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/metas"}
        component={MetasList}
        entity={MENU.METAS}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/metas/form"}
        component={MetasForm}
        entity={MENU.METAS}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/metas/form/:id"}
        component={MetasForm}
        entity={MENU.METAS}
      />

      <PrivateRoute
        path={CLIENT_URL + "/prog/acompanhamentoOrdemProducao/form/:id"}
        component={AcompanhamentoFormContainer}
        entity={MENU.ACOMPANHAMENTO}
      />

      {/* Almoxarifado */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/almoxarifado"}
        component={AlmoxarifadoList}
        entity={MENU.ALMOXARIFADO}
      />

      {/* Impressora */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/impressora"}
        component={ImpressoraList}
        entity={MENU.IMPRESSORA}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/impressora/form"}
        component={ImpressoraForm}
        entity={MENU.IMPRESSORA}
      />
      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/impressora/form/:id"}
        component={ImpressoraForm}
        entity={MENU.IMPRESSORA}
      />

      {/* Produto Etiqueta */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/produtoEtiqueta"}
        component={ProdutoEtiquetaList}
        entity={MENU.PRODUTO_ETIQUETA}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/produtoEtiqueta/form"}
        component={ProdutoEtiquetaForm}
        entity={MENU.PRODUTO_ETIQUETA}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/produtoEtiqueta/form/:id"}
        component={ProdutoEtiquetaForm}
        entity={MENU.PRODUTO_ETIQUETA}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/geracaoOrdemDeProducao"}
        component={GeracaoOrdemDeProducaoForm}
        entity={MENU.GERACAO_ORDEM_DE_PRODUCAO}
      />

      {/* Defeito */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/defeito"}
        component={DefeitoList}
        entity={MENU.DEFEITO}
      />
      {/* Linha de Produção */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/linhaDeProducao"}
        component={linhaDeProducaoList}
        entity={MENU.LINHA_DE_PRODUCAO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/linhaDeProducao/form"}
        component={linhaDeProducaoForm}
        entity={MENU.LINHA_DE_PRODUCAO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/cad/linhaDeProducao/form/:id"}
        component={linhaDeProducaoForm}
        entity={MENU.LINHA_DE_PRODUCAO}
      />

      {/* Tempo de Apontamneto */}

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/tempoApontamentoProduto"}
        component={TempoApontamentoList}
        entity={MENU.TEMPO_APONTAMENTO}
      />

      {/* Tempo de Apontamneto */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prog/recebimento"}
        component={RecebimentoList}
        entity={MENU.RECEBIMENTO}
        />

      {/* Apontamentos */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/apontamento"}
        component={ApontamentoForm}
        entity={MENU.APONTAMENTO}
      />

      {/* Apontamentos Pendentes */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/apontamentosPendentes"}
        component={ApontamentosPendentesList}
        entity={MENU.APONTAMENTOS_PENDENTES}
      />

      {/* Seriais */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/serial"}
        component={SerialList}
        entity={MENU.SERIAL}
      />

      {/* Apoio */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/apoio"}
        component={Apoio}
        entity={MENU.APOIO}
      />

      {/* Configuracao de Prefixo de Producao por Fornecedor */}

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/fornecedor"}
        component={PrefixoProducaoFornecedorList}
        entity={MENU.FORNECEDOR}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/fornecedor/form/:id"}
        component={FornecedorForm}
        entity={MENU.FORNECEDOR}
      />

      {/*Classe por Planejador*/}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/classePorPlanejador"}
        component={ClassePorPlanejadorList}
        entity={MENU.CLASSE_POR_PLANEJADOR}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/classePorPlanejador/form"}
        component={ClassePorPlanejadorForm}
        entity={MENU.CLASSE_POR_PLANEJADOR}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/config/classePorPlanejador/form/:id"}
        component={ClassePorPlanejadorForm}
        entity={MENU.CLASSE_POR_PLANEJADOR}
      />

      {/* Faturamento */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/faturamento"}
        component={FaturamentoList}
        entity={MENU.FATURAMENTO}
      />

      {/* Reimpressão de Etiquetas */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/reimpressaoEtiquetas"}
        component={ReimpressaoEtiquetas}
        entity={MENU.REIMPRESSAO_ETIQUETAS}
      />

      {/* Romaneio */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/romaneio"}
        component={RomaneioList}
        entity={MENU.ROMANEIO}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/romaneio/form/:id"}
        component={RomaneioFormContainer}
        entity={MENU.ROMANEIO}
      />

      {/* Romaneio */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/paradas"}
        component={ParadasList}
        entity={MENU.PARADAS}
      />

      {/* Apontamento de Material */}
      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/apontamentoDeMaterial"}
        component={ApontamentoDeMaterial}
        entity={MENU.APONTAMENTO_DE_MATERIAL}
      />

      <PrivateRoute
        exact
        path={CLIENT_URL + "/prod/apontamentoDeMaterial/list"}
        component={ApontamentoDeMaterialList}
        entity={MENU.APONTAMENTO_DE_MATERIAL}
      />

        {/* Dashboard */}
        <Route exact path={CLIENT_URL + "/"} component={AsaichiList} />

        {/* DashboardCadastro */}
        <PrivateRoute exact path={CLIENT_URL + "/cad"} component={DashboardCadastro} entity={DASHBOARD_CADASTROS}/>

        {/* DashboardProducao */}
        <PrivateRoute exact path={CLIENT_URL + "/prod"} component={DashboardProducao} entity={DASHBOARD_PRODUCAO}/>

        {/* DashboardProgramacao */}
        <PrivateRoute exact path={CLIENT_URL + "/prog"} component={DashboardProgramacao} entity={DASHBOARD_PROGRAMACAO}/>

        {/* DashboardRelatorios */}
        <PrivateRoute exact path={CLIENT_URL + "/rel"} component={DashboardRelatorios} entity={DASHBOARD_RELATORIOS}/>

        {/* DashboardAuditoria */}
        <PrivateRoute exact path={CLIENT_URL + "/audit"} component={DashboardAuditoria} entity={DASHBOARD_AUDITORIA}/>

        {/* DashboardConfiguracoes */}
        <PrivateRoute exact path={CLIENT_URL + "/config"} component={DashboardConfiguracoes} entity={DASHBOARD_CONFIGURACOES}/>

        {/* DashboardSeguranca */}
        <PrivateRoute exact path={CLIENT_URL + "/seg"} component={DashboardSeguranca} entity={DASHBOARD_SEGURANCA}/>

      {/* Sobre */}
      <Route path={CLIENT_URL + "/sobre"} component={Sobre} />

      {/* ERROR */}
      <Route path={CLIENT_URL + "/errorRender"} component={ErrorRender} />
      <Route component={Error404} />
    </Switch>
  );
}
