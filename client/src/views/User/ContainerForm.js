import React from 'react'
import { Form, Spin } from "antd";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {injectIntl, intlShape} from "react-intl";
import {UserForm} from "./Form"
import {CLIENT_URL} from "../../config";
import {
  prepararEditarPerfilRequest,
  prepararEditarUserRequest,
  prepararNovoUserRequest
} from "../../store/modules/User/action";
import {PerfilForm} from "./Perfil";
import PropTypes from "prop-types";

class UserContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  };

  render() {
    const {perfis, acessos, planejadores, entityInstance, loading} = this.props.users;
    const props = {
      id: this.props.match.params.id || entityInstance.id,
      entityInstance: entityInstance,
      loading: loading,
      listPerfil: perfis,
      listAcessos: acessos,
      listPlanejadores: planejadores.map(p => ({key: p, value: p})),
      getMessage: this.getMessage,
      setEntityInstance: entityInstance =>
        this.setState({entityInstance})
  }

    return(
      <>
        <Spin spinning={false}>
          {this.isPerfilEdit() ?
            <PerfilForm {...props} />
            : (
              <UserForm {...props} />)
          }
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("usuario.cadastro.titlePage");
    this.getModel();
  }

  getModel = async () => {
    if (this.isPerfilEdit()) {
      this.props.prepararEditarPerfilRequest();
    } else if (!this.isUserEdit()) {
      this.props.prepararNovoUserRequest();
    } else {
      this.props.prepararEditarUserRequest(this.props.match.params.id);
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  isUserEdit = () => {
    return this.props.match.params && this.props.match.params.id !== undefined;
  };

  isPerfilEdit = () => {
    return this.props.match.path === CLIENT_URL + "/seg/user/perfil";
  };
}

UserContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  users: store.users
});

const mapDispatchToProps = dispatch => bindActionCreators({prepararEditarUserRequest, prepararNovoUserRequest, prepararEditarPerfilRequest}, dispatch);

export default injectIntl(
  connect(
  mapStateToProps,
  mapDispatchToProps
  )(UserContainer)
)

UserForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getMessage: PropTypes.func,
  setEntityInstance: PropTypes.func,
  entityInstance: PropTypes.shape({
    fullname: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    valor: PropTypes.string,
    perfil: PropTypes.arrayOf(PropTypes.number),
    enabled: PropTypes.bool
  }),
  perfis: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.string
    })
  ),
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string
    })
  )
};

UserForm.defaultProps = {
  errors: []
};

PerfilForm.propTypes = {
  getMessage: PropTypes.func,
  setEntityInstance: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  entityInstance: PropTypes.shape({
    fullname: PropTypes.string,
    email: PropTypes.string,
    alteraSenha: PropTypes.bool
  })
};
