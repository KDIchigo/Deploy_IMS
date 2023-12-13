import React, { useState } from "react";
import moment from "moment";
import "./BaseRangePicker.scss";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker, Space } from "antd";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const weekFormat = "MM/DD";
const monthFormat = "YYYY/MM";

export const BaseRangePicker = ({
  id,
  className,
  label,
  important,
  formik,
  status,
  onBlur,
  valueFromDate,
  valueToDate,
  limitFromDate,
  limitToDate,
  disabledDate,
  name,
}) => {
  // console.log(limitFromDate)
  // console.log(limitToDate)
  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    formik.setFieldValue(`${id}`, dateString);
    console.log(dateString);
  };
  // const disabledDate = (current) => {
  //   // Disable dates before today or after a specific future date
  //   const formattedLimitFromDate = dayjs(limitFromDate);
  //   const formattedLimitToDate = dayjs(limitToDate);

  //   let isLimitDate = undefined;
  //   if (limitFromDate !== undefined && limitToDate !== undefined) {
  //     isLimitDate =
  //       current &&
  //       (current < formattedLimitFromDate.startOf("day") ||
  //         current > formattedLimitToDate.endOf("day"));
  //   }
  //   return isLimitDate;
  // };
  const handleRangePickerChangeJSON = (value, dateString) => {
    if (dateString && dateString.length === 2) {
      const formattedStartDate = moment(dateString[0], "DD/MM/YYYY").format(
        "YYYY-MM-DDTHH:mm:ss.SSS"
      );
      const formattedEndDate = moment(dateString[1], "DD/MM/YYYY").format(
        "YYYY-MM-DDTHH:mm:ss.SSS"
      );
      setSelectedValue([formattedStartDate, formattedEndDate]);
      formik.setFieldValue(
        "from_date",
        moment(`${dateString[0]} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
          .utcOffset(0, true)
          .toISOString()
      );
      formik.setFieldValue(
        "to_date",
        moment(`${dateString[1]} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
          .utcOffset(0, true)
          .toISOString()
      );

      // console.log(moment(`${dateString[0]} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
      // .utcOffset(0, true)
      // .toISOString());
      // console.log(dateString[0]);
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

  const handleRangePickerChange = (dates) => {
    const parsedDate = moment(
      dates,
      "ddd MMM DD YYYY HH:mm:ss [GMT+0700 (Indochina Time)]"
    );
    // Format the date in MM/DD/YYYY format
    const formattedDate = parsedDate.format("MM/DD/YYYY");
    console.log(formattedDate);
    return formattedDate;
  };
  const dateFormat = "DD/MM/YYYY";
  // console.log(formatDate('2023-10-21T00:00:00'));

  return (
    <>
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
      {/* <DatePicker
        id={id}
        status={status}
        name={name}
        className={className}
        // defaultValue={dayjs("01/01/2015", dateFormatList[0])}
        format={dateFormatList[0]}
        style={{ borderRadius: "4px" }}
        onBlur={onBlur}
        onChange={handleDateChange}
      /> */}
      <RangePicker
        id={id}
        disabledDate={disabledDate}
        status={status}
        className={className}
        name={name}
        style={{ borderRadius: "4px", height: 34 }}
        format={dateFormat}
        defaultValue={[
          valueFromDate === ""
            ? null
            : dayjs(formatDate(valueFromDate), dateFormat),
          valueToDate === ""
            ? null
            : dayjs(formatDate(valueToDate), dateFormat),
        ]}
        onChange={handleRangePickerChangeJSON}
        onBlur={onBlur}
      />
      {/* {selectedValue.length === 2 && (
        <p>
          Selected Value: {selectedValue[0]} - {selectedValue[1]}
        </p>
      )} */}
    </>
  );
};
