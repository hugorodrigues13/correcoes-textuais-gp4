import React, { Component } from "react";

import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import Filter from "../../components/filter/Filter";
import {Button, PageHeader, Spin} from "antd";
import { bindActionCreators } from "redux";
import { metasListRequest, metaDeleteRequest } from "../../store/modules/Metas/action";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import moment from "moment";

class List extends Component {
  state = {
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "metas",
      campos: [
        {nome: "linhaDeProducao", tipo: "selectFilter", seletor: "linhasDeProducao", enabled: true, tratarStrings: true},
        {nome: "metaReprocessos", tipo: "number", enabled: true},
        {nome: "metaHK", tipo: "number", enabled: true},
        {nome: "inicioVigencia", colProps: {span: 8}, tipo: "rangeDate", enabled: true, dateFormat: "DD/MM/YYYY HH:mm", showTime: true},
        {nome: "fimVigencia",  colProps: {span: 8}, tipo: "rangeDate", enabled: true, dateFormat: "DD/MM/YYYY HH:mm", showTime: true},
      ]
    },
    filtros: {
      linhaDeProducao: "",
      metaReprocessos: "",
      metaHK: "",
      inicioIntervaloInicioVigencia : "",
      fimIntervaloInicioVigencia  : "",
      inicioIntervaloFimVigencia  : "",
      fimIntervaloFimVigencia  : "",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "inicioVigencia",
        order: "asc"
      },
    }
  }

  render() {
    const data = this.props.metas.data;
    const loading = this.props.loading;


    console.log("DATTAAA")
    console.log(data)

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="metas.listagem.label" />}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/prog/metas/form")}
            >
              <FormattedMessage id={"comum.novoRegistro.label"} />
            </Button>
          ]}
        />
        <Spin spinning={loading}>
        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={data}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("metas.title.label");
    this.getList();
  }

  configTable = () => {
    let { entities, total } = this.props.metas.data;

    entities = entities.map(entity =>
      ({
        ...entity,
        inicioVigencia: this.formataDataParaTabela(entity.inicioVigencia),
        fimVigencia: this.formataDataParaTabela(entity.fimVigencia),
        metaReprocessos: entity.metaReprocessos ? entity.metaReprocessos + "%" : '0%',
        metaHK: entity.metaHK ? entity.metaHK + "%" : '0%',
      })
    );

    return {
      i18n: "metas.tabela.",
      columns: [
        {
          key: "linhaDeProducao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "linhaDeProducao",
        },
        {
          key: "metaReprocessos",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "metaReprocessos",
        },
        {
          key: "metaHK",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "metaHK"
        },
        {
          key: "inicioVigencia",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "inicioVigencia"
        },
        {
          key: "fimVigencia",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "fimVigencia"
        },
      ],
      data: entities,
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      },
      acoes: {
        excluir: this.deletar,
        editar: this.criaUrlForm
      },
    };
  };

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getList();
  };

  deletar = (obj) => {
    this.props.metaDeleteRequest(obj.id, this.getFiltros());
  };

  criaUrlForm = obj => CLIENT_URL + "/prog/metas/form/" + obj.id;

  getList = () => {
    const filtros = this.getFiltros();
    this.props.metasListRequest(filtros);
  };

  getFiltros = () => {
    const {
      linhaDeProducao,
      metaReprocessos,
      metaHK,
      inicioIntervaloInicioVigencia,
      fimIntervaloInicioVigencia,
      inicioIntervaloFimVigencia,
      fimIntervaloFimVigencia
    } = this.state.filtros;

    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;

    return {
      linhaDeProducao,
      metaReprocessos,
      metaHK,
      inicioIntervaloInicioVigencia,
      fimIntervaloInicioVigencia,
      inicioIntervaloFimVigencia,
      fimIntervaloFimVigencia,
      offset,
      max,
      sort,
      order
    };
  };

  handlePesquisar = async values => {
    let state = {...this.state};
    state.filtros = {...this.state.filtros, ...values};

    if(state.filtros.inicioVigencia) {
      state.filtros.inicioIntervaloInicioVigencia = state.filtros.inicioVigencia[0].format('DD/MM/YYYY HH:mm:ss');
      state.filtros.fimIntervaloInicioVigencia = state.filtros.inicioVigencia[1].format('DD/MM/YYYY HH:mm:ss');
    }

    if(state.filtros.fimVigencia) {
      state.filtros.inicioIntervaloFimVigencia = state.filtros.fimVigencia[0].format('DD/MM/YYYY HH:mm:ss');
      state.filtros.fimIntervaloFimVigencia = state.filtros.fimVigencia[1].format('DD/MM/YYYY HH:mm:ss');
    }

    state.filtros.paginacao.offset = 0;
    await this.setState(state)
    this.getList();
  };

  mapPropsToFields = () => {
    const { filtros } = this.state;

    return {
      linhaDeProducao: filtros ? filtros.linhaDeProducao : "",
      metaReprocessos: filtros ? filtros.metaReprocessos : "",
      metaHK: filtros ? filtros.metaHK : "",
      inicioVigencia: filtros ? filtros.inicioVigencia : "",
      fimVigencia: filtros ? filtros.fimVigencia : ""
    };
  };

  getMessage = id => {
    return this.props.intl.formatMessage({id: id});
  };

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset;
  };

  formataDataParaTabela = data => moment(data).format('DD/MM/YYYY HH:mm');
}

const mapStateToProps = store => {
  console.log(store);

  return ({
    metas: store.metas,
    linhasDeProducao: store.linhasDeProducao,
    total: store.total,
    loading: store.requestManager.loading
  });
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    metasListRequest,
    metaDeleteRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
