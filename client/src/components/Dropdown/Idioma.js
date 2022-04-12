import React from "react";
import { Dropdown, Menu, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import api from "../../services/api";
import * as ACOES from "../../store/modules/Login/loginAction";
import {BsChevronDown} from "react-icons/all";

export function DropdownIdioma() {
  const idioma = useSelector(store => store.sessaoReducer.language);
  const dispatch = useDispatch();

  const menu = (
    <Menu onClick={changeLanguage}>
      {idioma !== "pt-BR" && (
        <Menu.Item key={"pt-BR"}>
          <img
            className=""
            alt="logo"
            src={require("../../images/BR.jpeg")}
            width="49px"
          />
        </Menu.Item>
      )}
      {idioma !== "en-US" && (
        <Menu.Item key={"en-US"}>
          <img
            className=""
            alt="logo"
            src={require("../../images/US.jpg")}
            width="49px"
          />
        </Menu.Item>
      )}
      {idioma !== "es-ES" && (
        <Menu.Item key={"es-ES"}>
          <img
            className=""
            alt="logo"
            src={require("../../images/ES.jpg")}
            width="49px"
          />
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button style={{width: "100%"}} size={"large"}>
        <img style={{float: "left"}} alt="logo" src={getLanguage()} width="40px" />
        <BsChevronDown style={{float: "right", marginTop: 5}} />
      </Button>
    </Dropdown>
  );

  function getLanguage() {
    if (idioma === "en-US") {
      return require("../../images/US.jpg");
    } else if (idioma === "es-ES") {
      return require("../../images/ES.jpg");
    } else {
      return require("../../images/BR.jpeg");
    }
  }

  async function changeLanguage({ key }) {
    await api.setIdioma(key);
    await dispatch(ACOES.changeIdioma(key));
  }
}
