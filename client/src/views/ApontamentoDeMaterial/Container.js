import * as React from 'react';
import {FormattedMessage, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {Button, PageHeader, Spin} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import ApontamentoDeMaterialForm from "./Form";
import {FaList} from "react-icons/all";

class ApontamentoDeMaterialContainer extends React.Component {

  componentDidMount = () => {
    document.title = getMessage("menu.apontamentoDeMaterial.label")
  };

  render(){
    const { loading } = this.props.requestManager

    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => history.push(CLIENT_URL + "/")}
          title={getMessage("menu.apontamentoDeMaterial.label")}
          extra={[
            <div key="cabecalho">
              <Button
                size="large"
                className="page-header-ignored-button"
                onClick={() => history.push(CLIENT_URL + "/prod/apontamentoDeMaterial/list")}
              >
                <FaList />
              </Button>

            </div>
          ]}
        />
        <Spin spinning={loading}>
            <ApontamentoDeMaterialForm />
        </Spin>
      </>
    )
  }

}

const mapStateToProps = store => ({
  requestManager: store.requestManager
});

export default injectIntl(connect(mapStateToProps)(ApontamentoDeMaterialContainer))
