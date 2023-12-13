import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { ClassSettingDetails } from "../ClassSettingDetails/ClassSettingDetails";

export const ClassSettingsAction = ({
  fetchData,
  searchParams,
  settingId,
  status,
  classSetting,
  issueGroup,
  classId,
}) => {
  const handleChangeStatus = async (settingId, status) => {
    const userIdArr = [];
    userIdArr.push(settingId);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to update update Status?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          const { data, err } = await axiosClient.post(
            `/IssueSetting/UpdateStatus?status=${status}`,
            userIdArr
          );

          if (err) {
            toast.error("Change fail!");
            return;
          } else {
            toast.success("Change Successful!");
            fetchData(searchParams);
          }
        }
      });
  };
  return (
    <>
      {/* {console.log(settingId)} */}
      <div className="d-flex justify-content-around">
        <ClassSettingDetails
          classSetting={classSetting}
          fetchData={fetchData}
          searchParams={searchParams}
          classId={classId}
          issueGroup={issueGroup}
        />
        {status === 1 ? (
          <Tooltip
            title="Inactive"
            placement="top"
            color="#dc3545"
            size="large"
          >
            <div>
              <BaseButton
                icon={<SettingOutlined />}
                variant="outline"
                color="danger"
                nameTitle="px-2 py-1"
                onClick={() =>
                  handleChangeStatus(settingId, StatusEnum.Inactive)
                }
              />
            </div>
          </Tooltip>
        ) : (
          ""
        )}
        {status === 0 ? (
          <Tooltip title="Active" placement="top" color="#198754" size="large">
            <div>
              <BaseButton
                icon={<SettingOutlined />}
                variant="outline"
                color="success"
                nameTitle="px-2 py-1"
                onClick={() => handleChangeStatus(settingId, StatusEnum.Active)}
              />
            </div>
          </Tooltip>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
