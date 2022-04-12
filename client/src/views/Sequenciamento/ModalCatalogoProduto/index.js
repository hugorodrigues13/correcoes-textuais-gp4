import React from "react";
import {Modal, Button, Row, Col} from "antd";
import {injectIntl} from "react-intl";
import {useSelector} from "react-redux";
import TabelaAnt from "../../../components/tabelaAnt/Tabela";
import './styles.css';


function ModalCatalogoProduto({
                                visible,
                                handleCancel,
                                intl,
                                codigoProduto,
                                descricaoProduto
                              }) {
  const {itens} = useSelector(store => store.sequenciamento.listItens) || []

  const configTable = () => {
    return {
      size: "small",
      i18n: "sequenciamento.catalogo.tabela.",
      columns: [
        {
          key: "nome",
        },
        {
          key: "valor",
        },
      ],
      data: itens,
    }
  };

  return (
    <Modal
      className={"sequenciamento-catalogo-modal"}
      visible={visible}
      title={`${getMessage("sequenciamento.title.modal.label")} - ${codigoProduto} - ${descricaoProduto}`}
      onCancel={handleCancel}
      width={980}
      destroyOnClose={true}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {getMessage("comum.cancelar.label")}
        </Button>
      ]}
    >
      <Row gutter={24}>
        <Col md={24}>
          <div className={"sequenciamento-catalogo"}>
            {
              itens && itens.length ? <TabelaAnt
                configTable={configTable()}/> : getMessage("sequenciamento.semItensParaCodigoOrganizacao.message")
            }
          </div>
        </Col>
      </Row>
    </Modal>
  );

  function getMessage(id) {
    return intl.formatMessage({id});
  }
}

export default injectIntl((ModalCatalogoProduto));
