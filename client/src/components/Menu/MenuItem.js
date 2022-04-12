import React from "react";
import {DownOutlined, UnorderedListOutlined} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { getMessage } from "../messages";
import {useDispatch, useSelector} from "react-redux";
import {menuItemRequest, menuSetURLPath} from "../../store/modules/MenuItem/action";
import history from "../../services/history";

function orderOptions(options) {
  let newOrder = options.sort(function (a, b) {
    a = `menu.${a.label}.label`
    b = `menu.${b.label}.label`
    if (getMessage(a) > getMessage(b)) return 1;
    if (getMessage(a) < getMessage(b)) return -1;
    return 0;
  })
  return newOrder;
}

export default function MenuItem({ module }) {

  const dispatch = useDispatch();

  function handleSelectModule(module) {
    dispatch(menuItemRequest(module.name));
    if(module.link) {
      dispatch(menuSetURLPath(module.link));
      history.push(module.link)
    }
  }

  function handleSelectItem(item) {
    if (item === '/prod/apontamento') handleSelectModule({name: 'apontamento'})
    dispatch(menuSetURLPath(item))
  }

  const {module: selectedModule, item: selectedItem} = useSelector(store => store.menuItem)

  const menu = module.showDropdown ? <Menu>
    {
      ((module.unorder ? module.options : orderOptions(module.options)).map((o, i) => {
        const item = o.link ? <Link to={o.link}  style={{color: "black"}}><FormattedMessage id={`menu.${o.label}.label`}/></Link> :
          <FormattedMessage id={`menu.${o.label}.label`} />

        return !o.disabled && <Menu.Item key={i} onClick={() => {
            if(!o.onClick) {
              handleSelectItem(o.link)
            } else {
              return o.onClick()
            }
        }}>{o.customLabel ? o.label : item}</Menu.Item>
      }))
    }
  </Menu> : null

  if(module.showDropdown) {
    return !module.disabled && <Dropdown
                     className={
                       module.name === selectedModule ?
                           `selected-module ${module.className}` :
                           `module ${module.className}`
                     }
                     trigger={['click']} overlay={menu}
                     onClick={() => module.selectable && handleSelectModule(module)}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {module.icon} {module.customLabel ? module.label :

          <span className={`label-module`} >
              <FormattedMessage id={`menu.${module.label}.label`} />
            </span>} {
        <DownOutlined />} </a>
    </Dropdown >
  } else {
    return !module.disabled &&
      <a className={`ant-dropdown-link ${module.name === selectedModule ? "selected-module " + module.className : module.className}`}
      onClick={e => {
        e.preventDefault();
        module.onClick(module);
        module.selectable && handleSelectModule(module)
      }}>
      {module.icon}
      &nbsp;
      <span className={`label-module ${module.disabled ? 'disabled' : ''}`}>
        {module.label && <FormattedMessage id={`menu.${module.label}.label`}/>}
      </span>
    </a>
  }
}
