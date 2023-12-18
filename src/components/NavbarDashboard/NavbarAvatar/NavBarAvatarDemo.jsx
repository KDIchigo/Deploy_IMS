import {
  LogoutOutlined,
  ProfileOutlined,
  UnlockOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ModalCmpt } from "src/components/Modal/ModalCmpt";
import { LogoutWithGoogle } from "src/pages/UserLoginPage/components/LogoutWithGoogle/LogoutWithGoogle";
import ChangePassword from "src/pages/UserProfilePage/components/ChangePassword/ChangePassword";
import { HandleAuth } from "src/utils/handleAuth";

export const NavBarAvatarDemo = ({ user }) => {
  const navigate = useNavigate();
  const login = localStorage.getItem("login");
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalChangePass, setModalChangePass] = useState(false);
  const { currentUser } = HandleAuth();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const toggleChangePass = () => {
    setModalChangePass(!modalChangePass);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const fetchData = async () => {
  //   const { data } = await axiosClient.get(`User/${currentUser.user_id}`);
  //   setUser(data);
  //   setLoading(true);
  //   // console.log(data);
  // };

  const items = [
    {
      key: "1",
      label: (
        <a target="_blank" onClick={() => navigate("/user-profile")}>
          <ProfileOutlined className="me-2" /> Profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" onClick={toggleChangePass}>
          <UnlockOutlined className="me-2" />
          Change Pass
        </a>
      ),
    },
    {
      type: "divider",
    },
  ];
  if (login === "google") {
    items.push({
      key: "3",
      label: <LogoutWithGoogle />,
    });
  } else {
    items.push({
      key: "3",
      label: (
        <a
          target="_blank"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/sign-in");
          }}
        >
          <LogoutOutlined className="me-2" />
          Logout
        </a>
      ),
    });
  }

  // useEffect(() => {
  //   fetchData();
  // }, []);
  return (
    <div
      className="float-end me-4 position-relative"
      style={{ height: "65px" }}
    >
      <Dropdown menu={{ items }} trigger={["click"]} arrow>
        <Avatar
          shape="circle"
          className="iconNavbarBtn"
          onClick={handleClick}
          icon={<UserOutlined className="position-relative" />}
          src={user.avatar === null ? undefined : user.avatar}
        />
        {/* {console.log(user)} */}
      </Dropdown>
      <ModalCmpt
        classNameBtn="btn btn-light btn-wave waves-effect waves-light px-5 mt-5 my-auto"
        btnToggle="Change Password"
        isAnchor={false}
        variant="outline"
        isFooter={false}
        isHeader={false}
        modalBody={<ChangePassword />}
        isImage={true}
        imgSrc="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2Flogo2.png?alt=media&token=b4ff3656-1aba-482f-a1cd-ccc61885a5ea"
        size="md"
        type="button"
        toggle={toggleChangePass}
        modal={modalChangePass}
      />
    </div>
  );
};
