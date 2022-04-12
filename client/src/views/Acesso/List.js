import React from "react"
import {Button, PageHeader, Popover, Divider, List as ListAnt} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { listAcessoRequest, deleteRequest, filtrarFornecedor } from "../../store/modules/Acesso/action";

class List extends React.Component {
  onChange = e => {
    this.props.filtrarFornecedor(e);
    let state = this.state;
    state.filtros.organizacao = e;
    this.setState(state)
  };

  state = {
    entidades: [],
    totalCount: 0,
    silenciaLoading: false,
    filterComp: {
      labelCol:{style: {lineHeight:1}},
      margin:{marginTop: '10px'},
      layout: "vertical",
      prefix: "acesso",
      campos: [
        {nome: "nome", tipo: "text"},
        {nome: "organizacao", tipo: "selectFilter", tratamento: true, onChange: this.onChange, seletor: "listOrganizacao", tratarFilter: true},
        {nome: "fornecedor", tipo: "selectFilter", seletor: "listFornecedorFiltrada", tratamento: true, tratarFilter: true}
        ]
    },
    filtros: {
      nome: "",
      organizacao: "",
      fornecedor: "",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "nome",
        order: "asc"
      }
    }
  };

  render() {
    const { loading } = this.props.acesso;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"acesso.listagem.label"}/>}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/seg/acesso/form")}
            >
              <FormattedMessage id="comum.novoRegistro.label" />
            </Button>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={this.props.acesso.data}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("acesso.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      nome: filtros ? filtros.nome : "",
      organizacao: filtros ? filtros.organizacao : "",
      fornecedor: filtros ? filtros.fornecedor : ""
    };
  };

  configTable = () => {
    const { entities, total } = this.props.acesso.data || {};
    return {
      i18n: "acesso.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome",
          width: "20%",
        },{
          key: "fornecedores",
          isSorteable: false,
          render: (value, record) => {
            if(entities !== undefined) {
              let fornecedoresByAcesso = ""
              fornecedoresByAcesso += value.map(item => item.nome)
              if(fornecedoresByAcesso.length < 130) {
                return (<div>{fornecedoresByAcesso}</div>)
              } else {
                return <Popover content={this.contentPopover(record, "fornecedores")} trigger="hover">
                    {fornecedoresByAcesso.slice(0, 130) + ("...")}
                  </Popover>
              }
            }
          }
        },{
          key: "organizacoes",
          isSorteable: false,
          render: (value, record) => {
            if(entities !== undefined) {
              let organizacoesByAcesso = ""
              organizacoesByAcesso += value.map(item => item.nome)
              if(organizacoesByAcesso.length < 45) {
                return (<div>{organizacoesByAcesso}</div>)
              } else {
                return (<Popover content={this.contentPopover(record, "organizacoes")} trigger="hover">
                    {organizacoesByAcesso.slice(0, 45) + ("...")}
                  </Popover>)
              }
            }
          },
          width: "20%",
        },
      ],
      data: entities,
      acoes: {
        editar: this.criaUrlForm,
        excluir: this.deletar
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

  contentPopover = (value, type) => {
    return (<div style={{maxHeight: '50vh', overflow: 'scroll'}}>
      <ListAnt header={<h4 style={{fontWeight: "bold"}}>
        {type === "organizacoes" ? "ORGANIZAÇÕES" : "FORNECEDORES"}
      </h4>}
               dataSource={type === "organizacoes" ?
                   value.organizacoes :
                   value.fornecedores}
               renderItem={item =>
                   <ListAnt.Item>
                     {item.nome}
                   </ListAnt.Item>
               }/></div>)
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id })
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listAcessoRequest(filtros)
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState( state );
    this.getList()
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  deletar = objeto => {
    this.props.deleteRequest(objeto.id, this.getFiltros());
  };

  criaUrlForm = objeto => {
    let url = CLIENT_URL + "/seg/acesso/form/" + objeto.id;
    return url;
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

  getoffset = (offset, max) => {
    offset = ( offset ? offset - 1 : offset ) * max;
    return offset;
  };

  getFiltros = () => {
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
     ...filtros,
      offset,
      max,
      sort,
      order
    };
  };
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  acesso: store.acesso,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    listAcessoRequest,
    deleteRequest,
    filtrarFornecedor
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
