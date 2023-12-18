import { UserOutlined } from "@ant-design/icons";
import { Avatar, Select, Spin } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputAssignee = ({
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
  loadingApi,
  onClick,
  param,
  isFilterBasic,
  isLabel,
}) => {
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
          onClick={() => onClick(param)}
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
          {loadingApi ? (
            <Option key="loading" disabled>
              <Spin size="small" disabled />
            </Option>
          ) : (
            <>
              {(isFilter || isFilterBasic) && isFilterIssue === undefined && (
                <Option key="all" value="all">
                  All
                </Option>
              )}
              {options.map((option) => (
                <Option
                  key={option.student_id}
                  value={option.student_name}
                  // style={{ height: "50px" }}
                >
                  <div className="row">
                    <div className="col-2">
                      <Avatar
                        className="me-1"
                        shape="circle"
                        size="small"
                        icon={<UserOutlined size={20} />}
                        src={option?.student_avatar}
                      />
                    </div>
                    <div className="col-10">{option.student_name}</div>
                  </div>
                </Option>
              ))}
            </>
          )}
        </Select>
      </div>
    </>
  );
};
