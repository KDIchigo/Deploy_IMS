import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Collapse, Empty, Tooltip } from "antd";
import { ProjectMilestoneItem } from "../ProjectMilestoneItem/ProjectMilestoneItem";
import { useState } from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import ViewClassMilestoneDetails from "../ViewClassMilestoneDetails/ViewClassMilestoneDetails";

export const ProjectMilestoneCollapse = ({
  milestones,
  projectId,
  classMilestones,
  handleMilestoneChangeStatus,
  handleMilestoneDelete,
  handleMilestoneUpdate,
}) => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <div id="project-allocation__header" className="d_flex_row">
        <div className="text-center m-0" style={{ width: "5%" }}>
          #
        </div>
        <div style={{ width: "20%" }}>Milestone Name</div>
        <div style={{ width: "15%" }}>From Date</div>
        <div style={{ width: "15%" }}>To Date</div>
        <div style={{ width: "25%" }}>Description</div>
        <div className="text-center m-0" style={{ width: "10%" }}>
          Status
        </div>
        <div className="text-center m-0" style={{ width: "10%" }}>
          Action
        </div>
      </div>
      {milestones.length !== 0 ? (
        milestones.map((milestone) => (
          <Collapse
            key={milestone.milestone_id}
            className="milestoneCollapse"
            collapsible={milestone.status === 0 ? "disabled" : "icon"}
            // defaultActiveKey={["1"]}
            //   onChange={onChange}
            items={[
              {
                key: 1,
                label: <span>{milestone.milestone_name}</span>,
                children: (
                  <ProjectMilestoneItem
                    projectId={projectId}
                    milestone={milestone}
                    classMilestones={classMilestones}
                    handleMilestoneChangeStatus={handleMilestoneChangeStatus}
                    handleMilestoneDelete={handleMilestoneDelete}
                    handleMilestoneUpdate={handleMilestoneUpdate}
                  />
                ),
                extra: (
                  <>
                    {" "}
                    <Tooltip
                      title="Details"
                      placement="top"
                      color="#ffc107"
                      size="large"
                    >
                      <div>
                        <EditOutlined onClick={() => setModal(!modal)} />
                      </div>
                    </Tooltip>
                    <ViewClassMilestoneDetails
                      milestone={milestone}
                      modal={modal}
                      setModal={setModal}
                    />
                  </>
                ),
              },
            ]}
          />
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};
