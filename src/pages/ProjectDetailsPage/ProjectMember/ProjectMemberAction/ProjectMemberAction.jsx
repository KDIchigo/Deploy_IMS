import {
  DeleteFilled,
  LoadingOutlined,
  PlusOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import React from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";

const ProjectMemberAction = ({
  student,
  project,
  isLeader,
  loadingLeader,
  loadingRemove,
  handleSetLeader,
  actionId,
  handleProjectStudentDelete,
}) => {
  return (
    <>
      <div className="d-flex justify-content-around">
        <>
          {!isLeader && (
            <Tooltip
              title="Set Leader"
              placement="top"
              color="rgb(132, 90, 223)"
              size="large"
            >
              <div>
                {loadingLeader ? (
                  <BaseButton
                    color="primary"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    color="primary"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    // disabled={classObj.status === StatusEnum.Active}
                    onClick={() => handleSetLeader(student.student_id, project)}
                    icon={<StarOutlined />}
                  />
                )}
              </div>
            </Tooltip>
          )}
          <Tooltip title="Remove" placement="top" color="#dc3545" size="large">
            <div>
              {actionId === student.class_student_id && loadingRemove ? (
                <BaseButton
                  color="danger"
                  variant="outline"
                  nameTitle="px-2 py-1"
                  icon={<LoadingOutlined />}
                />
              ) : (
              <BaseButton
                color="danger"
                // disabled={classObj.status === StatusEnum.Active}
                variant="outline"
                nameTitle="px-2 py-1"
                onClick={() => handleProjectStudentDelete(student, project)}
                icon={<DeleteFilled />}
              />
              )}
            </div>
          </Tooltip>
        </>
      </div>
    </>
  );
};

export default ProjectMemberAction;
