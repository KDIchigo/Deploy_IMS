import { Affix } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./LandingPage.scss";
import ScrollSpy from "react-ui-scrollspy";
import { axiosClient } from "src/axios/AxiosClient";
import {
  IssuesCloseOutlined,
  ProfileOutlined,
  ReadOutlined,
  TableOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";

export const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);

  const fetchData = async () => {
    const { data: userArr } = await axiosClient.post(
      "/User/GetFilterData?sortString=created_date ASC",
      []
    );
    setUsers(userArr);

    const { data: classArr } = await axiosClient.post(
      `/Class/GetFilterData?sortString=created_date ASC`,
      []
    );
    setClasses(classArr);

    const { data: subjectArr } = await axiosClient.post(
      "/Subject/GetFilterData?sortString=created_date ASC",
      []
    );
    setSubjects(subjectArr);

    const { data: projectArr } = await axiosClient.post(
      `/Project/GetFilterData?sortString=created_date ASC`,
      []
    );
    setProjects(projectArr);

    const { data: issueArr } = await axiosClient.post(
      `/Issue/GetFilterData?sortString=created_date ASC`,
      []
    );
    setIssues(issueArr);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [navItems, setNavItems] = useState([
    {
      id: 1,
      name: "Home",
      active: false,
      href: "#home",
      scrollspy: "home",
    },
    {
      id: 2,
      name: "Statistics",
      active: false,
      href: "#statistics",
      scrollspy: "statistics",
    },
    {
      id: 3,
      name: "About",
      active: false,
      href: "#about",
      scrollspy: "about",
    },
    {
      id: 4,
      name: "Features",
      active: false,
      href: "#features",
      scrollspy: "features",
    },
    {
      id: 44,
      name: "Our Mission",
      active: false,
      href: "#our-mission",
      scrollspy: "our-mission",
    },
  ]);

  const [members, setMembers] = useState([
    {
      id: 1,
      image: "",
      name: "Nguyen Ha Dung",
      role: "Developer",
      className: "col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12",
      description: "",
    },
    {
      id: 2,
      image: "",
      name: "Hoang Thi Thanh Thao",
      role: "Leader",
      className: "col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12",
      description: "",
    },
    {
      id: 3,
      image: "",
      name: "Kieu Thi Bich Nguyet",
      role: "Developer",
      className: "col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12",
      description: "",
    },
    {
      id: 4,
      image: "",
      name: "Bui Quang Hieu",
      role: "Developer",
      className: "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12",
      description: "",
    },
    {
      id: 5,
      image: "",
      name: "Tran Dinh Nguyen",
      role: "BA",
      className: "col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12",
      description: "",
    },
  ]);

  return (
    <>
      <div className="landing-body">
        <div className="landing-page-wrapper">
          <Affix className="fixed-top">
            <div
              className="row shadow rounded"
              style={{
                backgroundColor: "white",
                height: "80px",
              }}
            >
              <div className="col-3">a</div>
              <Nav className="col-6 main-menu my-auto">
                {navItems.map((navItem, index) => (
                  <NavItem key={navItem.id}>
                    <NavLink
                      data-to-scrollspy-id={navItem.scrollspy}
                      href={navItem.href}
                      active={navItem.active}
                      className="navBar__link"
                      onClick={() => {
                        // setNavItems(...navItems, {
                        //   id: navItem.id,
                        //   name: navItem.name,
                        //   active: true,
                        //   href: navItem.href,
                        // });
                      }}
                    >
                      {navItem.name}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <div className="x col-3 my-auto">
                <div className="btn-list d-lg-flex d-none mt-lg-2 mt-xl-0 mt-0">
                  {token === null ? (
                    <>
                      <Link
                        to="/sign-in"
                        className="btn btn-wave btn-danger mx-3"
                      >
                        Sign In
                      </Link>
                      <Link to="/register" className="btn btn-outline-danger">
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* <BaseButton
                        value="User Dashboard"
                        color="primary"
                        onClick={() => navigate("/user-dashboard")}
                      /> */}
                      <Link
                        onClick={() => localStorage.removeItem("token")}
                        className="btn btn-wave btn-danger"
                      >
                        Sign Out
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Affix>

          <div className="main-content landing-main">
            <ScrollSpy>
              <div className="landing-banner" id="home">
                <section className="section mt-3">
                  <div className="container main-banner-container">
                    <div className="row">
                      <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-8">
                        <div className="py-lg-5">
                          <div className="mb-3">
                            <h5 className="fw-semibold text-fixed-white op-9">
                              BRILLIANCE IN EXECUTION
                            </h5>
                          </div>
                          <p className="landing-banner-heading mb-3">
                            Your sure stop place for best theme ends here with{" "}
                            <span className="text-light">IMS !</span>
                          </p>
                          <div className="fs-16 mb-5 text-fixed-white op-7">
                            IMS - Now you can use this website to manage issues
                            and synchronize gitlab that will wow your target
                            viewers or users to no end.
                          </div>
                          <a
                            onClick={() =>
                              navigate(
                                token === null ? "/sign-in" : "/user-dashboard"
                              )
                            }
                            className="m-1 btn btn-danger"
                          >
                            Go to IMS
                            <i className="ri-eye-line ms-2 align-middle"></i>
                          </a>
                        </div>
                      </div>
                      <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-4">
                        <div className="text-end landing-main-image landing-heading-img">
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2F7.png?alt=media&token=9ea9e95d-a0d0-447b-8c11-6943ba936306"
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <section className="section section-bg " id="statistics">
                <div className="container text-center position-relative">
                  <p className="fs-12 fw-semibold text-success mb-1">
                    <span className="landing-section-heading">STATISTICS</span>
                  </p>
                  <h3 className="fw-semibold mb-2">
                    More than 120+ projects completed.
                  </h3>
                  <div className="row justify-content-center">
                    <div className="col-xl-7">
                      <p className="text-muted fs-15 mb-5 fw-normal">
                        We are proud to have top className clients and
                        customers,which motivates us to work more on projects.
                      </p>
                    </div>
                  </div>
                  <div className="row  g-2 justify-content-center">
                    <div className="col-xl-12">
                      <div className="row justify-content-evenly">
                        <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mb-3">
                          <div className="p-3 text-center rounded-2 bg-white border">
                            <span className="mb-3 avatar avatar-lg avatar-rounded bg-warning-transparent">
                              <UserOutlined />
                            </span>
                            <h3 className="fw-semibold mb-0 text-dark">
                              {users.length}+
                            </h3>
                            <p className="mb-1 fs-14 op-7 text-muted ">Users</p>
                          </div>
                        </div>
                        <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mb-3">
                          <div className="p-3 text-center rounded-2 bg-white border">
                            <span className="mb-3 avatar avatar-lg avatar-rounded bg-warning-transparent">
                              <ReadOutlined />
                            </span>
                            <h3 className="fw-semibold mb-0 text-dark">
                              {subjects.length}+
                            </h3>
                            <p className="mb-1 fs-14 op-7 text-muted ">
                              Subjects
                            </p>
                          </div>
                        </div>
                        <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mb-3">
                          <div className="p-3 text-center rounded-2 bg-white border">
                            <span className="mb-3 avatar avatar-lg avatar-rounded bg-warning-transparent">
                              <TableOutlined />
                            </span>
                            <h3 className="fw-semibold mb-0 text-dark">
                              {classes.length}+
                            </h3>
                            <p className="mb-1 fs-14 op-7 text-muted ">
                              Classes
                            </p>
                          </div>
                        </div>
                        <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mb-3">
                          <div className="p-3 text-center rounded-2 bg-white border">
                            <span className="mb-3 avatar avatar-lg avatar-rounded bg-warning-transparent">
                              <ProfileOutlined />
                            </span>
                            <h3 className="fw-semibold mb-0 text-dark">
                              {projects.length}+
                            </h3>
                            <p className="mb-1 fs-14 op-7 text-muted ">
                              Projects
                            </p>
                          </div>
                        </div>
                        <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mb-3">
                          <div className="p-3 text-center rounded-2 bg-white border">
                            <span className="mb-3 avatar avatar-lg avatar-rounded bg-warning-transparent">
                              <IssuesCloseOutlined />
                            </span>
                            <h3 className="fw-semibold mb-0 text-dark">
                              {issues.length}+
                            </h3>
                            <p className="mb-1 fs-14 op-7 text-muted ">
                              Issues
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section " id="about">
                <div className="container text-center">
                  <p className="fs-12 fw-semibold text-success mb-1">
                    <span className="landing-section-heading"></span>
                  </p>
                  <h3 className="fw-semibold mb-2">
                    Effective Issue Management
                  </h3>
                  <div className="row justify-content-center">
                    <div className="col-xl-7">
                      <p className="text-muted fs-15 mb-3 fw-normal">
                        The Issue Management System helps organizations
                        efficiently handle and oversee tasks or issues.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center align-items-center">
                  <div className="col-xxl-5 col-xl-5 col-lg-5 customize-image text-center">
                    <div className="text-lg-end">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2F8.png?alt=media&token=e1ecd8e9-f831-4a47-ac41-364a96f28ea9"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-xxl-5 col-xl-5 col-lg-5 pt-5 pb-0 px-lg-2 px-5 text-start">
                    <h5 className="text-lg-start fw-semibold mb-0">
                      Issue management is easier with IMS
                    </h5>
                    <p className=" text-muted">
                      The Issue Management System helps organizations
                      efficiently handle and oversee tasks or issues.
                    </p>
                    <div className="row">
                      <div className="col-12 col-md-12">
                        <div className="d-flex">
                          <span>
                            <i className="bx bxs-badge-check text-primary fs-18"></i>
                          </span>
                          <div className="ms-2">
                            <h6 className="fw-semibold mb-0">
                              Deadline Management
                            </h6>
                            <p className=" text-muted">
                              Ensures that critical tasks are addressed
                              promptly, preventing bottlenecks and delays in
                              project delivery.{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-12">
                        <div className="d-flex">
                          <span>
                            <i className="bx bxs-badge-check text-primary fs-18"></i>
                          </span>
                          <div className="ms-2">
                            <h6 className="fw-semibold mb-0">
                              Effortless GitLab Integration
                            </h6>
                            <p className=" text-muted">
                              Seamlessly synchronize with GitLab for enhanced
                              workflow efficiency.{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-12">
                        <div className="d-flex">
                          <span>
                            <i className="bx bxs-badge-check text-primary fs-18"></i>
                          </span>
                          <div className="ms-2">
                            <h6 className="fw-semibold mb-0">
                              Customization for Specific Project
                            </h6>
                            <p className=" text-muted">
                              The system allows for the customization of issue
                              statuses, issue types, and work processes to align
                              with specific project.{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="section landing-Features" id="features">
                <div className="container text-center">
                  <p className="fs-12 fw-semibold text-success mb-1">
                    <span className="landing-section-heading">Features</span>
                  </p>
                  <h2 className="fw-semibold mb-2 text-fixed-white ">
                    Features Used in IMS
                  </h2>
                  <div className="row justify-content-center">
                    <div className="col-xl-7">
                      <p className="text-fixed-white op-8 fs-15 mb-3 fw-normal">
                        Some of the reviews our clients gave which brings
                        motivation to work for future projects.
                      </p>
                    </div>
                  </div>
                  <div className="text-start">
                    <div className="justify-content-center">
                      <div className="">
                        <div className="feature-logos mt-sm-5 flex-wrap">
                          <div className="ms-sm-5 ms-2 text-center">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2F1.png?alt=media&token=b9549adf-2887-44dc-bf8a-7a735b62c67c"
                              alt="image"
                              className="featur-icon"
                            />
                            <h5 className="mt-3 text-fixed-white ">
                              Bootstrap5
                            </h5>
                          </div>
                          <div className="ms-sm-5 ms-2 text-center">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2F2.png?alt=media&token=3460021b-a770-4304-bf5b-a5aaa4e29ae3"
                              alt="image"
                              className="featur-icon"
                            />
                            <h5 className="mt-3 text-fixed-white ">HTML5</h5>
                          </div>
                          <div className="ms-sm-5 ms-2 text-center">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2F4.png?alt=media&token=22e6271b-4645-4297-a58c-4347ac3d12a4"
                              alt="image"
                              className="featur-icon"
                            />
                            <h5 className="mt-3 text-fixed-white ">Sass</h5>
                          </div>
                          <div className="ms-sm-5 ms-2 text-center">
                            <img
                              src="https://clipart-library.com/new_gallery/222-2225147_read-the-military-react-native-logo-white.png"
                              alt="image"
                              className="featur-icon"
                            />
                            <h5 className="mt-3 text-fixed-white ">React</h5>
                          </div>
                          <div className="ms-sm-5 ms-2 text-center">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2F6.png?alt=media&token=b4f60b45-f9de-4c24-9cb3-e1d7cc2667bf"
                              alt="image"
                              className="featur-icon"
                            />
                            <h5 className="mt-3 text-fixed-white ">NPM</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-pagination mt-4"></div>
                  </div>
                </div>
              </section>
              <section className="section section-bg " id="our-mission">
                <div className="container text-center">
                  <p className="fs-12 fw-semibold text-success mb-1">
                    <span className="landing-section-heading">OUR MISSION</span>
                  </p>
                  <h2 className="fw-semibold mb-2">
                    Our mission consists of 8 major goals.
                  </h2>
                  <div className="row justify-content-center mb-5">
                    <div className="col-xl-7">
                      <p className="text-muted fs-15 mb-5 fw-normal">
                        Our Issue Management System is driven by several key
                        missions, each aimed at enhancing efficiency,
                        collaboration, and decision-making within your workflow:
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded bg-primary-transparent">
                                <i className="bx bx-badge-check fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Effective Issue Management
                              </h6>
                              <p className="mb-0 text-muted">
                                Provide a powerful tool for efficiently managing
                                issues, from reception and recording to tracking
                                and resolution.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded bg-primary-transparent">
                                <i className="bx bx-file fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Workflow Optimization
                              </h6>
                              <p className="mb-0 text-muted">
                                Streamline processes related to issue management
                                to ensure that issues are resolved quickly and
                                effectively.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded  bg-primary-transparent">
                                <i className="bx bx-cog fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Tracking and Progress Monitoring
                              </h6>
                              <p className="mb-0 text-muted">
                                Provide tools to track the progress and status
                                of issues from the moment they are recorded to
                                their complete resolution.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded bg-primary-transparent">
                                <i className="bx bx-cloud-upload fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Reporting and Analytics
                              </h6>
                              <p className="mb-0 text-muted">
                                Enable the creation of reports and data analysis
                                related to issues, aiding decision-making based
                                on informed data.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded bg-primary-transparent">
                                <i className="bx bx-support fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Access Control and Permissions
                              </h6>
                              <p className="mb-0 text-muted">
                                Ensure that each user has access only to the
                                information and functionalities relevant to
                                their role.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded bg-primary-transparent">
                                <i className="bx bx-image fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Diverse Customization
                              </h6>
                              <p className="mb-0 text-muted">
                                Enable users to customize the issue type, issue
                                status, work process to align with their unique
                                project.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded bg-primary-transparent">
                                <i className="bx bx-compass fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Integration with GitLab
                              </h6>
                              <p className="mb-0 text-muted">
                                Enable effortless synchronization between the
                                issue management system and GitLab repositories.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div className="card custom-card text-start landing-missions">
                        <div className="card-body">
                          <div className="align-items-top">
                            <div className="mb-2">
                              <span className="avatar avatar-lg avatar-rounded bg-primary-transparent">
                                <i className="bx bx-desktop fs-25"></i>
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                User-Friendly Interface
                              </h6>
                              <p className="mb-0 text-muted">
                                Prioritize user experience by offering an
                                intuitive design, allowing users to quickly
                                locate and manage their tasks and issues.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="section landing-footer text-fixed-black">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-4">
                      <div className="px-4">
                        <p className="fw-semibold mb-3">
                          <a href="index.html">
                            {/* <img
                              src="../assets/images/brand-logos/desktop-dark.png"
                              alt=""
                            /> */}
                          </a>
                        </p>
                        <p className="mb-2 op-6 fw-normal text-fixed-black">
                          Introducing Our Issue Management System
                        </p>
                        <p className="mb-0 op-6 fw-normal text-fixed-black">
                          Streamline issue tracking, enhance collaboration, and
                          boost productivity with our powerful Issue Management
                          System. Seamlessly integrate with GitLab for
                          synchronized workflows. Stay agile, stay efficient.
                          Try it today!
                        </p>
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="px-4">
                        <h6 className="fw-semibold mb-3">PAGES</h6>
                        <ul className="list-unstyled op-6 fw-normal landing-footer-list">
                          <li>
                            <a href="#" className="text-fixed-black">
                              Email
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Profile
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Timeline
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Projects
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Contacts
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Portfolio
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="px-4">
                        <h6 className="fw-semibold">INFO</h6>
                        <ul className="list-unstyled op-6 fw-normal landing-footer-list">
                          <li>
                            <a href="#" className="text-fixed-black">
                              Our Team
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Contact US
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              About
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Services
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Blog
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black">
                              Terms & Conditions
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="px-4">
                        <h6 className="fw-semibold">CONTACT</h6>
                        <ul className="list-unstyled fw-normal landing-footer-list">
                          <li>
                            <a href="#" className="text-fixed-black op-6">
                              <i className="ri-home-4-line me-1 align-middle"></i>{" "}
                              New York, NY 10012, US
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black op-6">
                              <i className="ri-mail-line me-1 align-middle"></i>{" "}
                              info@fmail.com
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black op-6">
                              <i className="ri-phone-line me-1 align-middle"></i>{" "}
                              +(555)-1920 1831
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-fixed-black op-6">
                              <i className="ri-printer-line me-1 align-middle"></i>{" "}
                              +(123) 1293 123
                            </a>
                          </li>
                          <li className="mt-3">
                            <p className="mb-2 fw-semibold op-8">
                              FOLLOW US ON :
                            </p>
                            <div className="mb-0">
                              <div className="btn-list">
                                <button className="btn btn-sm btn-icon btn-primary-light btn-wave waves-effect waves-light">
                                  <i className="ri-facebook-line fw-bold"></i>
                                </button>
                                <button className="btn btn-sm btn-icon btn-secondary-light btn-wave waves-effect waves-light">
                                  <i className="ri-twitter-line fw-bold"></i>
                                </button>
                                <button className="btn btn-sm btn-icon btn-warning-light btn-wave waves-effect waves-light">
                                  <i className="ri-instagram-line fw-bold"></i>
                                </button>
                                <button className="btn btn-sm btn-icon btn-success-light btn-wave waves-effect waves-light">
                                  <i className="ri-github-line fw-bold"></i>
                                </button>
                                <button className="btn btn-sm btn-icon btn-danger-light btn-wave waves-effect waves-light">
                                  <i className="ri-youtube-line fw-bold"></i>
                                </button>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollSpy>
          </div>
        </div>

        <div className="scrollToTop">
          <span className="arrow">
            <i className="ri-arrow-up-s-fill fs-20"></i>
          </span>
        </div>
        <div id="responsive-overlay"></div>

        <script src="../assets/js/sticky.js"></script>
      </div>
    </>
  );
};
