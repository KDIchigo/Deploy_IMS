import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export const ProjectMilestonePieChart = ({ pieChartMilestone }) => {
  const [options, setOptions] = useState({
    series: [],
    chart: {
      type: "pie",
    },
    labels: [],
    title: {
      text: "Milestone By Status",
      align: "left",
      bottom: 10,
    },
    legend: {
      position: "right",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  });

  useEffect(() => {
    if (pieChartMilestone) {
      const chartData = Object.entries(pieChartMilestone).map(
        ([name, count]) => ({
          name,
          count,
        })
      );

      // Map function to replace specific names
      const mappedChartData = chartData.map(({ name, count }) => ({
        name:
          name === "active_count"
            ? "In Progress"
            : name === "inactive_count"
            ? "Closed"
            : name === "pending_count"
            ? "Pending"
            : name,
        count,
      }));

      const labels = mappedChartData.map((data) => data.name);
      const series = mappedChartData.map((data) => data.count);

      setOptions((prevOptions) => ({
        ...prevOptions,
        labels,
        series,
      }));
    }
  }, [pieChartMilestone]);

  return (
    <React.Fragment>
      <div className="donut">
        <div className="card shadow" style={{ border: "1px solid #ddd" }}>
          <Chart
            options={options}
            series={options.series}
            type="pie"
            width={options.chart.width}
            height={225}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
