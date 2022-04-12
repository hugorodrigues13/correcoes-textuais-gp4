import {Col, Card, Row, Button} from "antd";
import React from "react";
import "./style.css";
import {injectIntl, intlShape} from "react-intl";

class DashItem extends React.Component {

  render(){
    return (
      <Col span={8}>
        <Card className="dash-prog-card">
          <Row gutter={24} className="dash-prog-card-center">
            <Col span={24}>
              {this.props.center}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} className="dash-prog-card-body">
              {typeof this.props.body == 'object'
                ? this.getMessage(this.props.body.id, this.props.body.args)
                : this.getMessage(this.props.body)}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} className="dash-prog-card-button">
              <Button onClick={this.props.buttonHandler}>
                {typeof this.props.buttonText == 'object'
                  ? this.getMessage(this.props.buttonText.id, this.props.buttonText.args)
                  : this.getMessage(this.props.buttonText)}
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    )
  }

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  };

}

export default injectIntl(DashItem)
