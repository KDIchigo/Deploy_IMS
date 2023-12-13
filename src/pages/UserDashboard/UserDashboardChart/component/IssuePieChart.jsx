import React from "react";
import Chart from "react-apexcharts";

const IssuePieChart = ({ issueStatus, issueTypes }) => {
  // console.log(issueStatus);
  const issueTypesAndDaysData = issueStatus.map((entry) => {
    const issueType = Object.keys(entry)[0];
    const daysData = entry[issueType];
    return { issueType, daysData };
  });

  const chartData = issueTypesAndDaysData.map((data) => ({
    issueType: data.issueType,
    issueTypeKeys: Object.keys(data.daysData),
  }));

  return (
    <React.Fragment>
      {chartData.map((data, index) => {
        const countsArray = issueStatus.map((entry) => {
          const issueType = Object.keys(entry)[0];
          const counts = Object.values(entry[issueType]);
          return counts;
        });
        // {
        //   console.log(data.issueTypeKeys);
        // }
        // {
        //   console.log(countsArray[index]);
        // }
        // Kiểm tra xem issueType của biểu đồ có trùng với issueType props không
        // if (issueTypes.includes(data.issueType)) {
        if (data.issueType === issueTypes) {
          return (
            <div key={index} className="donut">
              <div className="card shadow">
                <Chart
                  type="pie"
                  height={223}
                  series={countsArray[index]}
                  options={{
                    labels: data.issueTypeKeys,
                    title: {
                      text: `Issues By Status - ${data.issueType}`,
                      align: "left",
                      bottom: 10,
                    },
                    chart: {
                      width: 300,
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          labels: {
                            show: false,
                            // total: {
                            //   show: true,
                            //   showAlways: true,
                            //   fontSize: 20,
                            //   color: "#f90000",
                            // },
                          },
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                    },
                  }}
                />
              </div>
            </div>
          );
        }

        // Nếu không trùng, trả về null hoặc hiển thị thông báo khác tùy ý
        return null;
      })}
    </React.Fragment>
  );
};

export default IssuePieChart;
