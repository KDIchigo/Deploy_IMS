import React, { useState } from "react";
import { Select } from "antd";
import moment from "moment";
import { format } from "date-fns";

const { Option } = Select;

// const generateWeekOptions = () => {
//   const weekOptions = [];
//   const currentWeek = moment();

//   for (let i = 0; i < 12; i++) {
//     const startOfWeek = currentWeek
//       .clone()
//       .subtract(i, "weeks")
//       .startOf("week");
//     const endOfWeek = currentWeek.clone().subtract(i, "weeks").endOf("week");

//     const weekLabel = `Week ${i + 1}: ${startOfWeek.format(
//       "DD/MM/yyyy (ddd)"
//     )} - ${endOfWeek.format("DD/MM/yyyy (ddd)")}`;

//     // weekOptions.push(
//     //   <Option key={i + 1} value={i + 1}>
//     //     {weekLabel}
//     //   </Option>
//     // );
//     weekOptions.push({
//       value: `${i + 1}`,
//       label: `Week ${i + 1}: ${startOfWeek.format(
//         "DD/MM/yyyy (ddd)"
//       )} - ${endOfWeek.format("DD/MM/yyyy (ddd)")}`,
//       weekStart: `${startOfWeek.format("DD/MM/yyyy")}`,
//       weekEnd: `${endOfWeek.format("DD/MM/yyyy")}`,
//     });
//     // console.log({
//     //   value: `${i + 1}`,
//     //   label: `Week ${i + 1}:${startOfWeek.format(
//     //     "DD/MM/yyyy (ddd)"
//     //   )} - ${endOfWeek.format("DD/MM/yyyy (ddd)")}`,
//     //   weekStart: `${startOfWeek.format("DD/MM/yyyy")}`,
//     //   weekEnd: `${endOfWeek.format("DD/MM/yyyy")}`,
//     // });
//   }

//   return weekOptions;
// };

export const MonthWeekSelector = ({
  selectedWeek,
  handleWeekChange,
  generateWeekOptions,
}) => {
  // const [selectedWeek, setSelectedWeek] = useState(generateWeekOptions()[0]);
  // const handleWeekChange = (value, obj) => {
  //   setSelectedWeek(value);
  //   // fetchData(projectId, obj, true);
  //   console.log(obj);
  // };
  return (
    <div className="d-flex flex-column">
      <Select
        showSearch
        className="flexGrow_1 selectDesign"
        placeholder="Select a week"
        onChange={handleWeekChange}
        value={selectedWeek}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {generateWeekOptions().map((week) => (
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
