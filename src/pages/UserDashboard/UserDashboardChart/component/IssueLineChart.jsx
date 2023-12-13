import React, { useState } from "react";
import Chart from "react-apexcharts";

const IssueLineChart = ({ lineChart, issueTypes }) => {
  const options = {
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
    colors: ["rgb(0, 227, 150)", "rgb(255, 69, 96)"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Created vs Closed Issues",
      align: "left",
      bottom: 10,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
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
      max: 20,
    },
    legend: {
      position: "top",
      top: 20,
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
  };

  const getChartData = (issueTypeData) => {
    const openCountData = [];
    const closedCountData = [];
    const categories = [];

    issueTypeData.forEach((entry) => {
      const daysData = entry[Object.keys(entry)[0]];

      for (const day in daysData) {
        openCountData.push(daysData[day].open_count);
        closedCountData.push(daysData[day].closed_count);
        categories.push(day);
      }
    });

    return {
      openCountData,
      closedCountData,
      categories: [...new Set(categories)], // Remove duplicates
    };
  };

  return (
    <div className="chart">
      {lineChart.map((entry, index) => {
        const currentIssueType = Object.keys(entry)[0];

        // Kiểm 0tra xem issueType hiện tại có trong danh sách issueType được truyền qua props không
        // if (issueTypes.includes(currentIssueType)) {
        if (currentIssueType === issueTypes) {
          const { openCountData, closedCountData, categories } = getChartData([
            entry,
          ]);

          const seriesData = [
            { name: "Open Issues", data: openCountData },
            { name: "Closed Issues", data: closedCountData },
          ];

          const chartOptions = {
            ...options,
            xaxis: { categories },
          };

          return (
            <div key={index} className="card shadow parent_class">
              <Chart
                options={chartOptions}
                series={seriesData}
                type="line"
                height="210px"
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default IssueLineChart;
