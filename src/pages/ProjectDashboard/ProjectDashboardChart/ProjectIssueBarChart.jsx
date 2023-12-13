import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const ProjectIssueBarChart = ({ projectMember }) => {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      title: {
        text: "Project Newly Created Issues",
      },
      xaxis: {
        categories: [], // Updated to be dynamically populated
        labels: {
          formatter(val, index) {
            return index * 5; // Adjusted to the desired range
          },
        },
      },

      tooltip: {
        y: {
          formatter(val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
      },
    },
  });

  useEffect(() => {
    if (Object.keys(projectMember).length === 0) return;

    // Extract keys (categories) and initial data from projectMember
    const categories = Object.keys(projectMember);
    const series = Object.keys(
      projectMember[Object.keys(projectMember)[0]]
    ).map((name) => ({
      name,
      data: categories.map((category) => projectMember[category][name]),
    }));

    // Update chart data state
    setChartData((prevData) => ({
      ...prevData,
      categories,
      series,
      options: {
        ...prevData.options,
        xaxis: {
          categories,
          labels: {
            formatter(val, index) {
              return index * 5; // Adjusted to the desired range
            },
          },
        },
      },
    }));
  }, [projectMember]);

  return (
    <div id="chart" className="shadow">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default ProjectIssueBarChart;
