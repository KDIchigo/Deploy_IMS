import { DatePicker } from "antd";
import React, { useState } from "react";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ConditionEnum } from "src/enum/Enum";
dayjs.extend(customParseFormat);
export const BaseDatePicker = ({
  id,
  className,
  placeholder,
  label,
  important,
  isFilter,
  status,
  onFilter,
  onBlur,
  name,
  value,
  formik,
  checked,
  disabled,
  disabledDate,
  onChange,
}) => {
  const filter = {
    field: "",
    value: "",
    condition: ConditionEnum.Equal,
  };
  const classNameDiv = `selectDesign ${disabled ? "disable" : ""} ${className}`;
  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // const handleRangePickerChangeJSON = (value, dateString) => {
  //   const formattedStartDate = moment(dateString, "MM/DD/YYYY").toISOString();
  //   //   setSelectedValue([formattedStartDate, formattedEndDate]);
  //   console.log(formattedStartDate);
  //   return formattedStartDate;
  // };
  const disabledFromDate = (current, date) => {
    let checkedDate = date === undefined ? moment() : date;
    return current && current < checkedDate.startOf("day");
  };
  const disabledToDate = (current, date) => {
    let checkedDate = date === undefined ? moment() : date;
    return current && current > checkedDate.endOf("day");
  };

  const handleDisabledDate = (current) => {
    let isDisabledDate = undefined;
    switch (id) {
      case "from_date":
        console.log(checked);
        if (checked !== undefined) {
          isDisabledDate = disabledFromDate(current, checked);
        } else {
          isDisabledDate = undefined;
        }
        break;
      case "to_date":
        if (checked !== undefined) {
          isDisabledDate = disabledToDate(current, checked);
        } else {
          isDisabledDate = undefined;
        }
        break;
      default:
        isDisabledDate = undefined;
    }
    return isDisabledDate;
  };

  const handleRangePickerChangeJSON = (value, dateString) => {
    const formattedDate = moment(dateString, "DD/MM/YYYY").format(
      "YYYY-MM-DDTHH:mm:ss.SSS"
    );
    if (isFilter) {
      const newFilter = {
        ...filter,
        field: id,
        value: formattedDate,
      };
      onFilter(newFilter);
      onChange(formattedDate);
      // console.log(formattedDate)
    } else {
      formik.setFieldValue(
        "due_date",
        moment(`${dateString} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
          .utcOffset(0, true)
          .toISOString()
      );
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const dateFormat = "DD/MM/YYYY";
  const formattedChecked =
    checked === undefined ? undefined : dayjs(formatDate(checked), dateFormat);
  return (
    <>
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
      <DatePicker
        id={id}
        status={status}
        allowClear
        placeholder={placeholder}
        disabledDate={disabledDate}
        className={classNameDiv}
        disabled={disabled}
        name={name}
        value={
          checked === undefined
            ? undefined
            : dayjs(formatDate(checked), dateFormat)
        }
        style={{ borderRadius: "4px", height: 34 }}
        format={dateFormat}
        defaultValue={
          value === "" || value === null
            ? null
            : dayjs(formatDate(value), dateFormat)
        }
        onChange={handleRangePickerChangeJSON}
        onBlur={onBlur}
      />
    </>
  );
};
