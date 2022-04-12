import React, { Component } from "react";
import "./../css/Toggle.css";
import { Col } from "react-bootstrap";
import styled from "styled-components";

const LabelToggleStyled = styled.label.attrs({
  className: "switch"
})`
  &.widthToggle {
    width: 70px;
  }
`;
const contentSim = idioma => {
  if (idioma === "en-US") {
    return "YES";
  } else if (idioma === "es-ES") {
    return "SÍ";
  } else {
    return "SIM";
  }
};
const contentNao = idioma => {
  if (idioma === "en-US") {
    return "NOT";
  } else if (idioma === "es-ES") {
    return "NO";
  } else {
    return "NÃO";
  }
};
const DivSliderStyled = styled.div.attrs({
  className: "slider"
})`
     input:checked + &:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
         transform: translateX(35px);
         }
     &:after
    {
        content:'${props => contentNao(props.idioma)}';
        color: #747474;
        display: block;
        position: absolute;
        transform: translate(-0%,-50%);
        top: 50%;
        left: 50%;
        font-size: 12px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
    input:checked + &:after
    {
        transform: translate(-105%,-50%);
        content:'${props => contentSim(props.idioma)}';
        color: white;
    }
    ${props =>
      !props.isRegra &&
      `input:disabled + & {
        opacity: 0.4;
    }`}
    ${props =>
      props.isRegra &&
      !props.checked &&
      `input:disabled + & {
        opacity: 0.4;
    }`}

`;

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idioma: ""
    };
  }

  componentDidMount() {
    let params = new URLSearchParams(document.location.search.substring(1));
    let locale = params.get("lang");
    this.setState({ idioma: locale });
  }
  render() {
    return (
      //alinhamento-toggle
      <div className="alinhamento-toggle">
        <Col>
          {/*toggle-pesonalizado*/}
          {this.props.label ? (
            <label className="">{this.props.label}</label>
          ) : (
            ""
          )}
        </Col>
        {/*conteudo-toggle*/}
        <Col className="conteudo-toggle">
          {this.props.textoSimOuNao ? (
            <LabelToggleStyled className="widthToggle">
              <input
                type="checkbox"
                id={this.props.id}
                disabled={this.props.disabled ? this.props.disabled : false}
                checked={this.props.checked}
                onChange={this.props.funcao}
              />
              <DivSliderStyled
                isRegra={this.props.isRegra}
                checked={this.props.checked}
                idioma={this.state.idioma}
              ></DivSliderStyled>
            </LabelToggleStyled>
          ) : (
            <label className="switch">
              <input
                type="checkbox"
                disabled={this.props.disabled ? this.props.disabled : false}
                id={this.props.id}
                checked={this.props.checked}
                onChange={this.props.funcao}
              />
              <div className="slider"></div>
            </label>
          )}
        </Col>
      </div>
    );
  }
}

export default Toggle;
