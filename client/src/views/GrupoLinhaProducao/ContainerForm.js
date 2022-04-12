import React from 'react'
import {bindActionCreators} from "redux";
import {Spin} from "antd";
import {GrupoLinhaProducaoForm} from "./Form";
import {prepararNovoRequest, prepararEditarRequest, GrupoLinhaProducaoSetEntity} from "../../store/modules/GrupoLinhaProducao/action"
import {injectIntl, intlShape} from "react-intl";
import {connect} from "react-redux";

class GrupoLinhaProducaoContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    originalEntity: {}
  };

  render() {
    const { entityInstance, loading, listLinhaProducao, error } = this.props.grupoLinhaProducao;
    return(
      <>
        <Spin spinning={false}>
          <GrupoLinhaProducaoForm
            id={this.props.match.params.id}
            entityInstance={entityInstance}
            loading={loading}
            listLinhaProducao={(listLinhaProducao || []).map(value => ({...value, key: value.id, value: value.nome}))}
            getMessage={this.getMessage}
            setEntityInstance={ entityInstance =>
              this.props.GrupoLinhaProducaoSetEntity(entityInstance)
            }
            error={error || []}
          />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("grupoLinhaProducao.cadastro.titlePage")
    this.getModel();
  }

  getModel = async () => {
    if(this.isUserEdit()) {
      this.props.prepararEditarRequest(this.props.match.params.id)
    } else {
      this.props.prepararNovoRequest()
    }
  };

  setEntityInstanceReducer = entityInstance => {
    if(entityInstance) {
      this.setState( {entityInstance} );
      return entityInstance
    } else {
      return this.state.entityInstance
    }
  };

  getMessage = (id, argument)  => {
    return this.props.intl.formatMessage({ id: id }, {argument: argument});
  };

  isUserEdit = () => {
    return this.props.match.params && this.props.match.params.id !== undefined
  }
}

GrupoLinhaProducaoContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  grupoLinhaProducao: store.grupoLinhaProducao
});

const mapDispatchToProps = dispatch => bindActionCreators( {prepararNovoRequest, prepararEditarRequest, GrupoLinhaProducaoSetEntity}, dispatch)

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GrupoLinhaProducaoContainer)
)
