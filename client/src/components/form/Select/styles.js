export const customStyles = {
  control: (base, state) => ({
    ...base,
    height: "40px",
    "min-height": "40px",
    padding: "0px"
  }),
  indicatorsContainer: provided => ({
    ...provided,
    height: "40px",
    padding: "0px"
  }),
  multiValueLabel: (base, state) => ({
    ...base,
    margin: "0px",
    padding: "5px",
    display: "block",
    top: "10px"
  }),
  multiValue: (base, state) => ({
    ...base,
    margin: "2px",
    "margin-bottom": "8px"
  }),
  input: (base, state) => ({
    ...base,
    margin: 0,
    "margin-left": "5px",
    "margin-bottom": "2px"
  }),
  valueContainer: (base, state) => ({
    ...base,
    padding: "0px",
    "margin-left": "5px"
  }),
  placeholder: provided => ({
    ...provided,
    padding: "5px"
  })
};
