import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {Button, PageHeader, Tooltip} from "antd";
import {CLIENT_URL} from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {exportarRomaneioListagemRequest, listRomaneioRequest} from "../../store/modules/Romaneio/action";
import moment from "moment";
import {RiFileTextLine} from "react-icons/all";

class List extends React.Component {
  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "romaneio",
      campos: [
        {nome: "romaneio", tipo: "text", maxLength: "100"},
        {nome: "codigoProduto", tipo: "text", maxLength: "100"},
        {nome: "lote", tipo: "text", maxLength: "100"},
        {nome: "nota", tipo: "text", maxLength: "100"},
        {nome: "numero", tipo: "text", maxLength: "100"},
        {nome: "ordemProducao", tipo: "text", maxLength: "100"},
        {nome: "ordemFabricacao", tipo: "text", maxLength: "100"},
        {nome: "status", tipo: "select", ordenar: true, tratamento: true},
        {nome: "emissao", tipo: "rangeDate", disabled: true},
        {
          nome: "ultimas24horas", tipo: "switch", initialValue: true, onChange: () => {
            this.ultimas24horasChangeState()
          }
        }
      ]
    },
    filtros: {
      codigoProduto: "",
      romaneio: "",
      lote: "",
      nota: "",
      emissao: "",
      numero: "",
      ordemProducao: "",
      ordemFabricacao: "",
      status: "",
      ultimas24horas: true,
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "emissao",
        order: "desc"
      }
    }
  };

  render() {
    const {data, loading} = this.props.romaneio;

    const lista = {
      ...data,
      status: (data?.statusRomaneio || []).map((item) => ({key: item, nome: this.getMessage(`romaneio.status.${item}.label`)}))
    };


    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"romaneio.title.label"}/>}
          extra={
            <Tooltip title={this.getMessage("romaneio.exportar.tooltip.label")}>
              <Button
                onClick={this.exportarRomaneio}
                type="default"
                className="page-header-ignored-button">
                <RiFileTextLine fontSize="1.5em" />
              </Button>
            </Tooltip>
          }
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          data={lista}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("romaneio.title.label");
    this.getList();
  }

  exportarRomaneio = () => {
    // TODO: na atividade que adicionar o FiltroAtivavel, pegar as colunas do filtro
    this.props.exportarRomaneioListagemRequest( {...this.getFiltros(), filtros: this.state.filterComp.campos.map(c => c.nome), colunas: ['romaneio', 'notaFiscalEncomenda', 'notaFiscalRetorno', 'emissao', 'quantidadeTotal', 'valorTotal', 'status']})
  };

  ultimas24horasChangeState = () => {
    let state = this.state;
    const index = state.filterComp.campos.findIndex((item) => item.nome === "emissao");
    if (index !== -1) {
      state.filterComp.campos[index].disabled = !state.filterComp.campos[index].disabled;
      this.setState(state);
    }
  }

  configTable = () => {
    const {entities, total} = this.props.romaneio.data || {};
    let dados = entities?.map((item) => {
      return {
        id: item.id,
        romaneio: item.romaneio,
        notaFiscalEncomenda: item.notaFiscalEncomenda,
        notaFiscalRetorno: item.notaFiscalRetorno,
        emissao: moment(item.emissao, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY | HH:mm"),
        quantidadeTotal: item.quantidadeTotal,
        valorTotal: item.valorTotal,
        status: item.status,
        editable: item.editable
      }
    });
    return {
      i18n: "romaneio.tabela.",
      columns: [
        {
          key: "romaneio",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "romaneio"
        },
        {
          key: "notaFiscalEncomenda",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "lote"
        },
        {
          key: "notaFiscalRetorno",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nota"
        },
        {
          key: "emissao",
          isSorteable: true,
          defaultSortOrder: "descend",
          defaultSort: this.state.filtros.ordenacao.sort === "emissao"
        },
        {
          key: "quantidadeTotal",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "quantidadeTotal"
        },
        {
          key: "valorTotal",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "valorTotal"
        },
        {
          key: "status",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "status",
          render: (value) => {
            return this.getStatus(value)
          }
        },
      ],
      data: dados,
      acoes: {
        editar: this.criarUrlForm,
        visualizar: this.visualiar,
        romaneio: true
      },
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      }
    }
  };

  getStatus = value => {
    return this.getMessage(`romaneio.status.${value}.label`)
  }

  getMessage = id => {
    return this.props.intl.formatMessage({id: id})
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listRomaneioRequest(filtros);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = {...this.state.filtros, ...values};
    state.filtros.paginacao.offset = 0;
    state.filtros.emissao?.forEach((item, index) => {
      if (!index) {
        state.filtros.dataInicial = moment(item).startOf("day").valueOf();
      } else {
        state.filtros.dataFinal = moment(item).endOf("day").valueOf();
      }
    });
    delete state.filtros.emissao
    await this.setState(state);
    this.getList();
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  visualiar = id => {
    return CLIENT_URL + "/prod/romaneio/form/" + id;
  }

  deletar = objeto => {
    this.props.deleteRequest(objeto.id, this.getFiltros());
  };

  criarUrlForm = objeto => {
    return CLIENT_URL + "/prod/romaneio/form/" + objeto.id;
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
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  romaneio: store.romaneio
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({listRomaneioRequest, exportarRomaneioListagemRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
