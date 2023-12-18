import { Tabs, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum } from "src/enum/Enum";
import { ProjectMember } from "./ProjectMember/ProjectMember";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { CloudSyncOutlined, SyncOutlined } from "@ant-design/icons";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { Box, Grid } from "@mui/material";
import { Role } from "src/enum/Role";
import { HandleAuth } from "src/utils/handleAuth";
import { swalWithBootstrapButtons } from "src/enum/swal";

export const ProjectDetailsMember = () => {
  const navigate = useNavigate();
  const { IsStudent } = HandleAuth();
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [loadingTable, setLoadingTable] = useState(false);
  const [spin, setSpin] = useState(true);
  const [classes, setClasses] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingLeader, setLoadingLeader] = useState(false);
  const [actionId, setActionId] = useState(undefined);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchProjectParams, setSearchProjectParams] = useState([
    {
      field: "project_id",
      value: projectId,
      condition: ConditionEnum.Equal,
    },
  ]);
  const handleMemberSynchronize = async (convertId, bearToken, projectId) => {
    setLoadingTable(true);
    let classObj = classes.filter(ele => ele.class_id === project.class_id)[0]
    if(convertId !== null && bearToken !== null && classObj.class_convert_id !== null && classObj.class_convert_token !== null) {
      const { data, err } = await axiosClient.post(
        `/ClassStudent/AsyncProjectMembers?convertId=${convertId}&bearToken=${bearToken}&id=${projectId}`
      );
      if (err) {
        toast.error(`Synchronize member ${project.group_name} group fail!`);
        return;
      } else {
        toast.success(
          `Synchronize member ${project.group_name} group successfully!`
        );
        fetchData();
        // fetchDataSelect();
      }
    } else {
      if(convertId === null || bearToken === null) {
        toast.error(
          `You have not configured a personal token and project ID for this class. Please try again!`
        )
      }
      if(classObj.class_convert_id === null || classObj.class_convert_token === null) {
        toast.error(
          `You have not configured a personal token and group ID for this class. Please try again!`
        )
      }
    }
    
    setLoadingTable(false);
  };

  const fetchData = async () => {
    const { data } = await axiosClient.get(`Project/${projectId}`);
    setProject(data);
    setLoadingLeader(false);
    setLoadingTable(false);
    setLoadingStatus(false)
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
    // console.log(studentArr);

    setLoadingData(true);
    setLoadingTable(false);
    setLoadingRemove(false);
    setLoadingStatus(false)
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
  const handleSetLeader = (student, project) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to make the leader to ${project.project_code} project?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoadingLeader(true);
          const { data, err } = await axiosClient.put(
            `Project/${project.project_id}`,
            {
              project_id: project.project_id,
              project_code: project.project_code,
              project_name: project.project_name,
              status: project.status,
              class_id: project.class_id,
              description: project.description,
              group_name: project.group_name,
              english_group_name: project.english_group_name,
              vn_group_name: project.vn_group_name,
              leader_id: studentId,
            }
          );

          if (err) {
            toast.error(`Set leader of ${project.project_code} project fail!`);
            setLoadingLeader(false);
            return;
          }
          toast.success(
            `Set leader of ${project.project_code} project successfully!`
          );
          // fetchClassData(classId);
          fetchData();
        }
      });
  };

  const handleChangeStatus = (student, updateStatus) => {
    setActionId(student.class_student_id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to change status ${student.student_name} student?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          let Id = [];
          Id.push(student.class_student_id);
          setLoadingStatus(true);
          const { data, err } = await axiosClient.post(
            `ClassStudent/UpdateStatus?status=${updateStatus}`,
            Id
          );

          if (err) {
            toast.error(`Change status ${student.student_name} student fail!`);
            // setLoadingStatus(false);
            return;
          }
          toast.success(
            `Change status ${student.student_name} student successfully!`
          );
          // fetchClassData(classId);
          fetchDataSelect();
        }
      });
  };
  const handleProjectStudentDelete = async (student, projectChange) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to make remove ${student.student_name} from ${project.project_code} project?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setActionId(student.class_student_id);
          setLoadingRemove(true);
          let studentArr = [];
          studentArr.push({
            class_student_id: student.class_student_id,
            student_id: student.student_id,
            class_id: projectChange.class_id,
            project_id: projectChange.project_id,
          });
          const { data, err } = await axiosClient.post(
            `ClassStudent/RemoveStudents`,
            studentArr
          );
          if (err) {
            toast.error("Remove student fail!");
            // showErrorMessage(err);
            setLoadingRemove(false);
            return;
          } else {
            toast.success("Remove student successful!");
            // fetchFilterData(searchClassParams);
            fetchDataSelect();
          }
          // console.log(student.class_student_id)
        }
      });
  };

  useEffect(() => {
    fetchData();
    fetchDataSelect();
  }, []);
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position={IsStudent() ? "project-student-member" : "project"}
        spin={loadingData && loadingSelect}
        defaultOpenKeys="project-details-student"
        projectId={projectId}
        dashboardBody={
          <>
            <AuthoComponentRoutes
              element={
                <Tabs
                  defaultActiveKey="2"
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
                              {/* {loadingData && loadingSelect ? (
                          <ProjectGeneral
                            project={project}
                            fetchData={fetchData}
                            classes={classes}
                            students={students}
                          />
                        ) : (
                          ""
                        )} */}
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
                            <div className="card-body flex_height">
                              <div className="row">
                                <div className="row p-0 m-0 mb-2 align-items-center justify-content-between ">
                                  <div className="col-lg-7 col-md-3 my-auto">
                                    <h3
                                      className="fw-bold m-0 "
                                      style={{ paddingBottom: 20 }}
                                    >
                                      Members of Project {project.group_name} (
                                      {project.project_code})
                                    </h3>{" "}
                                  </div>
                                  <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative align-items-center float-end">
                                    <Tooltip
                                      title="Synchronize"
                                      className="float-end"
                                      placement="top"
                                      color="rgb(137, 32, 173)"
                                      size="large"
                                    >
                                      <div>
                                        <BaseButton
                                          type="button"
                                          color="purple"
                                          isIconLeft={true}
                                          value="Sync"
                                          icon={<SyncOutlined size={10} />}
                                          onClick={() =>
                                            handleMemberSynchronize(
                                              project.project_convert_id,
                                              project.project_convert_token,
                                              project.project_id
                                            )
                                          }
                                        />
                                      </div>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                              {loadingData && loadingSelect && (
                                <ProjectMember
                                  project={project}
                                  fetchData={fetchData}
                                  students={students}
                                  actionId={actionId}
                                  loadingTable={loadingTable}
                                  loadingLeader={loadingLeader}
                                  loadingRemove={loadingRemove}
                                  loadingStatus={loadingStatus}
                                  handleSetLeader={handleSetLeader}
                                  handleChangeStatus={handleChangeStatus}
                                  handleProjectStudentDelete={
                                    handleProjectStudentDelete
                                  }
                                />
                              )}
                            </div>
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
                  {loadingData && (
                    <div className="card custom-card mb-0 flex_height">
                      <div className="card-body flex_height">
                        <div className="row">
                          <div className="row p-0 m-0 mb-2 align-items-center justify-content-between ">
                            <div className="col-lg-7 col-md-3 my-auto">
                              <h3
                                className="fw-bold m-0 "
                                style={{ paddingBottom: 20 }}
                              >
                                Members of Project {project.group_name} (
                                {project.project_code})
                              </h3>{" "}
                            </div>
                            <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative align-items-center float-end">
                              <Tooltip
                                title="Synchronize"
                                className="float-end"
                                placement="top"
                                color="rgb(137, 32, 173)"
                                size="large"
                              >
                                <div>
                                  <BaseButton
                                    type="button"
                                    color="purple"
                                    isIconLeft={true}
                                    value="Sync"
                                    icon={<SyncOutlined size={10} />}
                                    onClick={() =>
                                      handleMemberSynchronize(
                                        project.project_convert_id,
                                        project.project_convert_token,
                                        project.project_id
                                      )
                                    }
                                  />
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        {loadingData && loadingSelect && (
                          <ProjectMember
                            project={project}
                            fetchData={fetchData}
                            students={students}
                            actionId={actionId}
                            loadingTable={loadingTable}
                            loadingLeader={loadingLeader}
                            loadingRemove={loadingRemove}
                            loadingStatus={loadingStatus}
                            handleSetLeader={handleSetLeader}
                            handleChangeStatus={handleChangeStatus}
                            handleProjectStudentDelete={
                              handleProjectStudentDelete
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}
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
