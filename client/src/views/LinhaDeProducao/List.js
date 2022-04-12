import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {Button, List as ListAnt, Modal, PageHeader, Popover} from "antd";
import {CLIENT_URL} from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import history from "../../services/history";
import {
  buscarLinhaProducaoPorNomeRequest,
  linhaProducaoDeletarRequest,
  linhaProducaoListarRequest,
  ativarOuDesativarRequest
} from "../../store/modules/LinhaDeProducao/action";
import ModalBody from "./ModalBody";
import {getMessage} from "../../components/messages";

export class List extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    silenciaLoading: false,
    visible: false,
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "linhaDeProducao",
      campos: [
        {nome: "nome", tipo: "text"},
        {nome: "grupoRecurso", tipo: "text"},
        {nome: "status", tipo: "select", renderLabel: this.renderStatus},
      ],
      status: ["TODOS", "ATIVO", "INATIVO"]
    },
    filtros: {
      nome: "",
      grupoRecurso: "",
      status: "",
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
    const {loading} = this.props.requestManager;
    const {versoes} = this.props.linhaDeProducao;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="linhaDeProducao.listagem.label"/>}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/cad/linhaDeProducao/form")}
            >
              <FormattedMessage id="comum.novoRegistro.label"/>
            </Button>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={this.state.filterComp}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>

        <Modal
          visible={this.state.visible}
          title={this.getMessage("linhaDeProducao.title.modal.label")}
          onOk={this.handleClose}
          onCancel={this.handleClose}
          destroyOnClose={true}
          width={600}
          footer={[
            <Button
              type={"primary"}
              loading={loading}
              onClick={this.handleClose}
            >
              {this.getMessage("comum.ok.label")}
            </Button>
          ]}
        >
          <ModalBody entities={versoes}/>
        </Modal>
      </>);
  }

  renderStatus(status){
    return getMessage(`"linhaDeProducao.status.${status}.label"`)
  }

  componentDidMount() {
    document.title = this.getMessage("linhaDeProducao.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const {filtros} = this.state;
    return {
      nome: filtros ? filtros.nome : "",
      grupoRecurso: filtros ? filtros.grupoRecurso : "",
      status: filtros?.status || "ATIVO"
    };
  };

  handleClose = () => {
    this.setState({visible: false});
    this.getList();
  }

  configTable = () => {
    const {entities, total} = this.props.linhaDeProducao || {};

    return {
      i18n: "linhaDeProducao.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome"
        },
        {
          key: "versao",
        },
        {
          key: "gruposRecursos",
          render: (value) => {
            if(entities) {
              let grupoRecursos = "";
              grupoRecursos += value.map((item) => item.value);
              grupoRecursos = grupoRecursos.replaceAll(",", ", ");
              if(grupoRecursos.length < 130) {
                return (<div>{grupoRecursos}</div>);
              } else {
                return <Popover content={this.contentPopover(value)} trigger={"hover"}>
                  {grupoRecursos.slice(0, 130) + ("...")}
                </Popover>
              }
            }
          }
        },{
          key: "status",
          ativarOuDesativar: this.ativarOuDesativar,
          statusLoading: this.props.linhaDeProducao.statusLoading
        },
      ],
      data: (entities || []).map(o => ({...o, possuiHistorico: o.versao > 1})),
      acoes: {
        editar: this.criaUrlForm,
        excluir: this.deletar,
        historico: this.historico,
        width: "20%"
      },
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      }
    };
  };

  ativarOuDesativar = (object) => {
    this.props.ativarOuDesativarRequest(object,  this.getFiltros())
  }

  getMessage = id => {
    return this.props.intl.formatMessage({id: id});
  };

  contentPopover = (value) => {
    return (
      <div style={{maxHeight: "50vh", overflow: "scroll"}}>
        <ListAnt
          header={
            <h4 style={{fontWeight: "bold"}}>
              {this.getMessage("linhaDeProducao.tabela.gruposRecursos.label")}
            </h4>
          }
          dataSource={value}
          renderItem={
            item =>
              <ListAnt.Item>
                {item.value}
              </ListAnt.Item>
          }
        />
      </div>
    )
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.linhaProducaoListarRequest(filtros);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = {...this.state.filtros, ...values};
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList();
  };

  getFiltros = () => {
    const {nome, grupoRecurso, status} = this.state.filtros;
    const {filtros} = this.state;
    let {offset, max} = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const {sort, order} = filtros.ordenacao;
    return {
      nome,
      grupoRecurso,
      offset,
      max,
      sort,
      order,
      status
    };
  };

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset;
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

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  deletar = objeto => {
    this.props.linhaProducaoDeletarRequest(objeto.id, this.getFiltros());
  };

  historico = entity => {
    this.setState({visible: true});
    this.props.buscarLinhaProducaoPorNomeRequest(entity.nome);
  };

  criaUrlForm = objeto => {
    return CLIENT_URL + "/cad/linhaDeProducao/form/" + objeto.id;
  };
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  linhaDeProducao: store.linhaDeProducao,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    linhaProducaoListarRequest,
    linhaProducaoDeletarRequest,
    buscarLinhaProducaoPorNomeRequest,
    ativarOuDesativarRequest,
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
