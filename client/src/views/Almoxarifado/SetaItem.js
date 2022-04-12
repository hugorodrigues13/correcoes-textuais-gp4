import * as React from 'react';
import {AiOutlineClockCircle} from "react-icons/all";
import PropTypes from "prop-types";
import "./style.css";
import {Tooltip} from "antd";
import {getMessage} from "../../components/messages";

class SetaItem extends React.Component {

  render(){
    return (
      <svg
        id={this.props.id}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 158 100"
      >
        <g
          id="seta"
          data-name="seta"
          fill={this.props.corSeta}
        >
          <path
            d="M 134.8255310058594 72 L 1.780702114105225 72 L 22.93700218200684 37.29233932495117 L 23.25190353393555 36.77571868896484 L 22.94040298461914 36.25701904296875 L 1.767010807991028 1 L 134.8211975097656 1 L 156.3014526367188 36.76799392700195 L 134.8255310058594 72 Z"
            stroke={this.props.corTexto}
          />
          {this.props.texto.length > 10
            ? <Tooltip title={this.props.texto}>
              <text fill={this.props.corTexto} className={"text-almofarixado-codigo"} x="35" y={this.props.data ? "35" : "40"}>{this.props.texto.substring(0,10) + "..."}</text>
            </Tooltip>
            : <Tooltip mouseEnterDelay={0.5} title={getMessage(this.props.tooltipTexto)}>
              <text fill={this.props.corTexto} className={"text-almofarixado-codigo"} x="35" y={this.props.data ? "35" : "40"}>{this.props.texto}</text>
            </Tooltip>
          }
          {this.props.data && <>
            <AiOutlineClockCircle fill={this.props.corTexto} fontWeight="bold" fontSize="14" x="28" y="40"/>
            <Tooltip mouseEnterDelay={0.5} title={getMessage(this.props.tooltipData)}>
              <text x="44" y="51" fill={this.props.corTexto} fontSize="14" fontWeight="bold">{this.props.data}</text>
            </Tooltip>
          </>}
          {this.props.ordemProducao && <Tooltip mouseEnterDelay={0.5} title={getMessage("almoxarifado.tooltips.ordemProducaoEData.label")} overlayStyle={{maxWidth: 500}}>
              <text x="13" y="68" fill={this.props.corSecundariaTexto} fontSize="10" fontWeight="bold">
                {this.props.ordemProducao} - {this.props.dataPrevisaoFinalizacao}
              </text>
          </Tooltip>}
        </g>
      </svg>
    );
  }

}
SetaItem.propTypes = {
  id: PropTypes.number,
  corTexto: PropTypes.string,
  texto: PropTypes.string,
  data: PropTypes.string,
  corSeta: PropTypes.string
};
export default SetaItem
