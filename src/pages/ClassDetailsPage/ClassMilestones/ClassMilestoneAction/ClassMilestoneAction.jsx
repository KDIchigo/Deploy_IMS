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
import { ClassMilestoneDetails } from "../ClassMilestoneDetails/ClassMilestoneDetails";
import { useState } from "react";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const ClassMilestoneAction = ({
  optionId,
  fetchData,
  searchParams,
  classId,
  milestone,
  option,
  code,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const handleDelete = async (id) => {
    const Id = [];
    Id.push(id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete the ${code} milestone ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoadingData(true);
          const { data, err } = await axiosClient.delete(
            `Milestone/DeleteMultiple`,
            {
              data: Id,
            }
          );
          if (err) {
            // toast.error(`The ${code} milestone was deleted fail`);
            showErrorMessage(err);
            setLoadingData(false);
            return;
          } else {
            toast.success(`The ${code} milestone was deleted successfully`);
            setLoadingData(false);
            fetchData(searchParams);
          }
        }
      });
    // console.log(err.response.data.Message);
  };
  const handleChangeStatus = async (optionId, status) => {
    const userIdArr = [];
    userIdArr.push(optionId);
    const statusLabel =
      status === 0
        ? "closed"
        : status === 1
        ? "in progress"
        : status === 2
        ? "pending"
        : "unknown";
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to ${statusLabel} ${code} milestone ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          if (status === StatusEnum.Inactive) {
            // Set loading status to true
            setLoadingStatus(0);
          } else if (status === StatusEnum.Pending) {
            setLoadingStatus(2);
          } else if (status === StatusEnum.Active) {
            setLoadingStatus(1);
          }
          const { data, err } = await axiosClient.post(
            `/Milestone/UpdateStatus?status=${status}`,
            userIdArr
          );

          if (err) {
            toast.error(`The ${code} milestone was ${statusLabel} fail`);
            setLoadingStatus(-1);
            return;
          } else {
            toast.success(
              `The ${code} milestone was ${statusLabel} successfully`
            );
            setLoadingStatus(-1);
            fetchData(searchParams);
          }
        }
      });
  };
  return (
    <>
      <div className="d-flex bd-highlight mx-auto">
        <ClassMilestoneDetails
          milestone={milestone}
          fetchData={fetchData}
          searchParams={searchParams}
          classId={classId}
          code={code}
        />
        {option.status === 1 ? (
          <Tooltip
            title="Closed"
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
        ) : (
          ""
        )}
        {option.status === 0 ? (
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
        ) : (
          ""
        )}
        {option.status === 2 ? (
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
        ) : (
          ""
        )}
      </div>
    </>
  );
};
