import {
  CodeOutlined,
  DashboardOutlined,
  GroupOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu, Spin, Tag, theme } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavBarAvatar } from "./NavbarAvatar/NavBarAvatar";
import "./NavbarDashboard.scss";
import { AuthoNavbarRoutes } from "src/routes/AuthoNavbarRoutes";
import { Role } from "src/enum/Role";
import { HandleAuth } from "src/utils/handleAuth";
import { BaseButton } from "../Base/BaseButton/BaseButton";
import { axiosClient } from "src/axios/AxiosClient";
import { LogoutWithGoogle } from "src/pages/UserLoginPage/components/LogoutWithGoogle/LogoutWithGoogle";
import { NavBarAvatarDemo } from "./NavbarAvatar/NavbarAvatarDemo";
import { ToastContainer } from "react-toastify";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const NavbarDashboard = ({
  dashboardBody,
  position,
  spin,
  defaultOpenKeys,
  projectId,
}) => {
  const login = localStorage.getItem("login");
  const { currentUser } = HandleAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { itemNavbar, itemNavbarChild } = AuthoNavbarRoutes();
  const { IsStudent } = HandleAuth();
  const navigate = useNavigate();
  const items = [
    {
      type: "divider",
    },
    // getItem("User Management", "user", <UserOutlined />),
    // getItem("Subject Management", "subject", <ReadOutlined />),
    // getItem("Class Management", "class", <GroupOutlined />),
    // getItem("Project Management", "project", <ProjectOutlined />),
    // getItem("Issue Management", "issue", <CodeOutlined />),
    // getItem("System Setting Management", "setting", <SettingOutlined />),
  ];
  // itemNavbar(
  //   items,
  //   "Dashboard",
  //   "dashboard",
  //   null,
  //   [Role.Student, Role.Teacher, Role.Manager, Role.Admin],
  //   [
  //     itemNavbarChild("Dashboard", "user_dashboard", <DashboardOutlined />, [
  //       Role.Student,
  //       Role.Teacher,
  //       Role.Manager,
  //       Role.Admin,
  //     ]),
  //   ],
  //   "group"
  // );
  itemNavbar(items, "Dashboard", "user_dashboard", <DashboardOutlined />, [
    Role.Student,
    Role.Teacher,
    Role.Manager,
    Role.Admin,
  ]);

  // items.push({
  //   type: "divider",
  // });
  itemNavbar(items, null, null, null, [Role.Admin], null, "divider");
  itemNavbar(
    items,
    "ADMIN",
    "admin",
    null,
    [Role.Admin],
    [
      itemNavbarChild("User", "user", <UserOutlined />, [Role.Admin]),
      itemNavbarChild("System Setting", "setting", <SettingOutlined />, [
        Role.Admin,
      ]),
    ],
    "group"
  );
  itemNavbar(items, "Subject", "subject", <ReadOutlined />, [
    Role.Manager,
    Role.Admin,
  ]);
  // itemNavbar(items, "User Dashboard", "user_dashboard", <DashboardOutlined />, [
  //   Role.Student,
  //   Role.Teacher,
  //   Role.Manager,
  //   Role.Admin,
  // ]);

  itemNavbar(items, "Class", "class", <GroupOutlined />, [
    Role.Teacher,
    Role.Manager,
    Role.Admin,
  ]);

  items.push({
    type: "divider",
  });
  itemNavbar(
    items,
    "USERS",
    "users",
    null,
    [Role.Student, Role.Teacher, Role.Manager, Role.Admin],
    [
      defaultOpenKeys === "project-details-student" && IsStudent()
        ? ""
        : itemNavbarChild("Project", "project", <ProjectOutlined />, [
            Role.Student,
            Role.Teacher,
            Role.Manager,
            Role.Admin,
          ]),
      defaultOpenKeys === "project-details-student" &&
        itemNavbarChild(
          "Project",
          "project-details-student",
          <ProjectOutlined />,
          [Role.Student],
          [
            itemNavbarChild("General", "project-student-general", null, [
              Role.Student,
            ]),
            itemNavbarChild("Member", "project-student-member", null, [
              Role.Student,
            ]),
            itemNavbarChild("Milestones", "project-student-milestones", null, [
              Role.Student,
            ]),
            itemNavbarChild("Settings", "project-student-settings", null, [
              Role.Student,
            ]),
          ]
        ),
      itemNavbarChild("Issue", "issue", <CodeOutlined />, [
        Role.Student,
        Role.Teacher,
        Role.Manager,
        Role.Admin,
      ]),
    ],
    "group"
  );
  // itemNavbar(items, "ProjectDetails", "project-student", <ProjectOutlined />, [
  //   Role.Student,
  //   Role.Teacher,
  //   Role.Manager,
  //   Role.Admin,
  // ]);

  items.push({
    type: "divider",
  });
  login === "google"
    ? itemNavbar(items, "", "logout", <LogoutWithGoogle />, [
        Role.Student,
        Role.Teacher,
        Role.Manager,
        Role.Admin,
      ])
    : itemNavbar(items, "Logout", "logout", <LogoutOutlined />, [
        Role.Student,
        Role.Teacher,
        Role.Manager,
        Role.Admin,
      ]);

  const handleBreakpoint = () => {
    // Define your breakpoint logic here
    const isSmallScreen = window.innerWidth <= 1168; // Adjust the breakpoint as needed
    // console.log(isSmallScreen, window.innerWidth);
    setCollapsed(isSmallScreen);
  };
  const fetchData = async () => {
    const { data } = await axiosClient.get(`User/${currentUser.user_id}`);
    setUser(data);
    setLoading(true);
    // console.log(data);
  };

  useEffect(() => {
    // Initial check and add event listener
    handleBreakpoint();
    window.addEventListener("resize", handleBreakpoint);
    fetchData();
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleBreakpoint);
    };
  }, []);

  // const fetchData = async () => {
  //   const { data } = await axiosClient.get(`User/${currentUser.user_id}`);
  //   setUser(data);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  const onClick = (e) => {
    e.key === "user_dashboard" && navigate("/user-dashboard");
    e.key === "user" && navigate("/user-list");
    e.key === "setting" && navigate("/system-setting-list");
    e.key === "subject" && navigate("/subject-list");
    e.key === "class" && navigate("/class-list");
    e.key === "project" && navigate("/project-list");
    e.key === "project-student-general" &&
      navigate(`/project-details/${projectId}`);
    e.key === "project-student-member" &&
      navigate(`/project-details-member/${projectId}`);
    e.key === "project-student-milestones" &&
      navigate(`/project-details-milestones/${projectId}`);
    e.key === "project-student-settings" &&
      navigate(`/project-details-settings/${projectId}`);
    e.key === "issue" && navigate("/issue-list");
    if (e.key === "logout") {
      localStorage.removeItem("token");
      navigate("/sign-in");
    }
  };
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  return (
    <>
      <ToastContainer autoClose="5000" theme="colored" />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ec8550f0",
            fontFamily: "source-sans-pro, sans-serif",
          },
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Layout: {
                triggerBg: "none",
                triggerColor: "black",
              },
            },
          }}
        >
          <Layout hasSider>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
              width="260px"
              className="siderDashboard"
              style={{
                // overflow: "auto",
                backgroundColor: "#dddddd",
                position: "fixed",
                // position: fixed !== false ? "" : "fixed",
                border: "1px solid #ffffff",
                left: 0,
                top: 0,
                bottom: 0,
                height: "100vh",
              }}
            >
              <div className="demo-logo-vertical" />
              {/* <div className="main-sidebar-header">
          
        </div> */}

              <div
                className={
                  collapsed
                    ? "logoDashboard d-flex position-fixed widthUnCollapse"
                    : "logoDashboard d-flex position-fixed widthCollapse"
                }
              >
                {collapsed ? (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2FLogo_IMS_Navbar.png?alt=media&token=8e7fd484-6344-4498-9d4d-878db9a61473"
                    className="toggle-dark logoIMS"
                    alt="logo"
                  ></img>
                ) : (
                  <>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2FLogo_IMS_Navbar.png?alt=media&token=8e7fd484-6344-4498-9d4d-878db9a61473"
                      className="toggle-dark logoIMS"
                      alt="logo"
                    ></img>
                    <strong style={{ fontSize: 25 }} className="pt-3">IMS</strong>
                  </>
                )}
              </div>

              <Menu
                onClick={onClick}
                mode="inline"
                defaultSelectedKeys={[position]}
                items={items}
                defaultOpenKeys={[defaultOpenKeys]}
                style={{
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif !important",
                  backgroundColor: "#dddddd",
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  paddingTop: "62px",
                  height: "100vh",
                  fontSize: "16px",
                }}
              ></Menu>

              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: "9999",
                }}
              >
                <BaseButton
                  color="light"
                  variant="outline"
                  value="Help"
                  isIconLeft={true}
                  nameTitle="btnHelpNav"
                  icon={
                    <QuestionCircleOutlined
                      style={{ fontSize: "17px", paddingRight: "3px" }}
                    />
                  }
                />
              </div>
            </Sider>

            <Layout
              className="site-layout"
              style={{
                marginLeft: collapsed ? 80 : 260,
                transition: "all 0.2s",
                minHeight: "100vh",
              }}
            >
              <Header
                className="headerDashboard"
                style={{
                  position: "sticky",
                  display: "flex",
                  borderLeft: "0.5px solid rgba(5, 5, 5, 0.2)",
                }}
              >
                <div className="col-5" style={{ display: "flex" }}>
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => {
                      setCollapsed(!collapsed);
                      // setFixed(!fixed);
                      // setMgLeft(!mgLeft);
                    }}
                    style={{
                      fontSize: "16px",
                      width: 64,
                      height: 64,
                    }}
                  />

                  <Tag className="tagRole">
                    <span className="position-absolute top-50 start-0 translate-middle-y p-1 bg-success border border-light rounded-circle ms-3"></span>
                    <h6 className="m-auto">{currentUser.role}</h6>
                  </Tag>
                </div>
                <div className="col-7 float-end">
                  {" "}
                  {loading && (
                    <>
                      {/* <NavBarAvatar user={user} /> */}
                      <NavBarAvatarDemo user={user} />
                    </>
                  )}
                </div>
              </Header>
              {spin ? (
                <Content className="navbarContent">{dashboardBody}</Content>
              ) : (
                <Spin
                  tip="Loading"
                  size="large"
                  className="d-flex flex-column"
                  style={{ minHeight: "calc(100vh - 65px)" }}
                >
                  <Content className="navbarContent">
                    <div
                      className="d-flex flex-column flexGrow_1"
                      style={{
                        backgroundColor: "white",
                        minHeight: "calc(100vh - 65px)",
                      }}
                    ></div>
                  </Content>
                </Spin>
              )}

              {/* <Footer
              style={{
                textAlign: "center",
              }}
            >
              Welcome to IMS!
            </Footer> */}
            </Layout>
          </Layout>
        </ConfigProvider>
      </ConfigProvider>
    </>
  );
};
