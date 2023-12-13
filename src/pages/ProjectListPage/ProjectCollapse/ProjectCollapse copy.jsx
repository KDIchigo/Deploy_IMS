import React, { useEffect, useState } from "react";
import { Collapse, Tooltip } from "antd";
import { ProjectStudentItem } from "../ProjectStudentItem/ProjectStudentItem";
import {
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum } from "src/enum/Enum";
import { useNavigate } from "react-router";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { toast } from "react-toastify";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { Role } from "src/enum/Role";
import { HandleAuth } from "src/utils/handleAuth";

export const ProjectCollapseCopy = ({
  project,
  projects,
  classId,
  isWaitingList,
  fetchFilterData,
  searchClassParams,
  handleCollapseDelete,
  handleMoveToAnotherProject,
  handleCollapseChangeStatus,
}) => {
  const navigate = useNavigate();
  const { currentUser, IsStudent, IsTeacher, IsManager, IsAdmin, IsLeader } =
    HandleAuth();
  const [students, setStudents] = useState([]);
  const [classObj, setClassObj] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelectData, setLoadingSelectData] = useState(false);
  const [loadingWaitingData, setLoadingWaitingData] = useState(false);
  const [studentWaiting, setStudentWaiting] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
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
  const [searchWaitingParams, setSearchWaitingParams] = useState({
    pageNumber: 1,
    pageSize: 5,
    sortString: "",
    filterConditions: [
      {
        field: "class_id",
        value: classId,
        condition: ConditionEnum.Equal,
      },
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNull,
      },
    ],
  });
  const handleProjectStudentDelete = async (student, project) => {
    console.log(student);
    const { data, err } = await axiosClient.put(
      `ClassStudent/${student.class_student_id}`,
      {
        class_student_id: student.class_student_id,
        student_id: student.student_id,
        class_id: project.class_id,
      }
    );
    if (err) {
      toast.error("Delete project student fail!");
      return;
    } else {
      toast.success("Delete project student successful!");
      fetchFilterData(searchClassParams);
      // console.log(searchClassParams)
      fetchData(searchParams);
    }
  };
  const handleSetLeader = (studentId, project) => {
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
        console.log(result);
        if (result.isConfirmed) {
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
            toast.error("Set leader fail!");
            return;
          }
          toast.success("Set leader successful!");
          fetchData(searchParams);
          // fetchSemesterData()
          fetchFilterData(searchClassParams);
        }
      });
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
        console.log(result);
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
    setStudents(data);
    setLoadingData(true);
  };
  const fetchDataSelect = async () => {
    const { data, err } = await axiosClient.get(`/Class/${classId}`);
    setClassObj(data);
    setLoadingSelectData(true);
  };

  // const fetchWaitingData = async (searchWaitingParams) => {
  //   const { data, err } = await axiosClient.post(
  //     `/ClassStudent/GetByPaging`,
  //     searchWaitingParams
  //   );
  //   setStudentWaiting(data);
  //   setLoadingWaitingData(true);
  // };
  const genExtra = () => (
    <>
      <Tooltip title="View" placement="top" size="large">
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
            <SettingOutlined
              className="ms-2"
              onClick={() => {
                handleCollapseChangeStatus(project);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete" placement="top" size="large">
            <DeleteOutlined
              className="ms-2"
              onClick={() => {
                handleCollapseDelete(project);
              }}
            />
          </Tooltip>
        </>
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
    console.log(key);
    // onFetchProjectStudent()
  };
  const fetchDataAndSelect = async () => {
    await Promise.all([fetchData(searchParams), fetchDataSelect()]);
  };
  useEffect(() => {
    // fetchWaitingData(searchWaitingParams);
    fetchDataAndSelect();
  }, []);
  return (
    <>
      {loadingData && loadingSelectData ? (
        <>
          <Collapse
            className="projectCollapse"
            collapsible={project.status === 0 ? "disabled" : ""}
            items={[
              {
                key: project === undefined ? "0" : project.project_id,
                label:
                  project === undefined ? (
                    "Waiting List (These trainees would work personally)"
                  ) : (
                    <span>
                      {project.group_name} ({project.project_code})
                    </span>
                  ),
                children: (
                  <ProjectStudentItem
                    students={isWaitingList ? studentWaiting : students}
                    isWaitingList={isWaitingList}
                    fetchData={fetchData}
                    searchParams={searchParams}
                    fetchFilterData={fetchFilterData}
                    searchClassParams={searchClassParams}
                    project={project}
                    projects={projects}
                    classId={classId}
                    handleSetLeader={handleSetLeader}
                    handleMoveToAnotherProject={handleMoveToAnotherProject}
                    handleProjectStudentDelete={handleProjectStudentDelete}
                  />
                ),
                extra: genExtra(),
              },
            ]}
            defaultActiveKey={["1"]}
            onChange={onChange}
          />
          {/* {console.log(students)} */}
        </>
      ) : (
        ""
      )}
    </>
  );
};
