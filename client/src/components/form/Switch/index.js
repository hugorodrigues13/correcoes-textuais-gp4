import React from "react";
import { Form, Switch } from "antd";
import PropTypes from "prop-types";

export function SwitchAnt({ nomeAtributo, value, label, className, disabled, onChange, checkedChildren, unCheckedChildren, initialValue, semFormItem  }) {
  function renderSwitch(){
    return (
      <Switch disabled={ disabled } checked={value} onChange={onChange} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren}/>
    )
  }
  return (
    semFormItem
      ? renderSwitch()
      : <Form.Item label={label} name={nomeAtributo} className={className} valuePropName={"checked"} initialValue={initialValue}>
        {renderSwitch()}
    </Form.Item>
  );
}

SwitchAnt.propTypes = {
  label: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  checkedChildren: PropTypes.string,
  unCheckedChildren: PropTypes.string,
  initialValue:PropTypes.bool
};

SwitchAnt.defaultProps = {
  size: "large",
  onChange: null,
  checkedChildren:null,
  unCheckedChildren:null,
  initialValue:false
};
