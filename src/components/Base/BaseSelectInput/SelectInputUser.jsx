import { Select, Spin } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputUser = ({
  label,
  id,
  classNameDiv,
  important,
  defaultValue,
  onChange,
  onClick,
  options,
  placeholder,
  disabled,
  isFilter,
  formik,
  onFilter,
  checked,
  status,
  onBlur,
  loading,
  loadingApi,
  param,
}) => {
  const className = `selectDesign ${disabled ? "disable" : ""}`;
  // const roleArr = [];
  // for (let index = 0; index < options.length; index++) {
  //   const element = options[index];
  //   roleArr.push({
  //     value: type === "role" ? element.setting_id : element.value,
  //     label: type === "role" ? element.setting_value : element.label,
  //   });
  // }
  const filter = {
    field: "",
    value: "",
    condition: ConditionEnum.Equal,
  };

  return (
    <>
      <div className={classNameDiv}>
        <label htmlFor="input-placeholder" className="form-label">
          {label}
          {important === "true" ? (
            <span className="ms-1" style={{ color: "red" }}>
              *
            </span>
          ) : (
            ""
          )}
        </label>

        <Select
          showSearch
          className={className}
          defaultValue={defaultValue}
          value={checked}
          id={id}
          loading={loading}
          status={status}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => onClick(param)}
          onChange={(value, object) => {
            if (isFilter) {
              const newFilter = {
                ...filter,
                field: id,
                value: object.key,
              };
              onFilter(newFilter);
              onChange(value);
            } else {
              formik.setFieldValue(`${id}`, object.key);
              //   formik.setFieldValue(`${id}`, value);
            }
            // console.log(filter);
          }}
        >
          {loadingApi ? (
            <Option disabled>
              <Spin size="small" disabled />
            </Option>
          ) : (
            <>
              {isFilter === true && (
                <Option key="all" value="all">
                  All
                </Option>
              )}
              {options.map((option) => (
                <Option key={option.user_id} value={option.fullname}>
                  {option.fullname} ({option.email})
                </Option>
              ))}
            </>
          )}
        </Select>
      </div>
    </>
  );
};
