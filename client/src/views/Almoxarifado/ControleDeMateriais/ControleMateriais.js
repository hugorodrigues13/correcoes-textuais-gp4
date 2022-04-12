import * as React from 'react';
import {getMessage} from "../../../components/messages";
import ControleMateriaisList from "./ControleMateriaisList";

class ControleMateriais extends React.Component{

  render(){
    return (
      <>
        <div style={{marginTop: 45}}/>
        <span className="ant-page-header-heading-title">
          {getMessage("almoxarifado.controleMateriais.title.label")}
        </span>
        <ControleMateriaisList/>
      </>
    )
  }

}

export default ControleMateriais
