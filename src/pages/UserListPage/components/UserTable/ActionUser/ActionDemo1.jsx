import { MoreOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { UserDetails } from "../../UserDetails/UserDetails";

export const ActionDemo = ({ userId, user, roles, fetchData, searchParams }) => {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      label: <a onClick={() => setModal(!modal)}>Details</a>,
    },
    {
      key: "2",
      label: <a onClick={() => setModal(!modal)}>Inactive</a>,
    },
  ];
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomLeft"
        arrow
      >
        <MoreOutlined className="moreIcon" />
      </Dropdown>
      <UserDetails
        roles={roles}
        modal={modal}
        setModal={setModal}
        user={user}
        fetchData={fetchData}
        searchParams={searchParams}
      />
    </>
  );
};
