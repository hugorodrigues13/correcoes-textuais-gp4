import React from "react";
import {Form, Spin} from "antd";
import {LinhaDeProducaoForm} from "./Form";
import {bindActionCreators} from "redux";
import {injectIntl, intlShape} from "react-intl";
import {connect} from "react-redux";
import { grupoRecursoPrepararEditarRequest } from "../../store/modules/GrupoRecurso/action";
import { linhaProducaoPrepararNovoRequest,
         linhaProducaoPrepararEditarRequest
          } from "../../store/modules/LinhaDeProducao/action";

class LinhaDeProducaoContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    originalEntity: {
      nome: "",
      processo: ""
    },
  };

  render() {
    const { listGrupoRecurso, entityInstance, loading, retornoEditar, error} = this.props.linhaDeProducao;

    return(
      <>
        <Spin spinning={false}>
          <LinhaDeProducaoForm
            id={this.props.match.params.id}
            entityInstance={this.setEntityInstanceReducer(entityInstance)}
            loading={loading}
            retornoEditar={retornoEditar}
            getMessage={this.getMessage}
            listGrupoRecurso={(listGrupoRecurso||[]).map(l => ({...l, key: l.key || l.id, value: l.value || l.nome}))}
            error={error || []}
          />
        </Spin>
      </>
    )
  }


  componentDidMount() {
    document.title = this.getMessage("linhaDeProducao.cadastro.titlePage")
    this.getModel();
  }

  getModel = async () => {
    if(this.isUserEdit()) {
      this.props.linhaProducaoPrepararEditarRequest(this.props.match.params.id)
    } else {
      this.props.linhaProducaoPrepararNovoRequest()
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

LinhaDeProducaoContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToprops = store => ({
  linhaDeProducao: store.linhaDeProducao,
});

const mapDispatchToprops = dispatch => bindActionCreators( {
  linhaProducaoPrepararNovoRequest,
  linhaProducaoPrepararEditarRequest }, dispatch);

export default injectIntl(
  connect(
    mapStateToprops,
    mapDispatchToprops
  )(LinhaDeProducaoContainer)
)
