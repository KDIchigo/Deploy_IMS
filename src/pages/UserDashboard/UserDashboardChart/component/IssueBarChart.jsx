import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const IssueBarChart = ({ barChart }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    series: [],
  });

  useEffect(() => {
    // Extract labels and counts from barChart
    const labels = barChart.map((entry) => Object.keys(entry)[0]);
    const counts = barChart.map((entry) => entry[Object.keys(entry)[0]]);

    setChartData({ labels, series: counts });
  }, [barChart]);

  const options = {
    chart: {
      type: "pie",
    },
    labels: chartData.labels,
    title: {
      text: "Project Requirements",
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
  };

  return (
    <div className="donut">
      <div className="card mt-2 shadow" style={{ border: "1px solid #ddd" }}>
        <Chart
          options={options}
          series={chartData.series}
          type="pie"
          width={options.chart.width}
          height={215}
        />
      </div>
    </div>
  );
};

export default IssueBarChart;
