import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PoweroffOutlined,
  SettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import { HandleAuth } from "src/utils/handleAuth";
export const ClassAction = ({
  option,
  optionId,
  modalCmpt,
  subjectId,
  id,
  fetchData,
  searchParams,
  type,
  onClick,
  code,
}) => {
  const [modal, setModal] = useState(false);
  const { IsTeacher } = HandleAuth();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);

  const handleDelete = async (id) => {
    const classStudentId = [];
    classStudentId.push(id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete the ${code} class?`,
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
            "Class/DeleteMultiple",
            {
              data: classStudentId,
            }
          );
          if (err) {
            // toast.error(`The ${code} class was deleted fail`);
            showErrorMessage(err);
            setLoadingData(false);

            return;
          } else {
            toast.success(`The ${code} class was deleted successfully`);
            setLoadingData(false);

            fetchData(searchParams);
          }
        }
      });
  };

  const handleChangeStatus = async (optionId, status) => {
    const userIdArr = [];
    userIdArr.push(optionId);
    const statusLabel =
      status === 0
        ? "cancelled"
        : status === 1
        ? "started"
        : status === 2
        ? "pending"
        : "unknown";
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to ${statusLabel} ${code} class ? ${
          status === 1 &&
          `You can not change student, delete or choose leader of ${code} class!!!`
        }`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
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
            `/Class/UpdateStatus?status=${status}`,
            userIdArr
          );
          if (err) {
            toast.error(`The ${code} class was ${statusLabel} fail`);
            setLoadingStatus(-1);
            return;
          } else {
            toast.success(`The ${code} class was ${statusLabel} successfully`);
            setLoadingStatus(-1);
            fetchData(searchParams);
          }
        }
      });
  };
  return (
    <>
      <div className="d-flex bd-highlight mx-auto">
        <Tooltip
          title="Details"
          className="action_space"
          placement="top"
          color="#ffc107"
          size="large"
        >
          <div>
            <BaseButton
              icon={<EditOutlined />}
              variant="outline"
              nameTitle="px-2 py-1"
              color="warning"
              onClick={onClick === undefined ? () => setModal(!modal) : onClick}
            />
          </div>
        </Tooltip>
        {option.status === 1 ? (
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
                  disabled={IsTeacher()}
                  variant="outline"
                  nameTitle="px-2 py-1"
                  icon={<LoadingOutlined />}
                />
              ) : (
                <BaseButton
                  icon={<StopOutlined />}
                  variant="outline"
                  disabled={IsTeacher()}
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
              title="Pending"
              className="action_space"
              placement="top"
              color="#ec8550"
              size="large"
            >
              <div>
                {loadingStatus === 2 ? (
                  <BaseButton
                    color="pending"
                    disabled={IsTeacher()}
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    icon={<PauseCircleOutlined />}
                    variant="outline"
                    disabled={IsTeacher()}
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
              title="Started"
              className="action_space"
              placement="top"
              color="#198754"
              size="large"
            >
              <div>
                {loadingStatus === 1 ? (
                  <BaseButton
                    color="success"
                    disabled={IsTeacher()}
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    icon={<PoweroffOutlined />}
                    variant="outline"
                    disabled={IsTeacher()}
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
              title="Started"
              className="action_space"
              placement="top"
              color="#198754"
              size="large"
            >
              <div>
                {loadingStatus === 1 ? (
                  <BaseButton
                    color="success"
                    disabled={IsTeacher()}
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    icon={<PoweroffOutlined />}
                    variant="outline"
                    disabled={IsTeacher()}
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
              title="Delete"
              placement="top"
              className="action_space"
              color="#dc3545"
              size="large"
            >
              <div>
                {loadingData ? (
                  <BaseButton
                    color="danger"
                    disabled={IsTeacher()}
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    color="danger"
                    disabled={IsTeacher()}
                    variant="outline"
                    nameTitle="px-2 py-1"
                    onClick={() => handleDelete(option.class_id)}
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
