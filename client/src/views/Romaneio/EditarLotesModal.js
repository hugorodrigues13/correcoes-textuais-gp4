import {Button, Modal} from "antd";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import * as React from "react";
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";
import Alert from "react-s-alert";
import {getMessage} from "../../components/messages";
import Filter from "../../components/filter/Filter";
import {bindActionCreators} from "redux";
import {deleteRequest, listGrupoLinhaProducaoRequest} from "../../store/modules/GrupoLinhaProducao/action";
import {editarLotesRequest, listarLotesRequest} from "../../store/modules/Romaneio/action";
import {connect} from "react-redux";

class EditarLotesModal extends React.Component {

  campos = [
    {key: "lote", nome: "lote", tipo: "text", visible: true, value: getMessage("romaneio.dados.lotes.modal.lote.label")},
    {key: "codigo", nome: "codigo", tipo: "text", visible: true, value: getMessage("romaneio.dados.lotes.modal.codigo.label")},
    {key: "descricao", nome: "descricao", tipo: "text", visible: true, value: getMessage("romaneio.dados.lotes.modal.descricao.label")},
  ]

  state = {
    selectedRows: [],
    filterComp: {
      campos: this.campos,
      layout: "vertical",
      prefix: "romaneio.dados.lotes.modal",
    },
    filtros: {
      ...Object.assign({}, ...this.campos.filter(c => c.visible).map(c => ({[c.key]: ""}))),
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        lote: "",
        order: "asc"
      }
    }
  }

  componentDidUpdate = async prevProps => {
    if (this.props.entity.lotes && prevProps.entity !== this.props.entity) {
      await this.setState({
        selectedRows: this.props.entity.lotes?.map(lote => lote.id)
      })
      this.getList()
    }
  };

  configTable = () =>  {
    const { entities, total } = this.props.romaneio.lotes || {};
    return {
      i18n: "romaneio.dados.lotes.modal.",
      size: "small",
      rowSelection: {
        type: "checkbox",
        onChange: (rows, records) => {
          if (!rows.length) {
            Alert.error(this.getMessage("romaneio.dados.lotes.modal.naoPodeRemoverTudo.label"))
            return
          }
          console.log(rows)
          this.setState({selectedRows: rows})
        },

        selectedRowKeys: this.state.selectedRows,
        preserveSelectedRowKeys: true,
      },
      columns: [
        {
          key: "lote",
          width: "15%",
        },
        {
          key: "codigo",
          width: "10%",
        },
        {
          key: "descricao",
          width: "65%",
        },
        {
          key: "quantidade",
          width: "10%",
        },
      ],
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      },
      data: entities,
    }
  }

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  }

  editarLotes = () => {
    this.props.setModalOpen(false)
    this.props.editarLotesRequest(this.props.entity.id, this.state.selectedRows)
  }

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getList()
  }

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = {...this.state.filtros, ...values};
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList()
  };

  getList = () => {
    this.props.listarLotesRequest(this.getFiltros(), this.state.selectedRows)

  };

  getFiltros = () => {
    const {filtros} = this.state;
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

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset ) * max;
    return offset
  }

  mapPropsToFields = () => {
    const {filtros} = this.state;
    return {
      lote: filtros ? filtros.lote : "",
    }
  };

  cancel = () => {
    this.props.setModalOpen(false)
    this.setState({
      selectedRows: this.props.entity.lotes?.map(lote => lote.id)
    })
  }

  render() {
    return (
      <Modal
        width={980}
        visible={this.props.modalOpen}
        onCancel={this.cancel}
        onOk={this.editarLotes}
        title={this.getMessage("romaneio.dados.lotes.modal.titulo.label")}>
        <Filter
          filterComp={{...this.state.filterComp, campos: this.state.filterComp.campos.filter(c => c.visible)}}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={this.props.romaneio.loading}/>
      </Modal>
    )

  }
}

EditarLotesModal.propTypes = {
  setModalOpen: PropTypes.func,
  modalOpen: PropTypes.bool,
  entity: PropTypes.object,
}
const mapStateToProps = store => ({
  romaneio: store.romaneio,
  requestManager: store.requestManager
})

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    listarLotesRequest, editarLotesRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(EditarLotesModal))
