import {Button, Modal} from "antd";
import * as React from 'react'
import {injectIntl} from "react-intl";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import PropTypes from "prop-types";
class DadosModal extends React.Component {

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  };

  configTable = () => {
    const { historico } = this.props

    return {
      i18n: "romaneio.dados.modal.",
      size: "small",
      columns: [
        {
          key: "data",
        },
        {
          key: "hora",
        },
        {
          key: "nfEncomenda",
        },
        {
          key: "nfRetorno",
        },
        {
          key: "status",
        },
        {
          key: "integracao",
        },
        {
          key: "usuario",
        },
        {
          key: "motivo",
        },
      ],
      data: historico,
    }
  }

  render(){
    return (
      <Modal
        width={980}
        visible={this.props.modalOpen}
        onCancel={() => this.props.setModalOpen(false)}
        title={this.getMessage("romaneio.dados.modal.titulo.label", {romaneio: this.props.entity.romaneio})}
        footer={
          <Button type="primary" onClick={() => this.props.setModalOpen(false)}>
            {this.getMessage("comum.voltar.label")}
          </Button>
        }
      >
        <TabelaAnt configTable={this.configTable()} loading={this.props.loadingHistorico}/>
      </Modal>
    )
  }

}
DadosModal.propTypes = {
  setModalOpen: PropTypes.func,
  modalOpen: PropTypes.bool,
  entity: PropTypes.object,
}
export default injectIntl(DadosModal)
