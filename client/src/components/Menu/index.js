import MenuItem from "./MenuItem";
import React, {useState} from "react";
import {CLIENT_URL} from "../../config";
import {
  UnorderedListOutlined,
  AuditOutlined,
  SettingOutlined,
  SafetyOutlined,
  UserOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import auth from "../../utils/auth";
import {logout} from "../../store/modules/Login/loginAction";
import {useDispatch, useSelector} from "react-redux";
import {setFornecedor, setOrganizacao} from "../../store/modules/Organizacao/action";
import styled from "styled-components";
import api from "../../services/api";
import {
  GiFactory,
  GiOrganigram,
  FcWorkflow,
  AiOutlineQrcode,
  FaQrcode,
  FaBarcode,
  AiOutlineBarcode
} from "react-icons/all";
import {SelectFilter} from "../form/SelectFilter";
import {Row, Col} from "antd";
import * as MENU from "../../views/mapToRoutes";
import history from "../../services/history";
import {acessoNaoHabilitadoPara, acessoNaoHabilitadoParaModulo, ItensModulo} from "./ItensModulo";

export default function MenuPrincipal() {
  const srcBrasil = require("../../images/BR.8ca6ba30.png");
  const srcUS = require("../../images/united-states-flag-icon-1.png");
  const srcES = require("../../images/spain-2906824_640.png");

  const dispatch = useDispatch()
  const {
    list: organizacoes,
    organizacao: idOrganizacao,
    fornecedores,
    fornecedor: idFornecedor
  } = useSelector(store => store.organizacao.data)
  const {language: locale} = useSelector(store => store.sessaoReducer)
  const [selectedModule, setSelectedModule] = useState('')

  const organizacao = organizacoes.find(org => Number(org.id) === Number(idOrganizacao)) || {}
  const fornecedor = fornecedores.find(forn => Number(forn.id) === Number(idFornecedor)) || {}
  const [showOrg, setShowOrg] = useState(false)

  const {permissoes} = useSelector(state => state.sessaoReducer.data);

  const getIconeIdioma = () => {
    if (locale === "en-US") {
      return require("../../images/US.jpg");
    } else if (locale === "es-ES") {
      return require("../../images/ES.jpg");
    } else {
      return require("../../images/BR.jpeg");
    }
  };

  const confirmLanguageSelection = (language) => {
    api.setIdioma(language);
    location.reload();
  }

  const modules = [{
    name: 'cad',
    label: 'cadastros',
    icon: <UnorderedListOutlined style={{color: "black"}}/>,
    showDropdown: true,
    selectable: true,
    unorder: true,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.CADASTROS, permissoes),
    options: ItensModulo.CADASTROS.map(c => ({
      link: `${CLIENT_URL}${c.link}`,
      label: c.label,
      disabled: acessoNaoHabilitadoPara([c.key], permissoes)
    }))
  }, {
    name: 'prod',
    link: CLIENT_URL + "/prod",
    label: 'producao',
    icon: <span role="img" aria-label="factory" className={`anticon anticon-factory menu-icon-enabled`}><GiFactory/> </span>,
    selectable: true,
    showDropdown: true,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.PRODUCAO, permissoes),
    unorder: true,
    options: ItensModulo.PRODUCAO.map(c => ({
      link: `${CLIENT_URL}${c.link}`,
      label: c.label,
      disabled: acessoNaoHabilitadoPara([c.key], permissoes)
    }))
  }, {
    name: 'apontamento',
    label: 'apontamento',
    link: CLIENT_URL + "/prod/apontamento",
    icon: <span role="img" aria-label="factory" className={`anticon anticon-qrcode menu-icon-enabled`}><AiOutlineBarcode /> </span>,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.APONTAMENTO, permissoes),
    selectable: true,
    onClick: (e) => {
      history.push( CLIENT_URL + "/prod/apontamento")
    }
  }, {
    name: 'prog',
    link: CLIENT_URL + "/prog",
    label: 'programacao',
    icon: <span role="img" aria-label="factory" className={`anticon anticon-factory menu-icon-enabled`}><FcWorkflow/> </span>,
    selectable: true,
    showDropdown: true,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.PROGRAMACAO, permissoes),
    unorder: true,
    options: ItensModulo.PROGRAMACAO.map(c => ({
      link: `${CLIENT_URL}${c.link}`,
      label: c.label,
      disabled: acessoNaoHabilitadoPara([c.key], permissoes)
    }))
  }, {
    name: 'rel',
    label: 'relatorios',
    link: CLIENT_URL + "/rel",
    icon: <span role="img" aria-label="factory" className={`anticon anticon-factory menu-icon-enabled`}><BarChartOutlined/></span>,
    selectable: true,
    showDropdown: true,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.RELATORIOS, permissoes),
    options: ItensModulo.RELATORIOS.map(c => ({
      link: `${CLIENT_URL}${c.link}`,
      label: c.label,
      disabled: acessoNaoHabilitadoPara([c.key], permissoes)
    }))
  }, {
    name: 'audit',
    label: 'auditoria',
    icon: <AuditOutlined style={{color: "black"}}/>,
    selectable: true,
    showDropdown: true,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.AUDITORIA, permissoes),
    options: ItensModulo.AUDITORIA.map(c => ({
      link: `${CLIENT_URL}${c.link}`,
      label: c.label,
      disabled: acessoNaoHabilitadoPara([c.key], permissoes)
    }))
  }, {
    name: 'config',
    label: 'configuracoes',
    selectable: true,
    showDropdown: true,
    icon: <SettingOutlined style={{color: "black"}}/>,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.CONFIGURACOES, permissoes),
    options: ItensModulo.CONFIGURACOES.map(c => ({
      link: `${CLIENT_URL}${c.link}`,
      label: c.label,
      disabled: acessoNaoHabilitadoPara([c.key], permissoes)
    }))
  }, {
    name: 'seg',
    label: 'seguranca',
    selectable: true,
    showDropdown: true,
    icon: <SafetyOutlined style={{color: "black"}}/>,
    disabled: acessoNaoHabilitadoParaModulo(ItensModulo.SEGURANCA, permissoes),
    options: ItensModulo.SEGURANCA.map(c => ({
      link: `${CLIENT_URL}${c.link}`,
      label: c.label,
      disabled: acessoNaoHabilitadoPara([c.key], permissoes)
    }))
  }]

  const more = [{
    name: 'per',
    customLabel: true,
    selectable: true,
    showDropdown: true,
    className: "pull-right icon-user",
    icon: <UserOutlined/>,
    options: [{label: "minhaConta", link: CLIENT_URL + "/seg/user/perfil"}, {
      onClick: () => {
        dispatch(logout())
      }, label: "sair"
    }]
  }, {
    name: 'ido',
    label: <ImgIdioma alt={"logo"} src={getIconeIdioma()}/>,
    customLabel: true,
    selectable: false,
    showDropdown: true,
    className: "pull-right",
    options: [
      {
        label: <ImgIdioma src={srcBrasil}/>, customLabel: true, onClick: () => confirmLanguageSelection("pt-BR")
      }, {
        label: <ImgIdioma src={srcES}/>, customLabel: true, onClick: () => confirmLanguageSelection("es-ES")
      }, {
        label: <ImgIdioma src={srcUS}/>, customLabel: true, onClick: () => confirmLanguageSelection("en-US")
      }
    ]
  }, {
    name: 'orgs',
    label: '',
    selectable: true,
    className: "pull-right orgs-menu",
    showDropdown: false,
    icon: <GiOrganigram size={"1.5em"}/>,
    onClick: (module) => {
      setSelectedModule(!showOrg ? module.name : "")
      setShowOrg(!showOrg)
    }
  }]

  return <div className={`menu-dropdown ${showOrg ? "class-select-menu" : ""}`}>
    {showOrg ?
      <Row gutter={24}>
        <Col span={6}>
          <SelectFilter
            placeholder={organizacao.descricao}
            list={organizacoes.map(org => {
              return {key: org.id, value: org.descricao}
            }) || []}
            size={"large"}
            nomeAtributo={"organizacoes"}
            onChange={e => dispatch(setOrganizacao(e))}
          />
        </Col>
        <Col span={9}>
          <SelectFilter
            placeholder={fornecedor.nome}
            list={fornecedores.map(forn => {
              return {key: forn.id, value: forn.nome, organizationId: forn.organizationId}
            }) || []}
            size={"large"}
            nomeAtributo={"fornecedores"}
            onChange={e => dispatch(setFornecedor(e))}
          />
        </Col>
        <Col span={9}>
          {more.map(m => <MenuItem key={m.name} module={m} selected={selectedModule} setSelected={setSelectedModule}/>)}
        </Col>
      </Row>
      : <>
        {modules.map(m => <MenuItem key={m.name} module={m} selected={selectedModule} setSelected={setSelectedModule}/>)}
        {more.map(m => <MenuItem key={m.name} module={m} selected={selectedModule} setSelected={setSelectedModule}/>)}
      </>
    }
    {!showOrg && <span className="fornecedor-organizacao">
      {fornecedor.nome} - {organizacao.descricao}
    </span>}
    <span className="nome-usuario">
      {auth.username()}
    </span>
  </div>
}

const ImgIdioma = styled.img`
  object-fit: cover;
  width: 30px;
  height: 25px;
  border: 4px solid white;

`;
