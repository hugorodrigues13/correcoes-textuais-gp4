import React, { useState } from "react";
import {Button, Dropdown, Menu} from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import api from "../../services/api";
import * as ACOES from "../../store/modules/Login/loginAction";
import ConfirmacaoLinguagem from "../modal/ConfirmacaoLinguagem";

const srcBrasil = require("../../images/BR.8ca6ba30.png");
const srcUS = require("../../images/united-states-flag-icon-1.png");
const srcES = require("../../images/spain-2906824_640.png");

export function DropdownIdiomaNavbar() {
  const idioma = useSelector(store => store.sessaoReducer.language);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const flags=(
    <Menu id="flags">
        <Menu.Item type="link" onClick={() => confirmLanguageSelection("pt-BR")}>
          <ImgItemRound alt="logo" src={srcBrasil} />
        </Menu.Item>
        <Menu.Item type="link" onClick={() => confirmLanguageSelection("en-US")}>
          <ImgItemRound alt="logo" src={srcUS} />
        </Menu.Item>
        <Menu.Item type="link" onClick={() => confirmLanguageSelection("es-ES")}>
          <ImgItemRound alt="logo" src={srcES} />
        </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div id="components-dropdown-demo-dropdown-button">
          <Dropdown.Button overlay={flags} />
          <div id="flag-selected">
            <ImgItemRound alt="logo" src={getLanguage()} />
          </div>
      </div>
      <ConfirmacaoLinguagem
        visible={showModal}
        handleCancel={handleHideModal}
        handleOk={onClickConfirmar}
      />
    </>
  );

  function handleShowModal() {
    setShowModal(true);
  }

  function handleHideModal() {
    setShowModal(false);
  }

  function onClickConfirmar() {
    handleHideModal();
    changeLanguage(selectedLanguage).then(() => location.reload());
  }

  function confirmLanguageSelection(language) {
    setSelectedLanguage(language);
    if (window.location.pathname.match(/form/g)) {
      handleShowModal();
    } else {
      changeLanguage(language).then(() => location.reload());
    }
  }

  function getLanguage() {
    if (idioma === "en-US") {
      return srcUS
    } else if (idioma === "es-ES") {
      return srcES
    } else {
      return srcBrasil
    }
  }

  async function changeLanguage( key ) {
    await api.setIdioma(key);
    await dispatch(ACOES.changeIdioma(key));
  }
}

const ImgItemRound = styled.img`
  object-fit: cover;
  width: 40px;
  height: 40px;
  border: 4px solid white;
  &:hover{
    border-color:#E5E5E5;

  }
`;

const FlagSelector = styled.div`

`;
