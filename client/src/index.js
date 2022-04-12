import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { boot } from "./boot";
import store from "./store";
import App from "./App";
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/css/bootstrap-theme.css";
import "react-customize-token-input/dist/react-customize-token-input.css";
import "react-s-alert/dist/s-alert-default.css";
// optional - you can choose the effect you want
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "react-s-alert/dist/s-alert-css-effects/scale.css";
import "react-s-alert/dist/s-alert-css-effects/bouncyflip.css";
import "react-s-alert/dist/s-alert-css-effects/flip.css";
import "react-s-alert/dist/s-alert-css-effects/genie.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";
import "react-s-alert/dist/s-alert-css-effects/stackslide.css";
import "react-datepicker/dist/react-datepicker.css";
//import "./css/index.css";

boot();
ReactDOM.render(

  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
  document.addEventListener("wheel", function(event){
    if(document.activeElement.type === "number"){
      document.activeElement.blur();
    }
  })
);

