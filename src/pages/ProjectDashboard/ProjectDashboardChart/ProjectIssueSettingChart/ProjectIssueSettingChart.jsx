import React from "react";
import { ProjectIssueSettingsLineChart } from "./component/ProjectIssueSettingLineChart";
import { ProjectIssueSettingPieChart } from "./component/ProjectIssueSettingPieChart";
import { ProjectIssueSettingStackedChart } from "./component/ProjectIssueSettingStackedChart";

export const ProjectIssueSettingChart = ({
  pieChart,
  lineChart,
  loadingData,
}) => {
  return (
    <>
      <div className="row mt-4">
        <h5 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
          Issue Setting
        </h5>
        <div className="col-4">
          {loadingData ? (
            <ProjectIssueSettingsLineChart lineChart={lineChart} />
          ) : (
            ""
          )}
        </div>
        <div className="col-4">
          {loadingData ? (
            <ProjectIssueSettingPieChart pieChart={pieChart} />
          ) : (
            ""
          )}
        </div>
        <div className="col-4">
          {loadingData ? (
            <ProjectIssueSettingStackedChart lineChart={lineChart} />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
