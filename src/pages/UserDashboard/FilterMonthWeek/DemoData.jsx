import React, { useState } from "react";

export const DemoData = () => {
  const [data, setData] = useState([
    {
      "Ichigo Class 1": {
        "Wednesday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Thursday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Friday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Saturday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Sunday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Monday": {
          "open_count": 4,
          "closed_count": 0
        },
        "Tuesday": {
          "open_count": 2,
          "closed_count": 0
        }
      }
    },
    {
      "Ichigo Subject 2": {
        "Wednesday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Thursday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Friday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Saturday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Sunday": {
          "open_count": 0,
          "closed_count": 0
        },
        "Monday": {
          "open_count": 2,
          "closed_count": 0
        },
        "Tuesday": {
          "open_count": 1,
          "closed_count": 0
        }
      }
    }
  ]);

  // Your rendering logic here
  return (
    <div>
      {data.map((entry, index) => {
        const category = Object.keys(entry)[0]; // e.g., "Issue Setting 2" or "Q&A"
        const daysData = entry[category];

        return (
          <div key={index}>
            <h2>{category}</h2>
            <ul>
              {Object.keys(daysData).map((day, dayIndex) => (
                <li key={dayIndex}>
                  {day}: {daysData[day].open_count} open(s), {daysData[day].closed_count} closed(s)
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
