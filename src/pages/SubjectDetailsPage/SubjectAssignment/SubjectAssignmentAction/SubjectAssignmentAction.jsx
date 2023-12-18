import {
  DeleteOutlined,
  LoadingOutlined,
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
import { SubjectAssignmentDetails } from "../SubjectAssignmentDetails/SubjectAssignmentDetails";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const SubjectAssignmentAction = ({
  optionId,
  fetchData,
  searchParams,
  subjectId,
  assignments,
  option,
  code,
}) => {
  const [modal, setModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const handleDelete = async (id) => {
    const Id = [];
    Id.push(id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete the ${code} subject assignment ?`,
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
            `Assignment/DeleteMultiple`,
            {
              data: Id,
            }
          );
          if (err) {
            // toast.error(`The ${code} subject assignment was deleted fail`);
            showErrorMessage(err);
            setLoadingData(false);
            return;
          } else {
            toast.success(
              `The ${code} subject assignment was deleted successfully`
            );
            setLoadingData(false);
            fetchData(searchParams);
          }
        }
      });
    // console.log(err.response.data.Message);
  };
  const handleChangeStatus = async (assignmentId, status) => {
    const assignmentIdArr = [];
    assignmentIdArr.push(assignmentId);
    const statusLabel = status === 1 ? "active" : "inactive";
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to ${statusLabel} ${code} assignment ?`,
        icon: "warning",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Yes,update it!",
        cancelButtonText: "No, cancel!",
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          setLoadingStatus(true);
          const { err } = await axiosClient.post(
            `/Assignment/UpdateStatus?status=${status}`,
            assignmentIdArr
          );

          if (err) {
            toast.error(`The ${code} assignment was ${statusLabel} fail`);
            setLoadingStatus(false);
            return;
          } else {
            toast.success(
              `The ${code} assignment was ${statusLabel} successfully`
            );
            setLoadingStatus(false);
            fetchData(searchParams);
          }
        }
      });
  };

  return (
    <>
      <div className="d-flex bd-highlight mx-auto">
        <SubjectAssignmentDetails
          modal={modal}
          setModal={setModal}
          assignment={option}
          fetchData={fetchData}
          searchParams={searchParams}
          subjectId={subjectId}
          code={code}
          // assignments={assignments}
        />

        {option.status === 0 && (
          <>
            <Tooltip
              title="Activate"
              className="action_space"
              placement="top"
              color="#198754"
              size="large"
            >
              <div>
                {loadingStatus ? (
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
              title="Delete"
              className="action_space"
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

        {option.status === 1 && (
          <>
            <Tooltip
              title="Deactivate"
              className="action_space"
              placement="top"
              color="#dc3545"
              size="large"
            >
              <div>
                {loadingStatus ? (
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
          </>
        )}
      </div>
    </>
  );
};
