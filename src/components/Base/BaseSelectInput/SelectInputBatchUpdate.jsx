import { Select } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputBatchUpdate = ({
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
  type,
  loading,
  isFilterBasic,
  batchUpdateType,
}) => {
  const selectInputOption = (type, option) => {
    let key = "";
    let value = "";
    switch (type) {
      case "issue_group":
        key = option.issue_setting_id;
        value = option.issue_value;
        break;
      case "class_student":
        key = option.student_id;
        value = option.student_name;
        break;
      case "milestone":
        key = option.milestone_id;
        value = option.milestone_name;
        break;
      default:
        key = undefined;
        value = undefined;
        break;
    }
    return { key: key, value: value };
  };

  const filter = {
    field: "",
    value: "",
    condition: ConditionEnum.Equal,
  };

  return (
    <>
      <div className={classNameDiv}>
        <label htmlFor="input-placeholder" className="form-label ">
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
          loading={loading}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(value, object) => {
            const newFilter = {
              ...filter,
              field: id,
              value: object.key,
            };
            if (isFilter) {
              onFilter(newFilter);
              onChange(value);
            } else if (isFilterBasic) {
              onFilter(newFilter, id);
              console.log(object.key);
            } else {
              // formik.setFieldValue(`subject_id`, object.key);
              formik.setFieldValue(`${id}`, object.key);
            }

            if (batchUpdateType !== "") {
              formik.setFieldValue(`${batchUpdateType}`, object.value);
            }
            // console.log(filter);
          }}
        >
          {isFilter || isFilterBasic ? (
            <Option key="all" value="all">
              All
            </Option>
          ) : (
            ""
          )}
          {options.map((option) => (
            <Option
              key={selectInputOption(type, option).key}
              value={selectInputOption(type, option).value}
            >
              {selectInputOption(type, option).value}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};
