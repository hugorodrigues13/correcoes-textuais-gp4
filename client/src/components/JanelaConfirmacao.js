import { Col, Button, Modal } from "react-bootstrap";
import React from "react";
import { FormattedMessage } from "react-intl";

const JanelaConfirmacao = props => {
  return (
    <Modal show={props.mostrar} onHide={props.handleClose} bsSize={"small"}>
      {props.isRemovivel !== false ? (
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage id={"comum.remocao.confirmar.label"} />
          </Modal.Title>
        </Modal.Header>
      ) : (
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage id="comum.inativar.label" />
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {props.isRemovivel !== false ? (
          <p>
            <FormattedMessage id={"comum.remocao.confirmar.mensagem"} />
          </p>
        ) : (
          <p>
            <FormattedMessage id="comum.isRemovivel.label" />
            <br />
            <FormattedMessage id="comum.inativarRegistro.mensagem" />
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Col md={6} className="btn-ajuste">
          {props.isRemovivel !== false ? (
            <Button
              bsStyle="link"
              className="btn-block botao-rv-perigo primario"
              onClick={props.deletarInstancia}
            >
              <p>
                <FormattedMessage id={"comum.remover.label"} />
              </p>
            </Button>
          ) : (
            <Button
              bsStyle="link"
              className="btn-block botao-rv-perigo primario"
              onClick={() => props.ativarOuDesativar(props.objeto)}
            >
              <p>Inativar</p>
            </Button>
          )}
        </Col>
        <Col md={6} className="btn-ajuste">
          <Button
            bsStyle="link"
            className="btn-block botao-rv-primario secundario"
            onClick={props.fecharConfirm}
          >
            <p>
              <FormattedMessage id={"comum.cancelar.label"} />
            </p>
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default JanelaConfirmacao;
