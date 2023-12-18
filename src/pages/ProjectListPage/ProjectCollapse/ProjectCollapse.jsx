import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  MoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Collapse, Dropdown, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum } from "src/enum/Enum";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { HandleAuth } from "src/utils/handleAuth";
import { ProjectStudentItem } from "../ProjectStudentItem/ProjectStudentItem";
const { Panel } = Collapse;
export const ProjectCollapse = ({
  project,
  projects,
  classObj,
  fetchCollapseData,
  classId,
  actionId,
  // isActionOnclick,
  isWaitingList,
  fetchFilterData,
  searchClassParams,
  handleCollapseDelete,
  handleMoveToAnotherProject,
  handleCollapseChangeStatus,
  handleCollapseStudentDelete,
  handleCollapseClassStudentDelete,
  handleSetCollapseLeader,
  handleProjectStudentChangeStatus,
  loadingStatus,
  loadingDelete,
  loadingCollapseDelete,
  loadingMove,
  loadingRemove,
}) => {
  const navigate = useNavigate();
  const { currentUser, IsStudent, IsTeacher, IsManager, IsAdmin, IsLeader } =
    HandleAuth();
  const [collapseStudents, setCollapseStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingLeader, setLoadingLeader] = useState(false);
  const [searchParams, setSearchParams] = useState([
    {
      field: "project_id",
      value: project === undefined ? "" : project.project_id,
      condition: ConditionEnum.Equal,
    },
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
    },
  ]);
  const handleProjectStudentDelete = (student, projectChange) => {
    handleCollapseStudentDelete(
      student,
      projectChange,
      fetchData,
      searchParams
    );
  };

  const handleProjectClassStudentDelete = (student, projectChange) => {
    handleCollapseClassStudentDelete(
      student,
      projectChange,
      fetchData,
      searchParams
    );
  };

  const handleSetLeader = (studentId, project) => {
    handleSetCollapseLeader(studentId, project, setLoadingLeader);
  };

  const handleDelete = (projectId) => {
    const IdArr = [];
    IdArr.push(projectId);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete ${project.project_code} project?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          const { data, err } = await axiosClient.delete(
            "Project/DeleteMultiple",
            { data: IdArr }
          );

          if (err) {
            toast.error("Delete project fail!");
            return;
          }
          toast.success("Delete project successful!");
          fetchData(searchParams);
          // fetchSemesterData()
          fetchFilterData(searchClassParams);
        }
      });
  };
  const fetchData = async (searchParams) => {
    const { data, err } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      searchParams
    );
    setCollapseStudents(data);
    setLoadingData(true);
  };

  const fetchDataSelect = async () => {
    // const { data, err } = await axiosClient.get(`/Class/${classId}`);
    // setClassObj(data);
    // setLoadingSelectData(true);
  };
  // const fetchWaitingData = async (searchWaitingParams) => {
  //   const { data, err } = await axiosClient.post(
  //     `/ClassStudent/GetByPaging`,
  //     searchWaitingParams
  //   );
  //   setStudentWaiting(data);
  //   setLoadingWaitingData(true);
  // };
  const items = [
    {
      key: "1",
      disabled: !project.status,
      label: (
        <a
          target="_blank"
          onClick={() => {
            navigate(`/project-details/${project.project_id}`);
          }}
        >
          <EditOutlined className="me-2" /> View
        </a>
      ),
    },
  ];
  if (
    project.created_by === currentUser.email ||
    classObj.teacher_id === currentUser.user_id ||
    IsAdmin() ||
    IsManager()
  ) {
    items.push(
      {
        key: "2",
        label: (
          <a
            target="_blank"
            onClick={() => {
              handleCollapseChangeStatus(project);
            }}
          >
            <SettingOutlined className="me-2" />
            {project.status === 0 ? "Activate" : "Deactivate"}
          </a>
        ),
      },
      {
        key: "3",
        label: (
          <a
            target="_blank"
            onClick={() => {
              handleCollapseDelete(project);
            }}
          >
            <DeleteOutlined className="me-2" />
            Delete
          </a>
        ),
      }
    );
  }
  const genExtra = () => (
    <>
      {/* <Tooltip title="View" placement="top" size="large">
        <EditOutlined
          style={{ cursor: project.status === 0 ? "not-allowed" : "pointer" }}
          onClick={() => {
            navigate(`/project-details/${project.project_id}`);
          }}
        />
      </Tooltip>
      {(project.created_by === currentUser.email ||
        classObj.teacher_id === currentUser.user_id ||
        IsAdmin() ||
        IsManager()) && (
        <>
          <Tooltip
            title={project.status === 0 ? "Active" : "Inactive"}
            placement="top"
            size="large"
          >
            {actionId === project.project_id && loadingStatus ? (
              <LoadingOutlined />
            ) : (
              <SettingOutlined
                className="ms-2"
                onClick={() => {
                  handleCollapseChangeStatus(project);
                }}
              />
            )}
          </Tooltip>
          <Tooltip title="Delete" placement="top" size="large">
            {actionId === project.project_id && loadingCollapseDelete ? (
              <LoadingOutlined />
            ) : (
              <DeleteOutlined
                className="ms-2"
                onClick={() => {
                  handleCollapseDelete(project);
                }}
              />
            )}
          </Tooltip>
        </>
      )} */}
      <div className="project_extra_item">
        <a
          onClick={() => navigate(`/project-dashboard/${project.project_id}`)}
          className="text-decoration-underline "
        >
          View Dashboard
        </a>
      </div>
      <div className="project_extra_item">
        <a>
          {project.status === 1 ? (
            <Badge
              key="#26BF94"
              color="#26BF94"
              text="Active"
              className="badgeActive"
            />
          ) : (
            <Badge
              key="red"
              color="red"
              text="Inactive"
              className="badgeInactive"
            />
          )}
        </a>
      </div>
      {(!IsStudent() || IsLeader(project.leader_id)) && (
        <div className="project_extra_item">
          <Tooltip title="More" placement="top" size="large">
            <Dropdown menu={{ items }} trigger={["click"]} arrow>
              <MoreOutlined style={{ fontSize: "18px" }} />
            </Dropdown>
          </Tooltip>
        </div>
      )}

      {/* <DeleteFilled
        onClick={(event) => {
          console.log(project.project_code);
        }}
      /> */}
    </>
  );
  // console.log(students);
  const onChange = (key) => {
    // console.log(key);
    // onFetchProjectStudent()
  };
  const fetchDataAndSelect = async () => {
    await Promise.all([fetchData(searchParams), fetchDataSelect()]);
  };
  // isActionOnclick && fetchData(searchParams);

  // useEffect(() => {
  //   // fetchWaitingData(searchWaitingParams);
  //   fetchData(searchParams);
  // }, [project]);
  return (
    <>
      <Collapse
        className="projectCollapse"
        collapsible={project.status === 0 ? "disabled" : "icon"}
        defaultActiveKey={["1"]}
        onChange={onChange}
        items={[
          {
            key: project.project_id,
            label: (
              <span>
                {project.group_name} ({project.project_code})
              </span>
            ),
            children: (
              <ProjectStudentItem
                students={project.students}
                isWaitingList={isWaitingList}
                fetchData={fetchData}
                searchParams={searchParams}
                fetchFilterData={fetchFilterData}
                searchClassParams={searchClassParams}
                project={project}
                projects={projects}
                classId={classId}
                classObj={classObj}
                actionId={actionId}
                loadingLeader={loadingLeader}
                loadingMove={loadingMove}
                loadingRemove={loadingRemove}
                handleSetLeader={handleSetLeader}
                handleMoveToAnotherProject={handleMoveToAnotherProject}
                handleProjectStudentDelete={handleProjectStudentDelete}
                handleProjectClassStudentDelete={
                  handleProjectClassStudentDelete
                }
                handleProjectStudentChangeStatus={
                  handleProjectStudentChangeStatus
                }
              />
            ),
            extra: genExtra(),
            // onDoubleClick: () => {
            //   navigate(`/project-dashboard/${project.project_id}`);
            // },
          },
        ]}
      />
      {/* {console.log(students)} */}
    </>
  );
};
