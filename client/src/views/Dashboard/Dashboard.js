import React from "react";
import { Row } from "antd";
import { intlShape, injectIntl, FormattedMessage } from "react-intl";
import {getMessage} from "../../components/messages";

class Dashboard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    document.title = getMessage("home.titlePage.message");
  }

  render() {
    return (
        <Row gutter={24}>
          <h2 className="titulo-pagina ">
            <FormattedMessage id="menu.paginaPrincipal.label" />
          </h2>
        </Row>
    );
  }
}

Dashboard.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(Dashboard);
