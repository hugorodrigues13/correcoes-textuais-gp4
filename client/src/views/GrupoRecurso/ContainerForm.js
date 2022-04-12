import React from "react";
import {Form, Spin} from "antd";
import {GrupoRecursosForm} from "./Form";
import {bindActionCreators} from "redux";
import {injectIntl, intlShape} from "react-intl";
import {connect} from "react-redux";
import { grupoRecursoPrepararNovoRequest,
         grupoRecursoPrepararEditarRequest } from "../../store/modules/GrupoRecurso/action";

class GrupoRecursoContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    originalEntity: {
      nome: "",
      operacao: "",
      recrusos: [],
      defeitos: [],
    },
  };

  render() {
    const { recursos, entityInstance, loading, defeitos, listTiposRegras, listMotivosParadas, error} = this.props.grupoRecurso;
    return(
      <>
        <Spin spinning={false}>
          <GrupoRecursosForm
            id={this.props.match.params.id}
            entityInstance={this.setEntityInstanceReducer(entityInstance)}
            loading={loading}
            getMessage={this.getMessage}
            listRecursos={recursos}
            listDefeitos={defeitos}
            listTiposRegras={listTiposRegras}
            listMotivosParadas={listMotivosParadas}
            error={error || []}
          />
        </Spin>
      </>
    )
  }


  componentDidMount() {
    document.title = this.getMessage("gruporecurso.cadastro.titlePage")
    this.getModel();
  }

  getModel = async () => {
    if(this.isUserEdit()) {
      this.props.grupoRecursoPrepararEditarRequest(this.props.match.params.id)
    } else {
      this.props.grupoRecursoPrepararNovoRequest()
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

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  isUserEdit = () => {
    return this.props.match.params && this.props.match.params.id !== undefined;
  };
}

GrupoRecursoContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToprops = store => ({
  grupoRecurso: store.grupoRecurso
});

const mapDispatchToprops = dispatch => bindActionCreators( { grupoRecursoPrepararNovoRequest, grupoRecursoPrepararEditarRequest }, dispatch);

export default injectIntl(
  connect(
    mapStateToprops,
    mapDispatchToprops
  )(GrupoRecursoContainer)
)
