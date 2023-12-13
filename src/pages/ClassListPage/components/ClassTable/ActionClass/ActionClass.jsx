import { EditOutlined, MoreOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";

export const ActionClass = ({ classId, fetchData, searchParams, classObj }) => {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const handleChangeStatus = async (classId, status) => {
    const classIdArr = [];
    classIdArr.push(classId);
    const { data, err } = await axiosClient.post(
      `/Class/UpdateStatus?status=${status}`,
      classIdArr
    );
    if (err) {
      window.alert("Change fail!");
      return;
    } else {
      window.alert("Change Successful!");
      fetchData(searchParams);
    }
  };
  return (
    <>
      {/* <BaseButton
        value="Details"
        nameTitle="actionRight p-1 orangeBtn"
        onClick={() => navigate(`/class-details-general/${classId}`)}
      />
      {classObj.status === 1 ? <BaseButton value="Inactive" nameTitle="actionLeft inactiveBtn p-1 ps-1 pe-3" onClick={() => handleChangeStatus(classId, 0)}/> : ''}
      {classObj.status === 0 ? <BaseButton value="Active" nameTitle="actionLeft activeBtn p-1 ps-1 pe-4"  onClick={() => handleChangeStatus(classId, 1)}/> : ''} */}
      <div className="d-flex justify-content-around">
        <Tooltip title="Details" placement="top" color="#ffc107" size="large">
          <div>
            <BaseButton
              icon={<EditOutlined />}
              variant="outline"
              nameTitle="px-2 py-1"
              color="warning"
              onClick={() => navigate(`/class-details/${classId}`)}
            />
          </div>
        </Tooltip>
        {classObj.status === 1 ? (
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
                onClick={() => handleChangeStatus(classId, 0)}
              />
            </div>
          </Tooltip>
        ) : (
          ""
        )}
        {classObj.status === 0 ? (
          <Tooltip title="Active" placement="top" color="#198754" size="large">
            <div>
              <BaseButton
                icon={<SettingOutlined />}
                variant="outline"
                color="success"
                nameTitle="px-2 py-1"
                onClick={() => handleChangeStatus(classId, 1)}
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
