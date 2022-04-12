import { Glyphicon, Popover, OverlayTrigger } from "react-bootstrap";
import React from "react";
import FormatadorTempo from "../../utils/formatadorTempo";
import { intlShape, injectIntl, FormattedMessage } from "react-intl";

const AuditInfo = props => {
  let popoverClick = (
    <Popover style={{ width: "13%" }} id="popover-trigger-click" title="Info.">
      <small>
        <b>
          <FormattedMessage id="audit.usuarioCriacao.label" />
        </b>
        {props.objeto.usuarioCriacao}
      </small>
      <br />
      <small>
        <b>
          <FormattedMessage id="audit.usuarioAlteracao.label" />
        </b>
        {props.objeto.usuarioAlteracao}
      </small>
      <br />
      <small>
        <b>
          <FormattedMessage id="audit.dataCriacao.label" />
        </b>
        {FormatadorTempo(props.objeto.dataCriacao)}
      </small>
      <br />
      <small>
        <b>
          <FormattedMessage id="audit.dataAlteracao.label" />
        </b>
        {FormatadorTempo(props.objeto.dataAtualizacao)}
      </small>
    </Popover>
  );

  return (
    <OverlayTrigger trigger={"click"} placement={"top"} overlay={popoverClick}>
      <Glyphicon className="icone-info-blocos" glyph="info-sign" />
    </OverlayTrigger>
  );
};

AuditInfo.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(AuditInfo);
