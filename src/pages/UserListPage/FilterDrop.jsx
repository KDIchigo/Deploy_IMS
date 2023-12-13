import {
  FilterOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import { Badge, Space } from "antd";
import * as React from "react";
import { useNavigate } from "react-router";

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

export const FilterDrop = ({icon, filterBody}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className="float-end me-4 position-relative"
      style={{ height: "65px" }}
    >
      <Space size={24} className="p-0">
        <FilterOutlined
          size={24}
          className="position-relative filterIcon"
          onClick={handleClick}
        />
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
        <form className="px-4 py-3" style={{ width: "300px" }}>
          <div className="form-group">
            <label htmlFor="exampleDropdownFormEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleDropdownFormEmail1"
              placeholder="email@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleDropdownFormPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleDropdownFormPassword1"
              placeholder="Password"
            />
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="dropdownCheck"
            />
            <label className="form-check-label" htmlFor="dropdownCheck">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>
        <div className="dropdown-divider"></div>
        <a className="dropdown-item" href="#">
          New around here? Sign up
        </a>
        <a className="dropdown-item" href="#">
          Forgot password?
        </a>
      </StyledMenu>
    </div>
  );
};
