// MonthWeekSelector.js
import React, { useState, useEffect } from "react";
import { Select } from "antd";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  addDays,
  parse,
  isWithinInterval,
} from "date-fns";
import moment from "moment";

const { Option } = Select;
const initialMonth = moment().startOf("month");

export const ProjectMonthWeekSelector = () => {
  const [months, setMonths] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const addDaysToDate = (inputDate, daysToAdd) => {
    const resultDate = addDays(inputDate, daysToAdd);
    return format(resultDate, "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX (zzzz)");
  };
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = format(date, "EEE");

    return dayOfWeek;
  };
  const isDateWithinRange = (dateToCheck, startDate, endDate) => {
    const checkDate = parse(dateToCheck, "dd/MM/yyyy", new Date());
    const start = parse(startDate, "dd/MM/yyyy", new Date());
    const end = parse(endDate, "dd/MM/yyyy", new Date());

    return isWithinInterval(checkDate, { start, end });
  };

  const generateWeekOptions = (startDate, endDate) => {
    const weekOptions = [];
    let currentDate = startDate;
    let index = 0;

    while (currentDate <= endDate) {
      index++;
      const weekStart = format(currentDate, "dd/MM/yyyy");
      let weekEnd = format(
        new Date(addDaysToDate(currentDate, 6)),
        "dd/MM/yyyy"
      );
      // let weekEnd = format(endOfWeek(currentDate), "dd/MM/yyyy");
      const dayOfWeekStart = getDayOfWeek(currentDate);
      let dayOfWeekEnd = getDayOfWeek(new Date(addDaysToDate(currentDate, 6)));
      let monthStart = new Date(currentDate).toLocaleString("en-US", {
        month: "long",
      });
      let monthEnd = new Date(
        new Date(addDaysToDate(currentDate, 6))
      ).toLocaleString("en-US", {
        month: "long",
      });
      // Adjust the end date to be the last day of the month if it's the last week
      if (monthStart !== monthEnd) {
        weekEnd = format(endDate, "dd/MM/yyyy");
        dayOfWeekEnd = getDayOfWeek(endDate);
      }

      weekOptions.push({
        value: `${index}`,
        label: `Week ${index}: ${weekStart} (${dayOfWeekStart}) - ${weekEnd} (${dayOfWeekEnd})`,
        weekStart: `${weekStart}`,
        weekEnd: `${weekEnd}`,
      });
      console.log({
        value: `${index}`,
        label: `Week ${index}: ${weekStart} (${dayOfWeekStart}) - ${weekEnd} (${dayOfWeekEnd})`,
        weekStart: `${weekStart}`,
        weekEnd: `${weekEnd}`,
      });

      currentDate = new Date(addDaysToDate(currentDate, 6));
      currentDate = currentDate > endDate ? endDate : currentDate;
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Move to the next day
    }
    console.log(weekOptions);

    return weekOptions;
  };
  const handleWeekOptions = (value) => {
    setSelectedMonth(value);

    // Additional logic to filter weeks based on the selected month
    const startOfMonthDate = startOfMonth(
      new Date(new Date().getFullYear(), value - 1, 1)
    );
    const endOfMonthDate = endOfMonth(
      new Date(new Date().getFullYear(), value - 1, 1)
    );

    // Generate week options for the selected month
    const weekOptions = generateWeekOptions(startOfMonthDate, endOfMonthDate);

    // Update week options in state
    return weekOptions;
  };

  const handleMonthChange = (value) => {
    const weekOptions = handleWeekOptions(value);
    setWeeks(weekOptions);
    setSelectedWeek(weekOptions[0]);
    // setIsSelectMonthWeek(true);
    // fetchData(projectId, weekOptions[0], true);
  };
  const handleWeekChange = (value, obj) => {
    setSelectedWeek(value);
    // fetchData(projectId, obj, true);
    console.log(value);
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const monthOptions = Array.from({ length: 12 }, (_, index) => ({
      value: index + 1,
      label: format(new Date(currentYear, index, 1), "MMMM"),
    }));
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
    setMonths(monthOptions);
    const currentDate = moment();
    const defaultMonth = {
      label: realMonthsData[currentDate.month()],
      value: currentDate.month() + 1,
    };

    setSelectedMonth(defaultMonth);

    const weekOptions = handleWeekOptions(currentDate.month() + 1);
    setWeeks(weekOptions);

    let index = weekOptions.findIndex(
      (item) =>
        isDateWithinRange(
          currentDate.format("DD/MM/yyyy"),
          item.weekStart,
          item.weekEnd
        ) === true
    );

    setSelectedWeek(weekOptions[index]);
  }, []);
  return (
    <div className="d-flex flex-column">
      <Select
        placeholder="Select Month"
        className="flexGrow_1"
        onChange={handleMonthChange}
        value={selectedMonth}
      >
        {months.map((month) => (
          <Option key={month.value} value={month.value}>
            {month.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Select Week"
        className="flexGrow_1 mt-3"
        onChange={handleWeekChange}
        value={selectedWeek}
      >
        {weeks.map((week) => (
          <Option
            key={week.value}
            value={week.value}
            weekStart={week.weekStart}
            weekEnd={week.weekEnd}
          >
            {week.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};
