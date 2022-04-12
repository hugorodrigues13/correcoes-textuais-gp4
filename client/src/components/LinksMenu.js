import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import {Menu} from "antd";

function NavItemWithoutRouter({
  to,
  eventKey,
  children,
  onSelect,
  history,
  entity
}) {
  const handleLink = path => {
    history.push(path);
  };

  const permissoes = useSelector(
    state => state.sessaoReducer.data.permissoes,
    {}
  );

  const classMenu =
    children.props.id === "home.routes.configuracao" ||
    children.props.id === "home.routes.mapeamento"
      ? "inlineFlex"
      : "";

  const classDisabled =
    entity && permissoes && permissoes.indexOf(entity) === -1 ? "disabled" : "";

  return (
    <Menu.Item
      className={`${classMenu || ""} ${classDisabled}`}
      eventKey={eventKey}
      onSelect={onSelect}
      onClick={() => handleLink(to)}
    >
      {children}
    </Menu.Item>
  );
}

const RouterNavItem = withRouter(NavItemWithoutRouter);

export default RouterNavItem;
