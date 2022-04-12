import React from 'react'
import {bindActionCreators} from "redux";
import {Spin} from "antd";
import {AcessoForm} from "./Form";
import {prepararNovoRequest, prepararEditarRequest} from "../../store/modules/Acesso/action"
import {injectIntl, intlShape} from "react-intl";
import {connect} from "react-redux";

class AcessoContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    originalEntity: {},
  };

  render() {
    const { entityInstance, loading, listOrganizacao, listFornecedor, error } = this.props.acesso;
    return(
      <>
        <Spin spinning={false}>
          <AcessoForm
            id={this.props.match.params.id}
            entityInstance={this.setEntityInstanceReducer(entityInstance)}
            loading={loading}
            listOrganizacao={listOrganizacao || []}
            listFornecedor={listFornecedor || []}
            getMessage={this.getMessage}
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
    document.title = this.getMessage("acesso.cadastro.titlePage")
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

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  isUserEdit = () => {
    return this.props.match.params && this.props.match.params.id !== undefined
  }
}

AcessoContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  acesso: store.acesso
});

const mapDispatchToProps = dispatch => bindActionCreators( {prepararNovoRequest, prepararEditarRequest}, dispatch)

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AcessoContainer)
)
