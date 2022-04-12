import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {PageHeader, Popconfirm, Select} from "antd";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import ModalDividirParada from './ModalDividirParada'
import {
  listRequest, listSelectMotivoParadaRequest, updateMotivoRequest, dividirParadasRequest
} from "../../store/modules/Parada/action";
const {Option} = Select;
const camposDependentes24horas = ['dataInicioParada', 'dataFimParada']

class List extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    classesAuditadas: [],
    showPopConfirm: false,
    silenciaLoading: false,
    condition: true,
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "paradas",
      campos: [
        {nome: "recurso", tipo: "selectFilter", seletor: "listRecursos", colProps: {span: 5}},
        {nome: "dataInicioParada", tipo: "rangeDate", disabled: true, colProps: {span: 6}},
        {nome: "dataFimParada", tipo: "rangeDate", disabled: true, colProps: {span: 6}},
        {
          nome: "ultimas24horas", tipo: "switch", initialValue: true, onChange: () => {
            this.ultimas24horasChangeState()
          }, colProps: {span: 3}
        }
      ]
    },
    filtros: {
      recurso: "",
      dataParada: "",
      dataInicioParada: "",
      dataFimParada: "",
      ultimas24horas: true,
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "recurso",
        order: "asc"
      }
    },
    showModal: false,
    modalDividirParada: false,
    paradaSelecionadaParaDividir: null
  };

  render() {
    const {listRecursos, loading} = this.props.parada;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="paradas.listagem.label"/>}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={{listRecursos}}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
        <ModalDividirParada 
          save={this.dividirParadasRequest}
          motivos={this.props.parada.listMotivo} 
          parada={this.state.paradaSelecionadaParaDividir}
          visible={this.state.modalDividirParada} 
          setVisible={this.showModalDividirParada}  
        />
      </>
    );
  }

  ultimas24horasChangeState = () => {
    let state = this.state;

    camposDependentes24horas.forEach(dept => {
      const campo = state.filterComp.campos.find(c => c.nome === dept)
      campo.disabled = !campo.disabled
    })

    this.setState(state)
  }

  componentDidMount() {
    document.title = this.getMessage("paradas.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const {filtros} = this.state;

    return {
      recurso: filtros ? filtros.recurso : "",
      dataParada: filtros ? filtros.dataParada : "",
      dataInicioParada: filtros ? filtros.dataInicioParada : "",
      dataFimParada: filtros ? filtros.dataFimParada : ""
    };
  };

  handleChangeSelectMotivo = (motivo, id) => {
    this.props.updateMotivoRequest({motivo, id})
    const filtros = this.getFiltros();
    this.props.listRequest(filtros);
  }

  configTable = () => {
    const renderMotivo = (text, record) => {
      return (
        <Select
          style={{width: '100%'}}
          defaultValue={text}
          onChange={(val) => this.handleChangeSelectMotivo(val, record.id)}
        >
          {(this.props.parada.listMotivo || []).map(registro => (
            <Option
              key={registro.id}
              value={registro.id}
            >
              {registro.motivo}
            </Option>
          ))}
        </Select>
      )
    }
    const {entities, total} = this.props.parada || {};

    return {
      i18n: "paradas.tabela.",
      columns: [
        {
          key: "recurso",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "recurso"
        },
        {
          key: "motivo",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "motivo",
          render: renderMotivo,
        },
        {
          key: "dataInicioParada",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "dataInicioParada"
        },
        {
          key: "dataFimParada",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "dataFimParada"
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
        dividirParadas: this.dividirParada
      },
    };
  };

  getMessage = id => {
    return this.props.intl.formatMessage({id: id});
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listRequest(filtros);
    this.props.listSelectMotivoParadaRequest()
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = {...this.state.filtros, ...values};
    state.filtros.paginacao.offset = 0;
    await this.setState(state)
    this.getList();
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
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

  redefinePaginacaoPadrao = () => {
    let state = this.state;
    state.filtros.offset = 1;
    this.setState(state);
  };

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset;
  };

  getFiltros = () => {
    const {recurso, dataInicioParada, dataFimParada, ultimas24horas} = this.state.filtros;
    const {filtros} = this.state;
    let {offset, max} = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const {sort, order} = filtros.ordenacao;

    return {
      recurso,
      dataInicioParada,
      dataFimParada,
      ultimas24horas,
      offset,
      max,
      sort,
      order
    };
  };

  showModalDividirParada = (visible, obj) => {
      this.setState({
        modalDividirParada: visible,
        paradaSelecionadaParaDividir: obj ? obj : null
      })
  }

  dividirParada = (obj) => {
    this.showModalDividirParada(true, obj)
  }

  dividirParadasRequest = (data) => {
    this.props.dividirParadasRequest(data)
  }

}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  motivoParada: store.motivoParada,
  parada: store.parada,
  requestManager: store.requestManager,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    listRequest,
    listSelectMotivoParadaRequest,
    updateMotivoRequest,
    dividirParadasRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
