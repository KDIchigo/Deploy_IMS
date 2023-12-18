import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Badge, Collapse, ConfigProvider, Empty, Tooltip } from "antd";
import { ProjectMilestoneItem } from "../ProjectMilestoneItem/ProjectMilestoneItem";
import { useState } from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import ViewClassMilestoneDetails from "../ViewClassMilestoneDetails/ViewClassMilestoneDetails";
import moment from "moment";

export const ProjectMilestoneCollapse = ({
  milestones,
  projectId,
  classMilestones,
  handleMilestoneChangeStatus,
  handleMilestoneDelete,
  handleMilestoneUpdate,
}) => {
  const [modal, setModal] = useState(false);
  const genExtra = () => {};
  return (
    <>
      <div id="project-allocation__header" className="d_flex_row">
        <div className="text-center m-0" style={{ width: "5%" }}>
          #
        </div>
        <div style={{ width: "20%" }}>Milestone Name</div>
        <div style={{ width: "15%" }}>From Date</div>
        <div style={{ width: "15%" }}>To Date</div>
        <div style={{ width: "23%" }}>Description</div>
        <div className="text-center m-0" style={{ width: "12%" }}>
          Status
        </div>
        <div className="text-center m-0" style={{ width: "10%" }}>
          Action
        </div>
      </div>
      {milestones.length !== 0 ? (
        milestones.map((milestone) => (
          <>
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
                      <div className="milestone_extra_item d-flex justify-content-start">
                        <Tooltip
                          title={moment(milestone.from_date).format(
                            "DD/MM/YYYY"
                          )}
                          placement="top"
                          size="large"
                        >
                          <div>
                            {moment(milestone.from_date).format("DD/MM/YYYY")}
                          </div>
                        </Tooltip>
                      </div>
                      <div className="milestone_extra_item d-flex justify-content-start">
                        <Tooltip
                          title={moment(milestone.to_date).format("DD/MM/YYYY")}
                          placement="top"
                          size="large"
                        >
                          <div>
                            {moment(milestone.to_date).format("DD/MM/YYYY")}
                          </div>
                        </Tooltip>
                      </div>
                      <div className="milestone_extra_item d-flex justify-content-start">
                        <Tooltip
                          title={milestone.description}
                          placement="top"
                          size="large"
                        >
                          <div className="truncate-text">
                            {milestone.description}
                          </div>
                        </Tooltip>
                      </div>
                      <div className="milestone_extra_item d-flex justify-content-center">
                        <Tooltip placement="top" size="large">
                          <div className="truncate-text">
                            {milestone.status === 1 && (
                              <Badge
                                key="#26BF94"
                                color="#26BF94"
                                text="In Progress"
                                className="badgeActive"
                              />
                            )}
                            {milestone.status === 0 && (
                              <Badge
                                key="red"
                                color="red"
                                text="Closed"
                                className="badgeInactive"
                              />
                            )}
                            {milestone.status === 2 && (
                              <Badge
                                key="#EC8550"
                                color="#EC8550"
                                text="Pending"
                                className="badgePending"
                              />
                            )}
                          </div>
                        </Tooltip>
                      </div>
                      <div className="milestone_extra_item d-flex justify-content-end">
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
                      </div>
                    </>
                  ),
                },
              ]}
            />
            <ViewClassMilestoneDetails
              milestone={milestone}
              modal={modal}
              setModal={setModal}
            />
          </>
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};
