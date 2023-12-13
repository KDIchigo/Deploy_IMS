import React, { useState, useEffect } from "react";
import Select from "react-select";
import moment from "moment";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";

export const FilterMonthWeek = ({ onWeekChange }) => {
  const [months, setMonths] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const initialMonth = moment().startOf("month");

  useEffect(() => {
    // Populate months array with real data or hard-coded values
    const realMonthsData = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthsOptions = realMonthsData.map((month, index) => ({
      label: month,
      value: index + 1,
    }));
    setMonths(monthsOptions);

    // Set default value for the current month
    const currentMonthIndex = moment().month();
    const defaultMonth = {
      label: realMonthsData[currentMonthIndex],
      value: currentMonthIndex + 1,
    };

    // console.log("Default Month: ", defaultMonth);
    setSelectedMonth(defaultMonth);
    // console.log("Default Month After: ", selectedMonth);
  }, []);

  useEffect(() => {
    // Update weeks based on the selected month
    if (selectedMonth) {
      const startOfMonth = initialMonth.month(selectedMonth.value - 1);
      const endOfMonth = moment(startOfMonth).endOf("month");

      const weekOptions = [];
      let currentWeekStartDate = startOfMonth.clone();
      while (currentWeekStartDate <= endOfMonth) {
        const currentWeekEndDate = currentWeekStartDate.clone().endOf("week");
        weekOptions.push({
          label: `${currentWeekStartDate.format(
            "DD/MM/YYYY"
          )} - ${currentWeekEndDate.format("DD/MM/YYYY")}`,
          value: weekOptions.length + 1,
        });
        currentWeekStartDate.add(1, "week");
      }

      setWeeks(weekOptions);

      // Set default value for the current week only if it hasn't been set yet
      if (!selectedWeek) {
        const currentWeek = moment().isoWeek();
        const defaultWeek = {
          label: `${moment().startOf("week").format("DD/MM/YYYY")} - ${moment()
            .endOf("week")
            .format("DD/MM/YYYY")}`,
          value: currentWeek,
        };

        setSelectedWeek(defaultWeek);

        // Trigger the callback with initial values in the desired format
        onWeekChange(
          moment().startOf("isoWeek").format("YYYY-MM-DDTHH:mm:ss.SSS"),
          moment().endOf("isoWeek").format("YYYY-MM-DDTHH:mm:ss.SSS")
        );
      }
    }
  }, [selectedMonth, selectedWeek, onWeekChange]);

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption);
    // Reset selected week when changing the month
    setSelectedWeek(null);
  };

  const handleWeekChange = (selectedOption) => {
    setSelectedWeek(selectedOption);
    // Update selected date based on the selected week
    const startOfMonth = initialMonth.month(selectedMonth.value - 1);
    const startDate = startOfMonth
      .clone()
      .add(selectedOption.value - 1, "weeks")
      .format("DD/MM/YYYY");

    const endDate = startOfMonth
      .clone()
      .add(selectedOption.value, "weeks")
      .subtract(1, "day")
      .format("DD/MM/YYYY");

    // Chuyển đổi thành định dạng mong muốn
    const formattedStartDate = moment(startDate, "DD/MM/YYYY").format(
      "YYYY-MM-DDTHH:mm:ss.SSS"
    );

    const formattedEndDate = moment(endDate, "DD/MM/YYYY")
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSS");

    // Gọi hàm callback và truyền giá trị startDate và endDate lên component cha
    onWeekChange(formattedStartDate, formattedEndDate);
    console.log(formattedStartDate);
    console.log(formattedEndDate);
  };

  return (
    <div>
      <Select
        options={months}
        value={selectedMonth}
        onChange={handleMonthChange}
        placeholder="Select a month"
        className="col-4 mb-3"
      />
      {selectedMonth && (
        <Select
          options={weeks}
          value={selectedWeek}
          onChange={handleWeekChange}
          placeholder="Select a week"
          className="col-4 mb-3"
        />
      )}
    </div>
  );
};
