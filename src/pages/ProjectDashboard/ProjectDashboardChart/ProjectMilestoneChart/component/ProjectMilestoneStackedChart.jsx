import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export const ProjectMilestoneStackedChart = ({ lineChartMilestone }) => {
  const [options, setOptions] = useState({
    series: [],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: [],
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  });

  useEffect(() => {
    if (lineChartMilestone) {
      const categories = Object.keys(lineChartMilestone);
      const series = Object.keys(lineChartMilestone[categories[0]]).map(
        (name) => {
          let label;
          if (name === "active_count") {
            label = "In Progress";
          } else if (name === "inactive_count") {
            label = "Closed";
          } else if (name === "pending_count") {
            label = "Pending";
          } else {
            label = name;
          }

          return {
            name: label,
            data: categories.map(
              (category) => lineChartMilestone[category][name]
            ),
          };
        }
      );

      setOptions((prevOptions) => ({
        ...prevOptions,
        series,
        xaxis: {
          categories,
        },
      }));
    }
  }, [lineChartMilestone]);
  return (
    <div className="card shadow">
      <Chart
        options={options}
        series={options.series}
        type="bar"
        height="210px"
      />
    </div>
  );
};
