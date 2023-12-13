import {
  DeleteOutlined,
  EditOutlined,
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
import { IssueSettingDetails } from "src/components/IssueSetting/IssueSettingDetails/IssueSettingDetails";
import { StatusEnum } from "src/enum/Enum";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { SystemSettingDetails } from "src/pages/SystemSettingListPage/components/SystemSettingDetails/SystemSettingDetails";
import { UserDetails } from "src/pages/UserListPage/components/UserDetails/UserDetails";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
const status = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 0,
    label: "Inactive",
  },
];
export const BaseAction = ({
  option,
  optionId,
  modalCmpt,
  subjectId,
  id,
  roles,
  settings,
  milestones,
  assignments,
  fetchData,
  searchParams,
  dataGroup,
  type,
  typeMilestone,
  onClick,
  selectType,
  typeIssue,
  selectTypeIssue,
  issueGroup,
  classMilestones,
  code,
  issue_setting,
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
        text: `Are you sure to delete the ${code} ${type} ?`,
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
            `${type}/DeleteMultiple`,
            {
              data: Id,
            }
          );
          if (err) {
            // toast.error(`The ${code} ${type} was deleted fail`);
            showErrorMessage(err);
            setLoadingData(false);
            return;
          } else {
            toast.success(`The ${code} ${type} was deleted successfully`);
            setLoadingData(false);
            fetchData(searchParams);
          }
        }
      });
    // console.log(err.response.data.Message);
  };
  const handleChangeStatus = async (type, optionId, status) => {
    const userIdArr = [];
    userIdArr.push(optionId);

    const statusLabel = status === 1 ? "active" : "inactive";

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to ${statusLabel} ${code} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${statusLabel} it!`,
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          setLoadingStatus(true);
          const { data, err } = await axiosClient.post(
            `/${type}/UpdateStatus?status=${status}`,
            userIdArr
          );

          if (err) {
            toast.error(`The ${code} was ${statusLabel} fail`);
            setLoadingStatus(false);
            return;
          } else {
            toast.success(`The ${code} was ${statusLabel} successfully`);
            setLoadingStatus(false);
            fetchData(searchParams);
          }
        }
      });
  };

  return (
    <>
      <div
        className={
          type === "Subject"
            ? "d-flex bd-highlight mx-auto"
            : "d-flex justify-content-around"
        }
      >
        <Tooltip
          title="Details"
          placement="top"
          color="#ffc107"
          size="large"
          className={type === "Subject" ? "action_space" : ""}
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
            title="Inactive"
            placement="top"
            className={type === "Subject" ? "action_space" : ""}
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
                    handleChangeStatus(type, optionId, StatusEnum.Inactive)
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
              title="Active"
              placement="top"
              className={type === "Subject" ? "action_space" : ""}
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
                      handleChangeStatus(type, optionId, StatusEnum.Active)
                    }
                  />
                )}
              </div>
            </Tooltip>
            {type === "Subject" ? (
              <Tooltip
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
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}

        {type === "User" ? (
          <UserDetails
            roles={roles}
            modal={modal}
            setModal={setModal}
            user={option}
            fetchData={fetchData}
            searchParams={searchParams}
            code={code}
          />
        ) : (
          ""
        )}
        {type === "ClassStudent" ? (
          <UserDetails
            roles={roles}
            modal={modal}
            setModal={setModal}
            user={option}
            fetchData={fetchData}
            searchParams={searchParams}
            code={code}
          />
        ) : (
          ""
        )}
        {type === "Setting" ? (
          <SystemSettingDetails
            modal={modal}
            settings={settings}
            setModal={setModal}
            setting={option}
            fetchData={fetchData}
            searchParams={searchParams}
            dataGroup={dataGroup}
            code={code}
          />
        ) : (
          ""
        )}
        {/* {type === "IssueSetting" ? (
          <IssueSettingDetails
            modal={modal}
            setModal={setModal}
            issueSetting={option}
            fetchData={fetchData}
            searchParams={searchParams}
            id={id}
            typeIssue={typeIssue}
            selectTypeIssue={selectTypeIssue}
            issueGroup={issueGroup}
            classMilestones={classMilestones}
            code={code}
          />
        ) : (
          ""
        )} */}
      </div>
    </>
  );
};
