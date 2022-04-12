import * as React from 'react';
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
  ativarOuDesativarRequest,
  motivoParadaDeleteRequest,
  motivoParadaListRequest
} from "../../store/modules/MotivosDeParada/action";
import {Button, List as ListAnt, PageHeader, Popover} from "antd";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import history from "../../services/history";

class MotivosDeParada extends React.Component {

  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "motivoDeParada",
      campos: [
        {nome: "motivo", tipo: "text", isSorteable: true},
        {nome: "tipo", tipo: "select", isSorteable: true , seletor: "tipos", renderLabel: this.renderTipo, useMessage: false},
        {nome: "gruposRecurso", tipo: "text"},
        {nome: "status", tipo: "select", ordenar: true, defaultValue: "ATIVO"}
      ],
    },
    dataFiltro: { status: ["TODOS", "ATIVO", "INATIVO"] },
    filtros: {
      status: "ATIVO",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "motivo",
        order: "asc"
      }
    }
  };

  componentDidMount() {
    document.title = getMessage("motivoDeParada.title.label");
    this.getList()
  }

  render(){
    const { loading } = this.props.requestManager

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"motivoDeParada.title.label"}/>}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/cad/motivoDeParada/form")}
            >
              <FormattedMessage id={"comum.novoRegistro.label"} />
            </Button>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={{...this.props.motivoParada, ...this.state.filterComp, ...this.state.dataFiltro}}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  configTable = () => {
    const { entities, total } = this.props.motivoParada
    return {
      i18n: "motivoDeParada.",
      columns: [
        {
          key: "motivo",
          isSorteable: true,
        },
        {
          key: "tipo",
          render: this.renderTipo,
          isSorteable: true,
        },
        {
          key: "gruposRecurso",
          render: (value, record) => {
            if(entities) {
              let gruposRecurso = "";
              gruposRecurso += value;
              gruposRecurso = gruposRecurso.replaceAll(",", ", ");
              if(gruposRecurso.length < 130) {
                return (<div>{gruposRecurso}</div>);
              } else {
                return <Popover content={this.contentPopover(record)} trigger={"hover"}>
                  {gruposRecurso.slice(0, 130) + ("...")}
                </Popover>
              }
            }
          },
        },
        {
          key: "status",
          isSorteable: false,
          ativarOuDesativar: this.ativarOuDesativar,
          statusLoading: this.props.motivoParada.statusLoading
        }
      ],
      data: entities,
      acoes: {
        editar: this.criarUrlForm,
        excluir: this.deletar,
        width: '15%',
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

  ativarOuDesativar = (object) => {
    this.props.ativarOuDesativarRequest(object,  this.getFiltros())
  }

  deletar = objeto => {
    this.props.motivoParadaDeleteRequest(objeto.id, this.getFiltros());
  };

  renderTipo(value) {
    return getMessage(`motivoDeParada.tipo.${value}.label`)
  }

  contentPopover = (value) => {
    return (
        <div style={{maxHeight: "50vh", overflow: "scroll"}}>
          <ListAnt
              header={
                <h4 style={{fontWeight: "bold"}}>
                  {getMessage("motivoDeParada.gruposRecurso.label")}
                </h4>
              }
              dataSource={value.gruposRecurso}
              renderItem={
                item =>
                    <ListAnt.Item>
                      {item}
                    </ListAnt.Item>
              }
          />
        </div>
    )
  }

  getList = () => {
    const filtros = this.getFiltros();
    this.props.motivoParadaListRequest(filtros)
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

  criarUrlForm = objeto => {
    return CLIENT_URL + "/cad/motivoDeParada/form/" + objeto.id;
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

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      ativo: filtros?.ativo || "ATIVO"
    };
  };

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

MotivosDeParada.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  motivoParada: store.motivoParada,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({motivoParadaListRequest, motivoParadaDeleteRequest, ativarOuDesativarRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MotivosDeParada))
