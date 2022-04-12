import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
// import auth from "../utils/auth";
import React from "react";

export default function PrivateRoute({ path, component, entity }) {
  const permissoes = useSelector(
    state => state.sessaoReducer.data.permissoes,
    {}
  );

  return (
    <Route
      path={path}
      render={props =>
        permissoes && permissoes.indexOf(entity) > -1 ? (
          React.createElement(component, { ...props })
        ) : (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        )
      }
    />
  );
}
