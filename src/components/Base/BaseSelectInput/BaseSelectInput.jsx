import { Select } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
const { Option } = Select;

export const BaseSelectInput = ({
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
  isFilterIssue,
  formik,
  onFilter,
  checked,
  status,
  onBlur,
  type,
  loading,
  isFilterBasic,
  isLabel,
}) => {
  const selectInputOption = (type, option) => {
    let key = "";
    let value = "";
    switch (type) {
      case "class":
        key = option.class_id;
        value = option.class_code;
        break;
      case "issue_group":
        key = option.issue_setting_id;
        value = option.issue_value;
        break;
      case "project":
        key = option.project_id;
        value = `${option.group_name} (${option.project_code})`;
        break;
      case "setting":
        key = option.setting_id;
        value = option.setting_value;
        break;
      case "setting_group":
        key = option.setting_id;
        value = option.data_group;
        break;
      case "subject":
        key = option.subject_id;
        value = option.subject_code;
        break;
      case "user":
        key = option.user_id;
        value = option.fullname;
        break;
      case "class_student":
        key = option.student_id;
        value = option.student_name;
        break;
      case "milestone_details":
        key = option.milestone_details_id;
        value = option.assignment_name;
        break;
      case "issue":
        key = option.issue_id;
        value = option.issue_title;
        break;
      case "assignee":
        key = option.assignee;
        value = option.assignee_name;
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
  const className = `selectDesign ${disabled ? "disable" : ""}`;
  return (
    <>
      <div className={classNameDiv}>
        {isLabel === false ? (
          ""
        ) : (
          <label htmlFor="input-placeholder" className="form-label ">
            {label}
            {important === "true" && (
              <span className="ms-1" style={{ color: "red" }}>
                *
              </span>
            )}
          </label>
        )}

        <Select
          showSearch
          className={className}
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
              // console.log(object.key);
            } else {
              // formik.setFieldValue(`subject_id`, object.key);
              formik.setFieldValue(`${id}`, object.key);
            }
            // console.log(filter);
          }}
        >
          {(isFilter || isFilterBasic) && isFilterIssue === undefined && (
            <Option key="all" value="all">
              All
            </Option>
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
