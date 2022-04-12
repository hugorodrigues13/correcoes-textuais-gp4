import React from 'react'
import {Spin} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {injectIntl, intlShape} from "react-intl";
import {
  buscarGruposRequest,
  getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest,
} from "../../store/modules/Sequenciamento/action"
import Sequenciamento from "./index";
import HTML5Backend from "react-dnd-html5-backend";
import {DndProvider} from 'react-dnd';
import { getMessage } from "../../components/messages";

class SequenciamentoContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  };

  render() {
    const {
      linhasGrupo,
      ordensGrupo,
      listaGrupos,
      pedidosGrupo,
      loadingOrdens,
      loadingPedidos,
      grupoSelecionado,
      showModalCatalogo,
      produtoSelecionado,
      codigoOrdemAnterior,
      codigoProdutoCatalogo,
      descricaoProdutoCatalogo,
      loadingQtdeOrdensSemGrupo,
      qtdeOrdensSemGrupo,
      ordensSemGrupo,
      LoadingOrdensSemGrupo,
      ordensComGrupo,
      LoadingOrdensComGrupo,
      totalOrdensSemGrupoFiltradas,
      materiaPrima,
      materiaPrimaTotal,
      loadingMateriaPrima,
      usuarioLogado,
      listStatusOrdemFabricacao,
    } = this.props.sequenciamento;
    const {loading} = this.props.requestManager;

    return (
      <>
        <DndProvider backend={HTML5Backend}>
          <Spin spinning={loading && !loadingOrdens && !loadingPedidos}>
            <Sequenciamento
              getMessage={this.getMessage}
              grupoSelecionado={grupoSelecionado}
              produtoSelecionado={produtoSelecionado}
              listaGrupos={listaGrupos}
              ordensGrupo={ordensGrupo}
              codigoOrdemAnterior={codigoOrdemAnterior}
              pedidosGrupo={pedidosGrupo}
              loadingPedidos={loadingPedidos}
              linhasGrupo={linhasGrupo}
              showModalCatalogo={showModalCatalogo}
              codigoProdutoCatalogo={codigoProdutoCatalogo}
              descricaoProdutoCatalogo={descricaoProdutoCatalogo}
              loadingQtdeOrdensSemGrupo={loadingQtdeOrdensSemGrupo}
              qtdeOrdensSemGrupo={qtdeOrdensSemGrupo}
              ordensSemGrupo={ordensSemGrupo}
              LoadingOrdensSemGrupo={LoadingOrdensSemGrupo}
              ordensComGrupo={ordensComGrupo}
              LoadingOrdensComGrupo={LoadingOrdensComGrupo}
              totalOrdensSemGrupoFiltradas={totalOrdensSemGrupoFiltradas}
              materiaPrima={materiaPrima}
              materiaPrimaTotal={materiaPrimaTotal}
              loadingMateriaPrima={loadingMateriaPrima}
              usuarioLogado={usuarioLogado}
              listStatusOrdemFabricacao={listStatusOrdemFabricacao}
            />
          </Spin>
        </DndProvider>
      </>
    )
  }

  componentDidMount() {
    document.title = getMessage("sequenciamento.title.label")
    this.getModel().then(r => r);
  }

  getModel = async () => {
    this.props.buscarGruposRequest()
    this.props.getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest({})
  };

  getMessage = (id, argument) => {
    return this.props.intl.formatMessage({id: id}, {...argument})
  };
}

SequenciamentoContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  sequenciamento: store.sequenciamento,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch => bindActionCreators({
  buscarGruposRequest,
  getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest,
}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SequenciamentoContainer)
)
