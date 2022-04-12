import * as React from 'react';
import {List as ListAnt, PageHeader, Popover, Tag} from "antd";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {getMessage} from "../../components/messages";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {recebimentoConcluirManualmenteRequest, recebimentoListRequest} from "../../store/modules/Recebimento/action";
import * as queryString from "query-string";

class RecebimentoList extends React.Component {

  state = {
    entity: [],
    totalCount: 0,
    popoverAberto: false,
    popoverTempo: 1,
    selectedRows: [],
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "recebimento",
      campos: [
        {nome: "interfaceTransactionId", tipo: "text", isSorteable: false},
        {nome: "ordemDeProducao", tipo: "text", isSorteable: false},
        {nome: "notaFiscal", tipo: "text", isSorteable: false},
        {
          nome: "status",
          tipo: "select",
          seletor: 'status',
          isSorteable: false,
          useMessage: false,
          renderLabel: this.renderStatus
        },
        {
          nome: "erro",
          tipo: "select",
          seletor: 'erro',
          isSorteable: false,
          useMessage: false,
          renderLabel: this.renderErro
        },
      ],
      erro: ['TODOS', "COM_ERRO"],
      status: ["TODOS", "CRIADA", "MOVIMENTADA", "CONCLUIDA"]
    },
    filtros: {
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "dataUltimaAtualizacao",
        order: "desc"
      }
    }
  };

  async componentDidMount() {
    document.title = getMessage("recebimento.title.label");
    await this.checarParametros(['erro'])
    this.getList()
  }

  render() {
    const {loading} = this.props.recebimento

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"recebimento.title.label"}/>}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          data={this.state.filterComp}
          mapPropsToFields={this.mapPropsToFields()}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  contentPopover = (value) => {
    return (
      <div style={{maxHeight: "50vh", overflow: "scroll"}}>
        <ListAnt
          header={
            <h4 style={{fontWeight: "bold"}}>
              {getMessage("recebimento.lotes.label")}
            </h4>
          }
          dataSource={value.lotes}
          renderItem={
            item =>
              <ListAnt.Item>
                {item.codigoLote} - {item.quantidade}
              </ListAnt.Item>
          }
        />
      </div>
    )
  };

  configTable = () => {
    const {entities, total} = this.props.recebimento.data
    return {
      i18n: "recebimento.",
      columns: [
        {key: "interfaceTransactionId", nome: "interfaceTransactionId", tipo: "text", isSorteable: false},
        {key: "ordemDeProducao", nome: "ordemDeProducao", tipo: "text", isSorteable: false},
        {key: "notaFiscal", nome: "notaFiscal", tipo: "text", isSorteable: false},
        {key: "quantidade", nome: "quantidade", tipo: "text", isSorteable: false},
        {key: "status", nome: "status", tipo: "text", isSorteable: false, render: (value, record) => {
          return getMessage(`recebimento.status.${value}.label`)
          }},
        {
          key: "erroExportacao", width: 20, nome: "erroExportacao", tipo: "text", isSorteable: false, render: (value, record) => {
            if(record.status !== "CONCLUIDA" && !record.isConcluirManualmente){
              return (<div>{value}</div>)
            }
          }
        },
        {key: "dataCriacao", nome: "dataCriacao", tipo: "text", isSorteable: false},
        {key: "dataUltimaAtualizacao", nome: "dataUltimaAtualizacao", tipo: "text", isSorteable: false},
        {key: "versao", nome: "versao", tipo: "text", isSorteable: false},
        {
          key: "lotes", nome: "lotes", tipo: "text", isSorteable: false, render: (value, record) => {
            if(entities && value) {
              let lotes = "";
              lotes += value.map(item =>
                item.codigoLote
              );
              lotes = lotes.replaceAll(",", ", ");
              if(lotes.length < 8) {
                return (<div>{lotes}</div>);
              } else {
                return <Popover content={this.contentPopover(record)} trigger={"hover"}>
                  <Tag>{lotes.slice(0, 8)}</Tag>
                </Popover>
              }
            }
          }
        },
      ],
      data: entities,
      acoes: {
        concluirManualmente: this.concluirManualmente
      },
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizarRegistrosPorPagina: this.atualizarRegistrosPorPagina
      },
    }
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.recebimentoListRequest(filtros)
  };

  renderStatus(status) {
    return getMessage(`recebimento.status.${status}.label`)
  };

  renderErro(erro) {
    return getMessage(`recebimento.erro.${erro}.label`)
  };

  checarParametros = async (props) => {
    const params = queryString.parse(this.props.location.search);
    if (props.some(prop => params[prop])) {
      let state = this.state
      for (const prop of props) {
        const coluna = this.state.filterComp.campos.find(c => c.key === prop);
        state = {...state, filtros: {...state.filtros, [prop]: params[prop]}}
      }

      await this.setState(state)
    }
  }

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = {...this.state.filtros, ...values};
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList()
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
    this.getList()
  }

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset
  }

  getFiltros = () => {
    const {filtros} = this.state;
    let {offset, max} = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const {sort, order} = filtros.ordenacao;
    return {
      ...filtros,
      offset,
      max,
      sort,
      order
    }
  }

  concluirManualmente = (entity) => {
    const { filtros } = this.state;
    const { id } = entity
    this.props.recebimentoConcluirManualmenteRequest({ id, filtros});
  }

  mapPropsToFields = () => {
    const {filtros} = this.state;
    const params = queryString.parse(this.props.location.search);
    return {
      status: filtros.status || params.status || 'TODOS',
      erro: filtros.erro || params.erro || 'TODOS'
    };
  };

}

RecebimentoList.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  recebimento: store.recebimento
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({recebimentoListRequest, recebimentoConcluirManualmenteRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecebimentoList))
