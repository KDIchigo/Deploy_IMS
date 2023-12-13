import React, { useState } from "react";
import { Radio } from "antd";
export const BaseRadio = ({
  classNameDiv,
  important,
  label,
  type,
  formik,
  feature,
  value,
  isLabel,
  disabled,
}) => {
  return (
    <>
      {isLabel ? (
        <label htmlFor="input-placeholder" className="form-label me-2">
          {label}
          {important === "true" ? (
            <span className="ms-1" style={{ color: "red" }}>
              *
            </span>
          ) : (
            ""
          )}
        </label>
      ) : (
        ""
      )}

      <div className="input-group">
        <Radio.Group disabled={disabled}
          onChange={(e) => {
            formik.setFieldValue(`${type}`, e.target.value);
          }}
          value={value}
        >
          {feature === "pending" ? (
            <>
              <Radio value={2}>Pending</Radio>
              <Radio value={1}>In Progress</Radio>
              <Radio value={0}>Closed</Radio>
            </>
          ) : feature === "class" ? (
            <>
              <Radio value={2}>Pending</Radio>
              <Radio value={1}>Started</Radio>
              <Radio value={0}>Cancelled</Radio>
            </>
          ) : (
            <>
              <Radio value={1}>Active</Radio>
              <Radio value={0}>Inactive</Radio>
            </>
          )}
        </Radio.Group>
      </div>
    </>
  );
};
