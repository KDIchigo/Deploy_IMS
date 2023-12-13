import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PoweroffOutlined,
  SettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { IssueSettingDetails } from "../IssueSettingDetails/IssueSettingDetails";

export const IssueSettingsAction = ({
  fetchData,
  searchParams,
  option,
  id,
  typeIssue,
  optionId,
  code,
  selectTypeIssue,
  issueGroup,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const handleDelete = async (id) => {
    const Id = [];
    Id.push(id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete the issue setting named ${code}  ?`,
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
            `IssueSetting/DeleteMultiple`,
            {
              data: Id,
            }
          );
          if (err) {
            toast.error(`The issue setting named ${code} was deleted fail`);
            setLoadingData(false);
            return;
          } else {
            toast.success(
              `The issue setting named ${code} was deleted successfully`
            );
            setLoadingData(false);
            fetchData(searchParams);
          }
        }
      });
    // console.log(err.response.data.Message);
  };
  const handleChangeStatus = async (settingId, status) => {
    const userIdArr = [];
    userIdArr.push(settingId);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to update update issue setting status?`,
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
            `/IssueSetting/UpdateStatus?status=${status}`,
            userIdArr
          );

          if (err) {
            toast.error("Change status fail!");
            setLoadingStatus(false);
            return;
          } else {
            toast.success("Change status successfully!");
            setLoadingStatus(false);
            fetchData(searchParams);
          }
        }
      });
  };
  return (
    <>
      <div className="d-flex justify-content-around">
        <IssueSettingDetails
          issueSetting={option}
          fetchData={fetchData}
          searchParams={searchParams}
          id={id}
          typeIssue={typeIssue}
          selectTypeIssue={selectTypeIssue}
          issueGroup={issueGroup}
          code={code}
        />
        {option.status === 1 && (
          <Tooltip
            className="action_space"
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
                  icon={<StopOutlined />}
                  variant="outline"
                  color="danger"
                  nameTitle="px-2 py-1"
                  onClick={() =>
                    handleChangeStatus(optionId, StatusEnum.Inactive)
                  }
                  disabled={
                    typeIssue === "project" &&
                    (option.inherited_from === 1 ||
                      option.inherited_from === 2 ||
                      option.class_id ||
                      option.project_id === null)
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
              title="Active"
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
                    disabled={
                      typeIssue === "project" &&
                      (option.inherited_from === 1 ||
                        option.inherited_from === 2 ||
                        option.class_id ||
                        option.project_id === null)
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
                    disabled={
                      typeIssue === "project" &&
                      (option.inherited_from === 1 ||
                        option.inherited_from === 2 ||
                        option.class_id ||
                        option.project_id === null)
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
