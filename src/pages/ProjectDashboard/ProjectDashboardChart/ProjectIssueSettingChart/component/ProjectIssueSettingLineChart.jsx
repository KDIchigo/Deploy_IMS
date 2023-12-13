import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export const ProjectIssueSettingsLineChart = ({ lineChart }) => {
  const [options, setOptions] = useState({
    series: [],
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 20,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["rgb(255, 69, 96)", "rgb(0, 227, 150)"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Issue Setting",
      align: "left",
      bottom: 10,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      min: 0,
      max: 40,
    },
    legend: {
      position: "top",
      top: 20,
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
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
        type="line"
        height="210px"
      />
    </div>
  );
};
