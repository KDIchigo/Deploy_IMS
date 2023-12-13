import { Select } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputSettingGroup = ({
  label,
  classNameDiv,
  important,
  defaultValue,
  options,
  onChange,
  placeholder,
  disabled,
  id,
  isFilter,
  formik,
  onFilter,
  // handleCheckDomain,
  status,
  onBlur,
  checked,
  dataGroup,
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
  let valueDefault = "";
  switch (defaultValue) {
    case 1:
      valueDefault = "Role";
      break;
    case 2:
      valueDefault = "Semester";
      break;
    case 3:
      valueDefault = "Email Domain";
      break;
    default:
      valueDefault = undefined;
      break;
  }
  // console.log(dataGroup(1));

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
          defaultValue={dataGroup(defaultValue)}
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
              // handleCheckDomain(object.key);
            }
            // console.log(filter);
          }}
        >
          {isFilter === true ? (
            <Option key="all" value="all">
              All{" "}
            </Option>
          ) : (
            ""
          )}

          {options.map((option) => (
            <Option key={option.value} value={option.label}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};
