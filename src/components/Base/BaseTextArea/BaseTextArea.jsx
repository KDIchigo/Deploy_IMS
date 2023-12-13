import React from "react";
import { Input } from "antd";
const { TextArea } = Input;
export const BaseTextArea = ({
  classNameDiv,
  label,
  important,
  placeholder,
  formik,
  type,
  row,
  style,
  disabled,
}) => {
  return (
    <>
      <div className={classNameDiv}>
        <label htmlFor="input-placeholder" className="form-label mt-1 me-2">
          {label}
          {important === "true" ? (
            <span className="ms-1" style={{ color: "red" }}>
              *
            </span>
          ) : (
            ""
          )}
        </label>
        <TextArea
          rows={row}
          placeholder={placeholder}
          disabled={disabled}
          style={style}
          className={disabled ? 'disable' : ''}
          value={
            type === "user" ? formik.values.note : formik.values.description
          }
          onChange={(e) => {
            {
              type === "user"
                ? formik.setFieldValue("note", e.target.value)
                : formik.setFieldValue("description", e.target.value);
            }
          }}
        />
      </div>
    </>
  );
};
