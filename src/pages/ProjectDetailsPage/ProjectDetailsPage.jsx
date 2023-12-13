import { Tabs } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ProjectGeneral } from "./ProjectGeneral/ProjectGeneral";
import { axiosClient } from "src/axios/AxiosClient";
import { useEffect } from "react";
import { ConditionEnum } from "src/enum/Enum";
import { Box } from "@mui/material";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { Role } from "src/enum/Role";
import { HandleAuth } from "src/utils/handleAuth";
export const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const { IsStudent } = HandleAuth();
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [spin, setSpin] = useState(true);
  const [classes, setClasses] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchProjectParams, setSearchProjectParams] = useState([
    {
      field: "project_id",
      value: projectId,
      condition: ConditionEnum.Equal,
    },
  ]);

  const fetchData = async () => {
    const { data } = await axiosClient.get(`Project/${projectId}`);
    setProject(data);
    setLoadingData(true);
  };

  const fetchDataSelect = async () => {
    const { data: classArr } = await axiosClient.post(
      `/Class/GetFilterData?sortString=created_date ASC`,
      []
    );
    setClasses(classArr);

    const { data: studentArr, err } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      searchProjectParams
    );
    setStudents(studentArr);

    setLoadingSelect(true);
  };
  const onChange = (key) => {
    switch (key) {
      case "1":
        navigate(`/project-details/${projectId}`);
        break;
      case "2":
        navigate(`/project-details-member/${projectId}`);
        break;
      case "3":
        navigate(`/project-details-milestones/${projectId}`);
        break;
      case "4":
        navigate(`/project-details-settings/${projectId}`);
        break;
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataSelect();
  }, []);
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      <NavbarDashboard
        position={IsStudent() ? "project-student-general" : "project"}
        spin={loadingData && loadingSelect}
        defaultOpenKeys="project-details-student"
        projectId={projectId}
        dashboardBody={
          <>
            <AuthoComponentRoutes
              element={
                <Tabs
                  defaultActiveKey="1"
                  onChange={onChange}
                  type="card"
                  className="flex_height tabScreen"
                  items={[
                    {
                      label: "General",
                      children: (
                        <div className="flex_height">
                          <div className="card custom-card mb-0 flex_height">
                            <div className="card-body flex_height">
                              {loadingData && loadingSelect ? (
                                <ProjectGeneral
                                  project={project}
                                  fetchData={fetchData}
                                  classes={classes}
                                  students={students}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                      key: "1",
                    },
                    {
                      label: "Member",
                      children: (
                        <div className="flex_height">
                          <div className="card custom-card mb-0 flex_height">
                            <div className="card-body flex_height"></div>
                          </div>
                        </div>
                      ),
                      key: "2",
                    },
                    {
                      label: "Milestones",
                      children: (
                        <div className="flex_height">
                          <div className="card custom-card mb-0 flex_height">
                            <div className="card-body flex_height"></div>
                          </div>
                        </div>
                      ),
                      key: "3",
                    },
                    {
                      label: "Settings",
                      children: (
                        <div className="flex_height">
                          <div className="card custom-card mb-0 flex_height">
                            <div className="card-body flex_height"></div>
                          </div>
                        </div>
                      ),
                      key: "4",
                    },
                  ]}
                />
              }
              listRole={[Role.Manager, Role.Admin, Role.Teacher]}
            />
            <AuthoComponentRoutes
              element={
                <Box className="box w-100 d-flex flex-column flexGrow_1">
                  <div className="card custom-card mb-0 flexGrow_1">
                    <div className="card-body d-flex flex-column">
                      <div className="row">
                        <div className="row p-0 m-0 mb-2 align-items-center justify-content-between ">
                          {loadingData && loadingSelect && (
                            <ProjectGeneral
                              project={project}
                              fetchData={fetchData}
                              classes={classes}
                              students={students}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Box>
              }
              listRole={[Role.Student]}
            />
          </>
        }
      />
    </>
  );
};
