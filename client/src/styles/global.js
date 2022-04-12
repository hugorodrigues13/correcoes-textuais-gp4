import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
html, body{
  height: 100%;
   scroll-behavior: smooth;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

  #sidebar-id{
    background: ${props => props.theme.primaryColor};
    z-index:9!important;
  }

  .logo {
    width: 120px;
    height: 31px;
    padding: 0 20px;
    float: left;
    margin-right: 65px;
  }

  .ant-layout-header {
    background: #ffffff !important;
    padding: 0 25px !important;
    line-height: 64px;
  }

  #header {
    position: fixed;
    width: 100%;
    z-index: 10;
    max-width: 100%;
    background: #fff;
    padding: 0 !important;
    height: 68px;
  }

  #header.scroll {
    box-shadow: 0px 0px 4px 0px;
  }

  .popupIdioma > .ant-menu {
    min-width: 0;
    border-radius: 0 0 25% 25% !important;
  }

  .popupIdioma > .ant-menu > .ant-menu-item {
    padding: 0 16px !important;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .conteudo {
    margin-top: 66px;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  #fixedbutton {
    position: fixed !important;
    left: 0px;
    z-index: 1 !important;
    top: 80px;
    transition: all 0.3s ease-out 0s;
    border-radius: 0 10px 10px 0;
    padding: 0;
    border: 0 !important;
  }

  #div-variaveis .ant-form-item {
    margin: 0 !important;
  }

  .divFormModalApontamento {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .divFormModalApontamento .ant-modal-mask,
  .divFormModalApontamento .ant-modal-wrap {
  position: absolute;
}

@media only screen and (max-width: 1280px) {
  .divFormModalApontamento .ant-modal-mask,
  .divFormModalApontamento .ant-modal-wrap {
    top: 66px;
  }
}

  .ant-menu.ant-menu-dark.ant-menu-root.ant-menu-inline {
    margin-top: 8px !important;
    border-radius: 8px;
    width: 85%;
    text-transform: uppercase;
    color: white;
    background-color:${props => props.theme.primaryColor};
  }

  li.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open {
    border: 1px solid ${props => props.theme.secondaryColor};
    border-radius: 7px;
  }

  .ant-menu-sub span{
    padding-left: 16px !important;
  }

  .ant-menu.ant-menu-sub.ant-menu-inline {
    // background-color: ${props => props.theme.primaryColor}!important;
    box-shadow: none !important;
  }

  .ant-menu-item {
    padding-left: 24px !important;
    text-align: left !important;
    text-transform: capitalize;
    border-radius: 7px;
  }

  .ant-menu.ant-menu-sub.ant-menu-inline > li {
    color: #fffffff5;
    border-radius: 7px;
    height: 50px !important;
    padding: 6px;
  }

  .ant-menu.ant-menu-sub.ant-menu-inline > li.ant-menu-item-active {
    background-color: ${props => props.theme.secondaryColor};
    border-radius: 7px;
    color: #ffffff;
  }
  .ant-menu.ant-menu-sub.ant-menu-inline > li.ant-menu-item-selected {
    background-color: ${props => props.theme.secondaryColor};
    border-radius: 7px;
    color: white !important;
  }

  .menu-divider {
    margin: 13px 0 13px 0 !important;
    width: 90% !important;
    min-width: 90% !important;
  }

  /*SCROLL*/

  ::-webkit-scrollbar {
    width: 10px;
    z-index: 2 !important;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.65);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgba(81, 86, 93, 0.55);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(81, 86, 93, 0.89);
  }

  #menu-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .menuIdioma li:hover {
    background: none;
  }

  /* FOOTER */
  .menu-footer {
    position: sticky;
    left: 0;
    bottom: 0;
    height: 55px;
    width: 100%;
    color: white;
    text-align: center;
    background-color: ${props => props.theme.secondaryColor};
  }

  .button-footer {
    background-color:${props => props.theme.secondaryColor}!important;
    border-color:${props => props.theme.secondaryColor}!important;
    width: 30% !important;
    height: 55px !important;
  }

  /*OVERLAY*/

  #overlay{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1040;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }


  .scrooll-personalizado{
    right: auto !important;
    >div:nth-child(1){
      position: fixed !important;
      &::-webkit-scrollbar{
        width: 6px !important;
      }

      &::-webkit-scrollbar-track {
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
      }
    }
  }

  #orgs{
    transition: 0.3s;
    align-items: center
  }

  #button-org{
    color:white;
    font-weight:600;
    transition: 0.3s;
  }

  #orgs #button-org:hover {
    background-color: ${props => props.theme.secondaryColor};
  }

  // .dropdown-selector{
  //   align-items: center;
  //   border-bottom-right-radius: 40px;
  //   width: 55px;
  //   height: 150px;
  //   margin-top:-90px;
  //   margin-right: 27px;
  //   display: flex;
  //   border-bottom-left-radius: 40px;
  //   font-weight: 600;
  //   flex-direction: column;
  //   padding-top:15px;
  //   box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08);
  // }

  #org-selector{
    background-color: ${props => props.theme.primaryColor};
    color:white;
  }

  #org-selector:hover #orgs {
    display: flex;
    flex-direction: column;
    transition: 0.3s;
  }

  #org-selected{
    display: flex;
    flex-direction: column;
    align-items: center
  }

  #org-selector:hover #org-selected{
    margin-top: 0;
  }

  #orgs .ant-divider-horizontal{
    margin: 8px 0;
  }

  #orgs span{
    display: flex;
    flex-direction: column;
  }

  #flag-selector{
    height:170px!important;
    background-color:white;
    margin-top:-110px!important;
  }

  #flag-selector:hover{
    margin-top:-16px!important;
  }

  #flag-selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top:2px;
  }

  #flags{
    display: flex;
    flex-direction: column;
  }

  #flags button{
    margin-bottom: 16px;
  }

  .s-alert-box.s-alert-success.s-alert-top-right.s-alert-show{
    z-index: 1100;
  }

  .s-alert-box.s-alert-error.s-alert-top-right.s-alert-show{
    z-index: 1100;
  }

  .s-alert-box.s-alert-warning.s-alert-top-right.s-alert-show{
    z-index: 1100;
  }

  .titulo-sessao.theme{
    background-color: ${props => props.theme.fadeTen};
    padding: 16px 24px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 18px;
    margin-top:64px;
  }

  .titulo-sessao{
    background-color: #fafafa ;
    padding: 16px 24px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 18px;
    margin-top: 32px;
  }

    @font-face{
      font-family: 'Roboto';
      src: url('/fonts') format('truetype'),
      src: url('/fonts');
    }

    body{
      font-family: 'Roboto', sans-serif !important;
    }

    .ant-page-header{
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
      background-color: #f3f3f3 !important;
    }

    .row-selected-remove td:first-child{
      border-left: solid 4px red !important;
    }

    table .ant-btn-icon-only{
    color: #818181 !important;
    font-size: 18px !important;
    }

    table .ant-btn-icon-only:hover{
    background-color: ${props => props.theme.primaryColor}38 !important;
    color: ${props => props.theme.primaryColor} !important;
    }

    table .danger:hover{
      color: #ff4d4f !important;
      background-color: #ff4d4f38 !important;
    }

    table .defaultInativo:hover{
      background-color: #ff4d4f38 !important;
      color: #ff4d4f !important;
    }

    table .defaultAtivo:hover{
      background-color: #1D9D0F38 !important;
      color: #1D9D0F !important;
    }

    table tr:nth-child(2n) td:not(.sem-stripe) {
      background-color: #F9F9F9;
    }

    .ant-btn-link[disabled]{
      color: #D6D6D6 !important;
    }

    ul.ant-menu.ant-menu-dark.ant-menu-root.ant-menu-inline span{
    font-size: 16px;
    letter-spacing: 0.5px
  }

  .ant-pagination-item, .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link{
    border: none !important;
  }

  .ant-pagination-item-active{
    background-color: ${props => props.theme.primaryColor} !important;
  }

  .ant-pagination-item-active a{
    color: #fff !important;
  }

   .ant-pagination-item-link:hover{
    background-color: ${props => props.theme.primaryColor}38 !important;
  }

  .ant-pagination-item:hover{
    background-color: ${props => props.theme.primaryColor}38 !important;
  }

  .ant-pagination-disabled .ant-pagination-item-link{
    background-color: #fff !important;
  }

  .ant-page-header-back-button:not(.page-header-ignored-button){
    padding: 8px !important;
    margin-top: -8px;
    border-radius: 24px;
    &:hover {
      background-color: ${props => props.theme.primaryColor}12 !important;
      transition: 0.3s;
    }
  }

   .ant-page-header-heading-extra button:not(.page-header-ignored-button){
     background-color: #fff !important;
     color: ${props => props.theme.primaryColor};
     border: solid 2px;
     font-weight: 500;
     height: 40px;
     box-shadow: none !important;
     &:hover {
       background-color: ${props => props.theme.primaryColor} !important;
       border: solid 2px;
       color: #fff;
       box-shadow: none !important;
     }
   }

   .ant-input-number-lg{
    width: auto;
  }

  // ICON menu hamburguer
    .hamburguer {
        position: relative;
        border-radius: 2px;
        display: block;
        background: #fff;
        width: 25px;
        height: 3px;
        transition: .3s ease-in-out;
    }

    .hamburguer:before,
    .hamburguer:after {
        background: #fff;
        border-radius: 2px;
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        transition: .3s ease-in-out;
    }

    .hamburguer:before {
        top: -8px;
    }

    .hamburguer:after {
        bottom: -8px;
    }

    #menu-hamburguer {
        display: none;
    }

    .menu{
    padding: 18px 12px;
    border: 3px;
    cursor: pointer;
    }

    #menu-hamburguer:checked ~ label .hamburguer {
        transform: rotate(45deg);
    }

    #menu-hamburguer:checked ~ label .hamburguer:before {
        transform: rotate(90deg);
        top: 0;
    }

    #menu-hamburguer:checked ~ label .hamburguer:after {
        transform: rotate(90deg);
        bottom: 0;
    }

    .ant-input-number{
      width: auto !important;
    }

//    Footer

.conteudoTotal{
    min-height: calc(100vh - 120px);
    position: relative;
    padding-bottom: 32px;
    margin-bottom: 32px;
}
.footer{
  position: fixed;
  width: 100%;
  padding: 16px 48px;
  bottom:0;
  left: 0;
  text-align: center;
  border-top: solid 1px #e3e5e6
  background: #fff;
}
.footer .small {
  color: #818181;
}

.footer div:nth-child(2){
  text-align: center;
}

.footer div:nth-child(3){
  text-align: right;
}

//.ant-input-number-handler-wrap{
//  display: none;
//}

.backToTop{
  background-color: ${props => props.theme.primaryColor};
  position: fixed;
  bottom: 64px;
  right: 12px;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 3px 6px #ccc;
  animation: slide-in 0.5s 1 forwards;
  color: #fff;
  padding: 8px 12px;
  font-size: 20px;
}

.backToTopNone{
  background-color: ${props => props.theme.primaryColor};
  position: fixed;
  bottom: -48px;
  right: 12px;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 3px 6px #ccc;
  animation: slide-out 0.5s 1;
  color: #fff;
  padding: 8px 12px;
  font-size: 20px;
}

@keyframes slide-in {
  0%   {bottom: 0px;}
}

@keyframes slide-out {
  0%   {bottom: 64px;}
}

// Página 404
.erro_404{
  max-width: 100%;
}

// Página 500
.botao_erro_500{
  text-align: center;
  background-color: #E64949 !important;
  font-size: 24px !important;
  color: #fff !important;
  padding: 16px 32px !important;
  height: auto !important;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.ant-btn-background-ghost.ant-btn-primary{
  border-width: 2px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.ant-input-number.ant-input-number-lg{
  width: 100% !important;
}

.ant-input-number{
  width: 100% !important;
}

.removeOverflowX .ant-table-body{
  overflow-x: hidden !important;
  // min-height: inherit;
  min-height: 258px;
}

.removeOverflowX .ant-table-scroll{
min-height: inherit;
// min-height: 258px;
}

// .removeOverflowX  .ant-table-placeholder{
//   top: 30%;
//   left: 32%
//   position: absolute;
// }

/* width */
.removeOverflowX .ant-table-body::-webkit-scrollbar {
  width: 5px !important;
}

/* Handle */
.removeOverflowX .ant-table-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px !important;
}

/* Handle on hover */
.removeOverflowX .ant-table-body::-webkit-scrollbar-thumb:hover {
  background: #555;
  border-radius: 4px !important;
}

.removeOverflowX .botaoDrag{
 position: relative !important;
}

input#filter_codigo{
//   text-transform: uppercase;
}

.switchSeqCores{
  margin: 0 !important;
}

.switchSeqCores .ant-form-item-label{
  float: left;
  margin-right: 16px;
}

.border-bottom {
  border-bottom: 1px solid #dee2e6!important;
}

.mb-1 {
  margin-bottom: 1em;
}

.collapse-dados-modificados > div > div > .ant-collapse-content-box {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: none;
}

.collapse-dados-modificados > div > .ant-collapse-content-active {
  border: none;
}

.collapse-dados-modificados > div > .ant-collapse-header {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.pt-0 {
  padding-top: 0 !important;
}

.b-none {
  border: none !important;
}

.bg-white {
  background-color: #FFF !important;
}

.m-0 {
  margin: 0 !important;
}

.f-small {
  font-size: small !important;
}

.f-medium {
  font-size: medium;
}

.capitalize {
  text-transform: capitalize;
}

.ant-modal.modal-dados-modificados {
    width: 39em !important;
}


 //style documentacao
.divPrincipal strong{
  font-size: 15px;
  font-weight: 500;
  color: #8f8f8f;
}

.divPrincipal label{
  font-size: 14px;
  font-weight: 600;
}

.divPrincipal p{
  font-size: 14px;
  font-weight: 500;
}

.panelStyle .ant-collapse-header {
  background: #E9FFE6;
  border: 0.5px solid #81D673;
}

.panelStyle .ant-collapse-content-box {
  border: 0.5px solid #81D673;
}

.panelStyle .ant-btn {
  background: #7AD66B;
  color: #fff;
  border-color: #7AD66B;
  transition: none;
  font-weight: 700;
}

.panelStyle .ant-btn:hover {
  background: #7AD66B;
  color: #fff;
  border-color: #7AD66B;
  font-weight: 700;
}

.panelStyle .ant-btn:focus {
  background: #7AD66B;
  color: #fff;
  border-color: #7AD66B;
  font-weight: 700;
}

.inputCopy .ant-input[disabled] {
  color: #666;
}

.inputCopy .ant-input-group-addon {
  background: #7AD66B;
  color: #fff;
  font-weight: 700;
}

.divParametros {
  margin-top: -15px;
  width: 100%;
  height: 450px;
  color: #FFF;
  padding: 20px;
  border: 2px solid #CCC;
  border-radius: 5px;
}

.divParametros p {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.divParametros label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  padding: 2px 5px;
  margin-right: 15px;
}

.inputParametro {
  font-style: italic;
  border: none;
  color: #666;
  width: 110px;
  font-size: 14px;
  margin-left: 5px;
  cursor: pointer;
}

.labelRequerido {
  border: 1px solid #F5BDBD;
  border-radius: 3px;
}

.labelOpcional {
 border: 1px solid #64B2BF;
 border-radius: 3px;
}

.divParametros strong {
  font-style: italic;
}

.divParametros .ant-btn {
  background: #fff;
  color: #fff;
  border-color: #ccc;
  transition: none;
  border: none;
}

.divParametros .ant-btn:hover {
  background: #fff;
  color: #fff;
  border-color: none;
  font-weight: 700;
}

.divParametros .ant-btn:focus {
  background: #fff;
  color: #fff;
  border-color: none;
  font-weight: 700;
}

.divRespostas {
  margin-top: -15px;
  width: 100%;
  height: 810px;
  color: #FFF;
  padding: 20px;
  border: 2px solid #CCC;
  border-radius: 5px;
}

.divRespostas label{
  color: #949494;
}

.divRespostas p {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.collapseResposta .ant-collapse-header {
  background: #fff;
  border: none;
}

.collapseResposta .ant-collapse-content-box {
  background: #4b4b4b;
  border: none;
}

.collapseResposta p {
  color: #E0CA04;
}

.collapse-engrenagens {
  border: none !important;
}

.collapse-engrenagens > .ant-collapse-item {
  padding: 0 !important;
}

.collapse-engrenagens > div > .ant-collapse-content,
.collapse-engrenagens > .ant-collapse-item {
  border: none !important;
}

.collapse-engrenagens > div > .ant-collapse-header {
  padding: 1em !important;
}

.collapse-engrenagens > div > div > .ant-collapse-content-box {
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.ant-input-number-input.has-error {
    border: 1px solid #f5222d;
}

.ant-input-number-input.has-error {
    border: 1px solid #f5222d;
}

#div-maquinas .ant-form-item {
  margin: 0 !important;
}

.d-none {
    display: none;
}

.ant-input-number-input.has-error + div {
    display: block !important;
}

.align-right {
  float: right;
}

.align-left {
  float: left;
}

.menu-dropdown > .ant-dropdown-link {
  padding: 15px 10px;
  color: #000;
}

.menu-dropdown .fornecedor-organizacao {
  position: absolute;
  right: 8px;
  top: 5px;
  font-size: 9px;
  line-height: 10px;
  text-transform: uppercase;
}

.menu-dropdown .nome-usuario {
  position: absolute;
  right: 8px;
  bottom: 12px;
  font-size: 12px;
  line-height: 10px;
}

@media only screen and (max-width: 1300px) {
  .label-module  {
    cursor: pointer;
    display: none;
  }

  .menu-dropdown > .ant-dropdown-link:hover .label-module{
     transition: all .2s linear;
     display: inline
  }
}

.menu-dropdown > .pull-right {
  padding: 0 10px;
  color: #000;
}

.menu-dropdown > .selected-module {
 border-bottom: 2px solid ${props => props.theme.primaryColor};
}

.menu-dropdown > .selected-module > .label-module {
 display: inline;
}

.menu-dropdown > a > .menu-icon-enabled > svg > rect,
.menu-dropdown > a > .menu-icon-enabled > svg > polygon,
.menu-dropdown > a > .menu-icon-enabled > svg > path,
.menu-dropdown > a > .menu-icon-enabled > svg > circle,
.menu-dropdown > a > .menu-icon-enabled > svg > g {
  fill: #000;
}

.menu-dropdown > a > .menu-icon-disabled > svg > rect,
.menu-dropdown > a > .menu-icon-disabled > svg > polygon,
.menu-dropdown > a > .menu-icon-disabled > svg > path,
.menu-dropdown > a > .menu-icon-disabled > svg > circle,
.menu-dropdown > a > .menu-icon-disabled > svg > g {
  fill: #CCC;
}

.text-center {
  text-align: center;
}

.orgs-menu {
  padding: 5px 15px!important;
}

.class-select-menu .ant-form-item .ant-select, .class-select-menu .ant-form-item .ant-cascader-picker {
  width: 100%;

}

.class-select-menu .ant-form-item {
 line-height: 4.5;
}

.class-select-menu .ant-select-selection-placeholder{
  color: #000;
}

.icon-user {
  padding: 0 0 0 10px;
  color: #000 !important;
}

.largura-maxima {
  width: 95%;
}

.asaichi {
 width: 100% !important;
}

.table-header-row {
  margin-bottom: 10px;
}

.module.disabled {
  color: #CCC;
}

.ant-picker {
    width: 100% !important;
}
`;

function setCssSelectAnt(target) {
  let ariaControls = target.getAttribute('aria-controls');
  ariaControls = document.getElementById(ariaControls);

  if(ariaControls) {
      let style = target.getAttribute('data-style-options').split(';');
      style.push(`min-width: ${target.offsetWidth}px`);
      style.map(prop => {
          let data = prop.split(':');
          ariaControls.parentElement.style[data[0].trim()] = data[1];
      });
  } else {
      setTimeout(() => {
          setCssSelectAnt(target);
      }, 100);
  }
}

document.addEventListener('click', function (event) {
  if (event.target.closest('[data-style-options]')) {
    setCssSelectAnt(event.target.closest('[data-style-options]'));
  }
}, false);


document.addEventListener("scroll", function () {
  const element = document.getElementById("header")
  if(element) {
    if ( window.scrollY > 40) {
      element.classList.add("scroll");
    } else {
      element.classList.remove("scroll");
    }
  }
})
