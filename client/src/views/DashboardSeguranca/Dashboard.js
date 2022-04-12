import React from "react";
import { Row } from "antd";
import { intlShape, injectIntl, FormattedMessage } from "react-intl";

class Dashboard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      content: ""
    };
  }

  render() {
    return (
        <Row gutter={24}>
          <h2 className="titulo-pagina ">
            <FormattedMessage id="menu.dashboardSeguranca.label" />
          </h2>
        </Row>
    );
  }
}

Dashboard.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(Dashboard);
