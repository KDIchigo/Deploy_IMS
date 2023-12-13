import {
  EditOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";
import { swalWithBootstrapButtons } from "src/enum/swal";
export const IssueTypeAction = ({
  option,
  optionId,
  issues,
  students,
  issueType,
  fetchData,
  searchParams,
  onClick,
  milestones,
  issueSettings,
  issueId,
  projectId,
}) => {
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const handleChangeStatus = async (optionId, status) => {
    const userIdArr = [];
    userIdArr.push(optionId);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to update Issue Status?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoadingStatus(true);
          const { data, err } = await axiosClient.post(
            `/Issue/UpdateStatus?status=${status}`,
            userIdArr
          );

          if (err) {
            toast.error("Change status fail!");
            setLoadingStatus(false);
            return;
          } else {
            toast.success("Change status Successful!");
            setLoadingStatus(false);
            fetchData(searchParams);
          }
        }
      });
  };
  return (
    <>
      <div className="d-flex justify-content-around">
        <Tooltip title="Details" placement="top" color="#ffc107" size="large">
          <div>
            <BaseButton
              icon={<EditOutlined />}
              variant="outline"
              nameTitle="px-2 py-1"
              color="warning"
              onClick={() =>
                navigate(`/issue-details/${optionId}/${projectId}`)
              }
            />
          </div>
        </Tooltip>
        {option.status === 1 ? (
          <Tooltip
            title="Inactive"
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
                  icon={<SettingOutlined />}
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
          <Tooltip title="Active" placement="top" color="#198754" size="large">
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
                  icon={<SettingOutlined />}
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
        ) : (
          ""
        )}

        {/* <IssueTypeDetails
          modal={modal}
          toggle={toggle}
          issue={option}
          fetchData={fetchData}
          searchParams={searchParams}
        /> */}
      </div>
    </>
  );
};
