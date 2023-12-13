import React, { useState } from "react";
import { Select, Space } from "antd";

export const SelectInputAssignees = ({
  label,
  id,
  classNameDiv,
  important,
  defaultValue,
  onChange,
  students,
  placeholder,
  disabled,
  formik,
  checked,
  status,
  onBlur,
  loading,
  value,
  handleAssigneeValue,
}) => {
  const className = `selectDesign ${disabled ? "" : ""}`;
  // const [value, setValue] = useState([]);
  const options = [];
  students.map((student) => {
    options.push({
      label: student.student_name,
      value: JSON.stringify({
        email: student.student_email,
        user_id: student.student_id,
        fullname: student.student_name,
      }),
    });
  });
  const defaultValueDetails = [];
  if (defaultValue.length !== 0) {
    JSON.parse(defaultValue).map((student) => {
      // console.log(student);
      defaultValueDetails.push({
        label: student.fullname,
        value: JSON.stringify(student),
      });
    });
    // options.filter(
    //   (element) =>
    //     !defaultValueDetails
    //       .some((obj2) => element.value === obj2.value)
    //       .map((el) => defaultValueDetails.push(el))
    // );
    // console.log(
    //   options.filter(
    //     (element) =>
    //       !defaultValueDetails.some((obj2) => element.value === obj2.value)
    //   )
    // );
    // console.log(options);
    // console.log(defaultValueDetails);
  }

  // console.log(defaultValue)
  // for (let i = 10; i < 36; i++) {
  //   const value = i.toString(36) + i;
  //   options.push({
  //     label: `Long Label: ${value}`,
  //     value,
  //   });
  // }
  const selectProps = {
    mode: "multiple",
    className: { className },
    value,
    options,
    onChange: (newValue) => {
      handleAssigneeValue(newValue);
    },
    placeholder: "Select Item...",
    maxTagCount: "responsive",
  };
  return (
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
        mode="multiple"
        className={className}
        defaultValue={defaultValueDetails}
        id={id}
        value={value}
        options={options}
        status={status}
        onBlur={onBlur}
        loading={loading}
        disabled={disabled}
        onChange={(newValue) => {
          handleAssigneeValue(newValue);
          console.log(newValue);
          let ass = [];
          newValue.length !== 0
            ? newValue.map((assignee) =>
                ass.push({
                  email: JSON.parse(assignee).email,
                  user_id: JSON.parse(assignee).user_id,
                  fullname: JSON.parse(assignee).fullname,
                })
              )
            : "";
          console.log(ass);
          formik.setFieldValue(`assignee`, JSON.stringify(ass));
        }}
        placeholder="Select Item..."
        maxTagCount="responsive"
      />
    </div>
  );
};
