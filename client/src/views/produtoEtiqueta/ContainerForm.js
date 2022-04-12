import React from 'react'
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {injectIntl, intlShape} from "react-intl";
import {Spin} from "antd"
import {ProdutoEtiquetaForm} from "./Form";
import {prepararNovoRequest, prepararEditarRequest} from "../../store/modules/produtoEtiqueta/action";

class ProdutoEtiquetaContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  };

  render() {
    const {entityInstance, loading, error, listGrupoRecurso} = this.props.produtoEtiqueta;
    return (
      <>
        <Spin spinning={false}>
          <ProdutoEtiquetaForm
            id={this.props.match.params.id}
            entityInstance={this.setEntityInstance(entityInstance)}
            loading={loading}
            getMessage={this.getMessage}
            listGrupoRecurso={ listGrupoRecurso || []}
            setEntityInstance={async entityInstance =>
              await this.setState({entityInstance})
            }
            error={error || []}
          />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("produtoEtiqueta.cadastro.titlePage")
    this.getModel()
  }

  getModel = async () => {
    if(this.isEdit()) {
      this.props.prepararEditarRequest( this.props.match.params.id )
    } else {
      this.props.prepararNovoRequest()
    }
  };

  getMessage = (id, args={}) => {
    return this.props.intl.formatMessage({ id: id }, args)
  };

  isEdit = () => {
    return this.props.match.params && this.props.match.params.id !== undefined
  };

  setEntityInstance = entityInstance => {
    if(entityInstance) {
      this.setState( {entityInstance} );
      return entityInstance
    } else {
      return this.state.entityInstance
    }
  }
}

ProdutoEtiquetaContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  produtoEtiqueta: store.produtoEtiqueta
});

const mapDispatchToProps = dispatch => bindActionCreators( {prepararNovoRequest, prepararEditarRequest}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ) (ProdutoEtiquetaContainer)
)
