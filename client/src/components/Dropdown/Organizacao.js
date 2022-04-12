import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Dropdown, Button, Divider } from "antd";
import {
  setOrganizacao,
  listRequest
} from "../../store/modules/Organizacao/action";

export function DropdownOrganizacao() {
  const dispatch = useDispatch();

  const list = useSelector(state => state.organizacao.data.list || []);
  const quantidade = list.length === 0;

  useEffect(() => {
    if (list.length === 0) {
      dispatch(listRequest());
    }
  }, [quantidade]);

  const entidade = useSelector(
    state => state.organizacao.data.organizacao || ""
  );
  const organizacao = list.filter(org => Number(org.id) === Number(entidade));

  const orgs = (
    <div id="orgs">
      {list.map(
        org =>
          Number(org.id) !== Number(entidade) && (
            <span key={org.id}>
              <Button
                onClick={() => handleMenuClick(org.id)}
                size="small"
                id="button-org"
                type="link"
              >
                {org.descricao}
              </Button>
              <Divider />
            </span>
          )
      )}
    </div>
  );

  return (
    <div id="components-dropdown-demo-dropdown-button">
      <div type="primary" className="dropdown-selector" id="org-selector">
        {orgs}
        <div id="org-selected">
          <Button size="small" id="button-org" type="link">
            {organizacao && organizacao.length ? organizacao[0].descricao : ""}{" "}
          </Button>
          <span style={{ height: 0, marginTop: -14 }}>
            <Icone className="jbic-down" />
          </span>
        </div>
      </div>
    </div>
  );

  function handleMenuClick(key) {
    dispatch(setOrganizacao(key));
  }
}
