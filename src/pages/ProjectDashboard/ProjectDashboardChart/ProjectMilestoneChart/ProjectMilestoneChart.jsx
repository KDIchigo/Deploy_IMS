import { ProjectMilestoneLineChart } from "./component/ProjectMilestoneLineChart";
import { ProjectMilestonePieChart } from "./component/ProjectMilestonePieChart";
import { ProjectMilestoneStackedChart } from "./component/ProjectMilestoneStackedChart";

export const ProjectMilestoneChart = ({
  pieChartMilestone,
  lineChartMilestone,
  loadingData,
}) => {
  return (
    <>
      <div className="row mt-4">
        <h5 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
          Milestones
        </h5>
        <div className="col-4">
          {loadingData ? (
            <ProjectMilestoneLineChart
              lineChartMilestone={lineChartMilestone}
            />
          ) : (
            ""
          )}
        </div>
        <div className="col-4">
          {loadingData ? (
            <ProjectMilestonePieChart pieChartMilestone={pieChartMilestone} />
          ) : (
            ""
          )}
        </div>
        <div className="col-4">
          {loadingData ? (
            <ProjectMilestoneStackedChart
              lineChartMilestone={lineChartMilestone}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
