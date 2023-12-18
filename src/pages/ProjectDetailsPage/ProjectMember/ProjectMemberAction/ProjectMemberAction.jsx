import {
  DeleteFilled,
  LoadingOutlined,
  PlusOutlined,
  PoweroffOutlined,
  StarOutlined,
  StopOutlined,
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
  handleChangeStatus,
  loadingStatus,
  actionId,
  handleProjectStudentDelete,
}) => {
  return (
    <>
      <div className="d-flex bd-highlight mx-auto">
        <>
          {student.status === 0 ? (
            <Tooltip
              title="Activate"
              className="action_space"
              placement="top"
              color="#198754"
              size="large"
            >
              <div>
                {loadingStatus === 1 ? (
                  <BaseButton
                    color="success"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    icon={<PoweroffOutlined />}
                    variant="outline"
                    color="success"
                    nameTitle="px-2 py-1"
                    onClick={() =>
                      handleChangeStatus(student, StatusEnum.Active)
                    }
                  />
                )}
              </div>
            </Tooltip>
          ) : (
            <Tooltip
              title="Deactivate"
              className="action_space"
              placement="top"
              color="#dc3545"
              size="large"
            >
              <div>
                {actionId === student.class_student_id && loadingStatus ? (
                  <BaseButton
                    color="danger"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    icon={<StopOutlined />}
                    variant="outline"
                    color="danger"
                    nameTitle="px-2 py-1"
                    onClick={() =>
                      handleChangeStatus(student, StatusEnum.Inactive)
                    }
                  />
                )}
              </div>
            </Tooltip>
          )}
          {!isLeader && (
            <Tooltip
              title="Choose Leader"
              className="action_space"
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
          <Tooltip
            title="Remove"
            className="action_space"
            placement="top"
            color="#dc3545"
            size="large"
          >
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
