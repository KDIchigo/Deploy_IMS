import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { IssueCard } from "../UserDashboardChart/component/IssueCard";
import IssueLineChart from "../UserDashboardChart/component/IssueLineChart";
import IssuePieChart from "../UserDashboardChart/component/IssuePieChart";
const projectId = "47382c37-e832-4656-874c-2f5e6ac3e30a";
const from_date = "2023-11-16T08:48:48.322Z";
const to_date = "2023-11-22T08:48:48.322Z";

const UserDashboardChart = ({
  lineChart,
  issueStatus,
  issueCard,
  loadingData,
  issueTypes,
}) => {
  return (
    <>
      {/* {console.log(issueType)} */}
      <div className="row mt-4">
        <div className="col-4">
          <IssueLineChart lineChart={lineChart} issueTypes={issueTypes} />
        </div>
        <div className="col-4">
          {loadingData ? (
            <IssuePieChart issueStatus={issueStatus} issueTypes={issueTypes} />
          ) : (
            ""
          )}
        </div>
        <div className="col-4">
          <IssueCard issueCard={issueCard} issueTypes={issueTypes} />
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default UserDashboardChart;
