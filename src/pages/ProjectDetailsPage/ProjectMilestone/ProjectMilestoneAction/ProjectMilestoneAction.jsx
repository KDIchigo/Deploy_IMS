import {
  DeleteOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PoweroffOutlined,
  SettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { ProjectMilestoneDetails } from "../ProjectMilestoneDetails/ProjectMilestoneDetails";
import { useEffect, useState } from "react";

export const ProjectMilestoneAction = ({
  optionId,
  fetchData,
  searchParams,
  projectId,
  milestone,
  option,
  classMilestones,
  classMilestone,
  handleMilestoneChangeStatus,
  handleMilestoneDelete,
  handleMilestoneUpdate,
  code,
}) => {
  // const [selectMilestones, setSelectMilestones] = useState([]);
  // const getDataSelect = async () => {
  //   const { data: selectMilestoneArr } = await axiosClient.get(
  //     `/Milestone/${milestone.parent_id}`
  //   );
  //   setSelectMilestones(selectMilestoneArr);
  // };
  const [loadingData, setLoadingData] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const handleDelete = async (id) => {
    handleMilestoneDelete(id, code, setLoadingData);
  };

  const handleChangeStatus = async (optionId, status) => {
    handleMilestoneChangeStatus(optionId, status, setLoadingStatus, code);
  };
  // useEffect(() => {
  //   getDataSelect();
  // }, []);
  return (
    <>
      <div className="d-flex bd-highlight mx-auto">
        <ProjectMilestoneDetails
          milestone={option}
          // fetchData={fetchData}
          // searchParams={searchParams}
          projectId={projectId}
          classMilestones={classMilestones}
          classMilestone={classMilestone}
          // selectMilestones={selectMilestones}
          handleMilestoneUpdate={handleMilestoneUpdate}
          code={code}
        />

        {option.status === 1 && (
          <Tooltip
            title="Cancel"
            className="action_space"
            placement="top"
            color="#dc3545"
            size="large"
          >
            <div>
              {loadingStatus === 0 ? (
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
                    handleChangeStatus(optionId, StatusEnum.Inactive)
                  }
                />
              )}
            </div>
          </Tooltip>
        )}
        {option.status === 0 && (
          <>
            <Tooltip
              className="action_space"
              title="Pending"
              placement="top"
              color="#ec8550"
              size="large"
            >
              <div>
                {loadingStatus === 2 ? (
                  <BaseButton
                    color="pending"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    icon={<PauseCircleOutlined />}
                    variant="outline"
                    color="pending"
                    nameTitle="px-2 py-1"
                    onClick={() =>
                      handleChangeStatus(optionId, StatusEnum.Pending)
                    }
                  />
                )}
              </div>
            </Tooltip>
            <Tooltip
              className="action_space"
              title="In Progress"
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
                      handleChangeStatus(optionId, StatusEnum.Active)
                    }
                  />
                )}
              </div>
            </Tooltip>
          </>
        )}
        {option.status === 2 && (
          <>
            <Tooltip
              className="action_space"
              title="In Progress"
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
                      handleChangeStatus(optionId, StatusEnum.Active)
                    }
                  />
                )}
              </div>
            </Tooltip>
            <Tooltip
              className="action_space"
              title="Delete"
              placement="top"
              color="#dc3545"
              size="large"
            >
              <div>
                {loadingData ? (
                  <BaseButton
                    color="danger"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    color="danger"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    onClick={() => handleDelete(optionId)}
                    icon={<DeleteOutlined />}
                  />
                )}
              </div>
            </Tooltip>
          </>
        )}
      </div>
    </>
  );
};
