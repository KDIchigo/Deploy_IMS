import {
  FilePptOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import { Avatar, Badge, Space } from "antd";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "src/axios/AxiosClient";
import { ModalCmpt } from "src/components/Modal/ModalCmpt";
import { LogoutWithGoogle } from "src/pages/UserLoginPage/components/LogoutWithGoogle/LogoutWithGoogle";
import ChangePassword from "src/pages/UserProfilePage/components/ChangePassword/ChangePassword";
import { HandleAuth } from "src/utils/handleAuth";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export const NavBarAvatar = ({user}) => {
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

  // useEffect(() => {
  //   fetchData();
  // }, []);
  return (
    <div
      className="float-end me-4 position-relative"
      style={{ height: "65px" }}
    >
      {/* {console.log(user)} */}
      <Space size={24} className="p-0">
        {/* <Badge dot offset={[-4, 4]}> */}
        {loading && (
          <Avatar
            shape="circle"
            className="iconNavbarBtn"
            onClick={handleClick}
            icon={<UserOutlined className="position-relative" />}
            src={user.avatar === null ? undefined : user.avatar}
          />
        )}
        {/* </Badge> */}
      </Space>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => navigate("/user-profile")} disableRipple>
          <ProfileOutlined className="me-3" />
          Profile
        </MenuItem>
        <MenuItem onClick={toggleChangePass} disableRipple>
          <UnlockOutlined className="me-3" />
          Change pass
        </MenuItem>

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
        {/* <MenuItem onClick={handleClose} disableRipple>
          <FileCopyIcon />
          Duplicate
        </MenuItem> */}
        <Divider sx={{ my: 0.2 }} />
        {/* <MenuItem onClick={handleClose} disableRipple>
          <ArchiveIcon />
          Archive
        </MenuItem> */}
        {login === "google" ? (
          <MenuItem disableRipple>
            <LogoutWithGoogle />
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/sign-in");
            }}
            disableRipple
          >
            <LogoutOutlined className="me-3" />
            Logout
          </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
};
