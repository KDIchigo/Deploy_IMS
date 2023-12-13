import React, { useState } from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { UserDetails } from "../../UserDetails/UserDetails";
import { axiosClient } from "src/axios/AxiosClient";
import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
export const ActionUser = ({
  userId,
  user,
  roles,
  fetchData,
  searchParams,
}) => {
  const [modal, setModal] = useState(false);

  const handleChangeStatus = async (userId, status) => {
    const userIdArr = [];
    userIdArr.push(userId);
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to update user status",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then( async (result) => {
      console.log(result)
      if(result.isConfirmed) {
        const { data, err } = await axiosClient.post(
          `/User/UpdateStatus?status=${status}`,
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
      {/* <BaseButton
        value="Details"
        nameTitle="actionRight p-1 orangeBtn"
        onClick={() => setModal(!modal)}
      />
      {user.status === 1 ? (
        <BaseButton
          value="Inactive"
          nameTitle="actionLeft inactiveBtn p-1 ps-1 pe-3"
          onClick={() => handleChangeStatus(userId, 0)}
        />
      ) : (
        ""
      )}
      {user.status === 0 ? (
        <BaseButton
          value="Active"
          nameTitle="actionLeft activeBtn p-1 ps-1 pe-4"
          onClick={() => handleChangeStatus(userId, 1)}
        />
      ) : (
        ""
      )} */}
      <ToastContainer autoClose="2000" theme="colored" />
      <div className="d-flex justify-content-around">
        <Tooltip title="Details" placement="top" color="#ffc107" size="large">
          <div>
            <BaseButton
              icon={<EditOutlined />}
              variant="outline"
              nameTitle="px-3 py-1"
              color="warning"
              onClick={() => setModal(!modal)}
            />
          </div>
        </Tooltip>
        {user.status === 1 ? (
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
                nameTitle="px-3 py-1"
                onClick={() => handleChangeStatus(userId, 0)}
              />
            </div>
          </Tooltip>
        ) : (
          ""
        )}
        {user.status === 0 ? (
          <Tooltip title="Active" placement="top" color="#198754" size="large">
            <div>
              <BaseButton
                icon={<SettingOutlined />}
                variant="outline"
                color="success"
                nameTitle="px-3 py-1"
                onClick={() => handleChangeStatus(userId, 1)}
              />
            </div>
          </Tooltip>
        ) : (
          ""
        )}

        <UserDetails
          roles={roles}
          modal={modal}
          setModal={setModal}
          user={user}
          fetchData={fetchData}
          searchParams={searchParams}
        />
      </div>
    </>
  );
};
