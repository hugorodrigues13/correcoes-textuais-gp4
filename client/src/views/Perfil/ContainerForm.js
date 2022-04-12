import React from 'react';
import {Form, Spin} from "antd";
import {PerfilForm} from "./Form";
import {bindActionCreators} from "redux";
import {prepararNovoRequest, prepararEditarRequest} from "../../store/modules/Perfil/action"
import {injectIntl, intlShape} from "react-intl";
import {connect} from "react-redux";

class PerfilContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    originalEntity: {
      nome: "",
      descricao: ""
    },
    permissoes:
      {
        plugins: ["checkbox"],
        core: {
          themes: {
            icons: false
          },
          data: []
        }
      }
  };

  render() {
    const { entityInstance, loading, permissoes, error} = this.props.perfil;
    return(
      <>
        <Spin spinning={false}>
          <PerfilForm
          id={this.props.match.params.id}
          entityInstance={this.setEntityInstanceReducer(entityInstance)}
          loading={loading}
          listPermissoes={this.setPermissoes(permissoes)}
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
    document.title = this.getMessage("perfil.cadastro.titlePage");
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
    if(entityInstance){
      this.setState( {entityInstance} );
      return entityInstance
    } else {
      return this.state.entityInstance
    }
  };

  setPermissoes = permissoes => {
    let state = this.state;
    if(state.permissoes.core.data.length < 1 && permissoes){
      permissoes.push({
      id: 0,
      parent: "#",
      text: this.getMessage("role.permissoes.label"),
      state: { selected: false },
      icon: false
      });
      state.permissoes.core.data = permissoes;
      this.setState(state);
    }
    return state.permissoes
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  isUserEdit = () => {
    return this.props.match.params && this.props.match.params.id !== undefined;
  };
}

PerfilContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToprops = store => ({
  perfil: store.perfil
});

const mapDispatchToprops = dispatch => bindActionCreators( { prepararNovoRequest, prepararEditarRequest}, dispatch);

export default injectIntl(
  connect(
    mapStateToprops,
    mapDispatchToprops
  )(PerfilContainer)
)
