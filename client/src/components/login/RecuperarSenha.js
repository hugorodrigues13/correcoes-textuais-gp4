import React, {Fragment} from "react";
import {Button, Form, Icon, Input, Modal} from "antd"
import {injectIntl} from "react-intl";
import axios from "axios";
import Alert from "react-s-alert"
import {errorHandler} from "../utils";
import {SERVER_URL} from "../../config";

class RecuperarSenha extends React.Component {
  formRef = React.createRef()

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      isSendingRequest: false
    };
  }
  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  onFinish = (value) => {
    axios
      .post(
        `${SERVER_URL}/recuperar/enviarEmailRecuperarSenha?email=${value.email}`,
        {
          executaNoTratamentoDo422: error => {
            errorHandler(this, error, false);
          }
        }
      ).then(response => {
      this.props.onHide();
      this.setState({
        isSendingRequest: false
      });
      response.data.messages.forEach((elem) => {
        Alert.error(elem.message);
      });
    }).catch(error => {
      this.setState({
        isSendingRequest: false
      });
      let state = this.state;
      if (error.message) {
        error.response.data.forEach(error => {
          state.erros.push({
            message: this.getMessage(error.message),
            field: error.field
          })
        })
      }
      this.setState(state);
    });
    this.props.onHide();
  }

  enviarEmailRecuperarSenha = (e) => {
    e.preventDefault();
    this.formRef.current.submit();
  };

  render() {
    return (
      <Fragment>
        <Modal
          title={this.getMessage("recuperarsenha.titulo.label")}
          visible={this.props.show}
          onOk={(e) => this.enviarEmailRecuperarSenha(e)}
          onCancel={this.props.onHide}
          destroyOnClose={true}
          footer={[
            <Button
              key="back"
              onClick={this.props.onHide}
            >
              {this.getMessage("comum.cancelar.label")}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={(e) => this.enviarEmailRecuperarSenha(e)}
              style={{ background: "#e64949", borderColor: "#e64949"}}
            >
              {this.getMessage("recuperarsenha.enviar.label")}
            </Button>
          ]}
        >
          <Form ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item hasFeedback label={this.getMessage("recuperarsenha.email.label")} name={"email"}
            rules={[
              {
                type: "email",
                message:this.getMessage("recuperarsenha.email.invalid")
              }, {
                required: true,
                message: this.getMessage("recuperarsenha.email.required")
              }
            ]}>
                <Input
                  data-test="recuperarSenha-input"
                  type="email"
                  prefix={
                    <Icon
                      type="mail"
                      style={{ color: "rgba(0,0,0,.25)", fontSize: 16, marginRight: -5}}
                    />
                  }
                  placeholder={this.getMessage("recuperarsenha.email.label")}
                />
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
export default injectIntl(RecuperarSenha);
