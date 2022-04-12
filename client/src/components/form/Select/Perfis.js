import React, { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";

import { customStyles } from "./styles";

export function SelectPerfis({ perfis, entityPerfil, placeholder, onChange }) {
  const [defaultValue, setDefaultValue] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(
      perfis.map(perfil => ({
        value: perfil.key,
        label: perfil.value
      })) || []
    );
  }, [perfis]);

  useEffect(() => {
    setDefaultValue(
      options.filter(perfil => (entityPerfil || []).indexOf(perfil.value) > -1)
    );
  }, [entityPerfil, options]);

  const onChangeLocal = data => {
    onChange(data);
  };

  return (
    <Select
      isMulti
      value={defaultValue}
      name="colors"
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      styles={customStyles}
      onChange={onChangeLocal}
      placeholder={placeholder}
    />
  );
}

SelectPerfis.propTypes = {
  placeholder: PropTypes.string,
  entityPerfil: PropTypes.arrayOf(PropTypes.number),
  perfis: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      value: PropTypes.string
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired
};

SelectPerfis.defaultProps = {
  placeholder: "",
  entityPerfil: []
};
