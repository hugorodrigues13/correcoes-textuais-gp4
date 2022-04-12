import React, { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";

import { customStyles } from "./styles";

export function FormSelect({ list, entity, placeholder, onChange }) {
  const [defaultValue, setDefaultValue] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(
      list.map(data => ({
        value: data.key,
        label: data.value
      })) || []
    );
  }, [list]);

  useEffect(() => {
    setDefaultValue(
      options.filter(data => (entity || []).indexOf(data.value) > -1)
    );
  }, [entity, options]);

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

FormSelect.propTypes = {
  placeholder: PropTypes.string,
  entity: PropTypes.arrayOf(PropTypes.number),
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      value: PropTypes.string
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired
};

FormSelect.defaultProps = {
  placeholder: "",
  entity: []
};
