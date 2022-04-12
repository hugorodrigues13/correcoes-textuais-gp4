import React from "react";
import { ConfigProvider } from "antd";
import { addLocaleData, IntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import en from "react-intl/locale-data/en";
import pt from "react-intl/locale-data/pt";
import es from "react-intl/locale-data/es";
import Root from "./views/Root";
import { flattenMessages } from "./components/utils";
import messages from "./components/messages";
import pt_BR from "antd/es/locale/pt_BR";
import en_US from "antd/es/locale/en_US";
import es_ES from "antd/es/locale/es_ES";
import moment from "moment";
import "moment/locale/pt-br";
import "moment/locale/es-us";
import "moment/locale/es-do";
import GlobalStyles from "./styles/global";
import Spinner from "./components/Spinner";

addLocaleData([...en, ...pt, ...es]);
function App() {
  // Config locale
  const locale = useSelector(state => state.sessaoReducer.language) || "pt-BR";
  const org = useSelector(state => state.organizacao);
  const localeAnt =
    locale === "pt-BR"
      ? pt_BR
      : locale === "en-US"
      ? en_US
      : locale === "es-ES"
        ? es_ES
        : null;
  moment.locale(locale !== "es-ES" ? locale : "es-do");
  window.less.modifyVars({ "@primary-color": org.theme.primaryColor });
  window.less.refreshStyles();
  return (
    <IntlProvider locale={locale} messages={flattenMessages(messages[locale])}>
      <ConfigProvider locale={localeAnt}>
        <Spinner isSendingRequest={org.loading}/>
        <Root />
        <GlobalStyles theme={org.theme}/>
      </ConfigProvider>
    </IntlProvider>
  );
}

export default App;
