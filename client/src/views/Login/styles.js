import styled from "styled-components";

export const Container = styled.div`

  display: grid;
  grid-row-gap: 10px;
  align-items: center;
  justify-content: center;

  font: 14px Roboto, sans-serif;

  width: 100%;
  height: 100vh;
  background-size: cover;

  -webkit-font-smoothing: antialiased;
  opacity: 1;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

export const WrapperLogin = styled.div`
  .logLogin > img {
    width: 420px;
  }

  .left {
    flex-direction: column;
    width: 200px;
    height: 466px;
    background: #ec3348 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 8px #00000029;
    border-radius: 12px;
    opacity: 1;
    margin: auto 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .loading {
      position: relative;
      top: 142px;
    }
  }

  #components-dropdown-demo-dropdown-button .ant-dropdown-button {
      margin: 0 8px 8px 0;
  }

  .right {
    width: 200px;
    height: 474px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: -3px 3px 8px #00000029;
    border-radius: 12px;
    opacity: 1;
    margin-left: -17px;
  }

  .title {
    width: 198px;
    height: 37px;
    text-align: center;
    font-size: 28px;
    letter-spacing: 0;
    color: #ec3348;
    opacity: 1;
    margin: 0 auto;
    margin-top: 24px;
    display: flex;

    text-align: center;
    align-items: center;
    justify-content: center;
  }

  .ant-form-item {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 20px;
    margin-left: 0px;
  }

  .ant-select-selection__rendered {
    position: relative;
    display: block;
    margin-right: 11px;
    margin-left: 11px !important;
    line-height: 30px;
  }

  .login {
    margin-top: 43px;
    margin-left: 32px;
    margin-right: 32px;
    input {
      height: 50px;
    }

    .ant-select-selection--single {
      height: 50px;
      display: flex;
      align-items: center;
    }

    .ant-input-prefix {
      margin-left: 13px;
    }

    .ant-input-affix-wrapper .ant-input:not(:first-child) {
      padding-left: 56px;
    }

    #components-dropdown-demo-dropdown-button .ant-dropdown-button {
      margin: 0 8px 8px 0;
    }

    .ant-col-12 {
      button {
        height: 50px;
        width: 100%;
        color: rgba(0, 0, 0, 0.25);

        img {
          float: left;
          width: 49px;
        }

        span {
          margin-top: 22px;
          margin-left: 55px;
        }
      }
    }

    .login-form-button {
      width: 105px;
      height: 48px;
      float: right;
      background: #e64949 0% 0% no-repeat padding-box;
      box-shadow: 0px 3px 6px #4f49e642;
      border-radius: 4px;
      border-color: #e64949;
      opacity: 1;
      font-size: 16px;
      &:hover {
        background: #e64938 0% 0% no-repeat padding-box;
      }
    }

    .esqueceuSenha {
      float: right;
      margin-top: 3px;
      width: 133px;
      color: #e64949;
      font-size: 14px;
      cursor: pointer;
    }

    .ant-select-selection-selected-value {
      margin-left: 14px;
    }
  }
`;
