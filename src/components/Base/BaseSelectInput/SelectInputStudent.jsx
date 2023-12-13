import { Select } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputStudent = ({
  label,
  id,
  classNameDiv,
  important,
  defaultValue,
  onChange,
  options,
  placeholder,
  disabled,
  isFilter,
  formik,
  onFilter,
  checked,
  status,
  onBlur,
}) => {
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
          className="selectDesign"
          defaultValue={defaultValue}
          value={checked}
          id={id}
          status={status}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
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
          {isFilter === true ? (
            <Option key="all" value="all">
              All
            </Option>
          ) : (
            ""
          )}
          {options.map((option) => (
            <Option key={option.student_id} value={option.student_name}>
              {option.student_name}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};
