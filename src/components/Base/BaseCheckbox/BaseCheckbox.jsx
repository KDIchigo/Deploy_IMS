import React, { useState } from "react";
import { Checkbox, ConfigProvider } from "antd";
export const BaseCheckbox = ({ formik, type }) => {
  const [checked, setChecked] = useState(
    formik.values.status === 1 ? true : false
  );
  const onChange = () => {
    setChecked(!checked);
    formik.setFieldValue(`${type}`, !checked === true ? 1 : 0);
  };
  return (
    <Checkbox onChange={onChange} checked={checked}>
      {checked === true ? "Active" : "Inactive"}
    </Checkbox>
  );
};
