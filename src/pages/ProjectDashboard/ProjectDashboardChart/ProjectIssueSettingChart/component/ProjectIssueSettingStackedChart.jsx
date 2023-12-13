import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

export const ProjectIssueSettingStackedChart = ({ lineChart }) => {
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
    yaxis: {
      title: {
        text: "Count",
      },
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
    if (lineChart) {
      const categories = Object.keys(lineChart);
      const series = Object.keys(lineChart[categories[0]]).map((name) => ({
        name:
          name === "active"
            ? "Active"
            : name === "inactive"
            ? "Inactive"
            : name,
        data: categories.map((category) => lineChart[category][name]),
      }));

      setOptions((prevOptions) => ({
        ...prevOptions,
        series,
        xaxis: {
          categories,
        },
      }));
    }
  }, [lineChart]);

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
