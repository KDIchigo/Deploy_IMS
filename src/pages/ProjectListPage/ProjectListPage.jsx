import {
  CloseOutlined,
  ExportOutlined,
  ImportOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import { Role } from "src/enum/Role";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import {
  fetchClassAuth,
  fetchClassDecodeAuth,
  fetchFilterAdmin,
  fetchFilterDecodeAdmin,
  fetchFilterStudent,
  fetchProjectAdmin,
  fetchProjectAuth,
  fetchProjectDecodeAuth,
  fetchProjectStudent,
} from "src/utils/HandleProjectAuth";
import { HandleAuth } from "src/utils/handleAuth";
import { decodeParam } from "src/utils/handleEnDecode";
import { exportToExcel } from "src/utils/handleExcel";
import { filterBasicUtils } from "src/utils/handleSearchFilter";
import { FilterDemo } from "./FilterProject/FilterDemo";
import { NewProject } from "./NewProject/NewProject";
import { ProjectCollapse } from "./ProjectCollapse/ProjectCollapse";
import { ProjectHelpSync } from "./ProjectHelpSync/ProjectHelpSync";
import "./ProjectListPage.scss";
import { ProjectWaitingList } from "./ProjectWaitingList/ProjectWaitingList";
const getUnique = (arr, value) => {
  const unique = arr
    .map((e) => e[value])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);

  return unique;
};
export const ProjectListPage = () => {
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const semesterItem = searchURLParams.get("semester");
  const subjectItem = searchURLParams.get("subject");
  const classItem = searchURLParams.get("class");
  const projectItem = searchURLParams.get("project");

  const { currentUser, IsStudent, IsTeacher, IsManager, IsAdmin, IsLeader } =
    HandleAuth();
  const navigate = useNavigate();
  const [isActionOnclick, setIsActionOnclick] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [loadingCollapseDelete, setLoadingCollapseDelete] = useState(false);
  const [loadingMove, setLoadingMove] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingAddStudent, setLoadingAddStudent] = useState(false);
  const [loadingWaitDelete, setLoadingWaitDelete] = useState(false);
  const [loadingWaitingData, setLoadingWaitingData] = useState(false);
  const [loadingCollapseData, setLoadingCollapseData] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [loadingClass, setLoadingClass] = useState(false);
  const [loadingSemester, setLoadingSemester] = useState(false);
  const [loadingDecode, setLoadingDecode] = useState(false);
  const [loadingDataAndSelect, setLoadingDataAndSelect] = useState(false);
  const [checkedSemester, setCheckedSemester] = useState(undefined);
  const [checkedSubject, setCheckedSubject] = useState(undefined);
  const [checkedClass, setCheckedClass] = useState(undefined);
  const [checkedProject, setCheckedProject] = useState(undefined);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectOpt, setProjectOpt] = useState([]);
  const [classObj, setClassObj] = useState([]);
  const [classOpt, setClassOpt] = useState([]);
  const [subjectOpt, setSubjectOpt] = useState([]);
  const [isSelectClass, setIsSelectClass] = useState(false);
  const [classId, setClassId] = useState(undefined);
  const [actionId, setActionId] = useState(undefined);
  const [helpModal, setHelpModal] = useState(undefined);
  // const [isSelectClass, setIsSelectClass] = useState(false);
  // let isSelectClass = false;
  const [searchProjectParams, setSearchProjectParams] = useState([
    // {
    //   field: "class_id",
    //   value: classId,
    //   condition: ConditionEnum.Equal,
    // },
  ]);
  const helpToggle = () => {
    setHelpModal(!helpModal);
  };
  // console.log(decodeParam(semesterItem));
  // console.log(decodeParam(subjectItem));
  // console.log(decodeParam(classItem));
  // console.log(decodeParam(projectItem));
  const [waitingListStudents, setWaitingListStudents] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [collapseStudents, setCollapseStudents] = useState([]);
  const [searchSubjectParams, setSearchSubjectParams] = useState([]);
  const [searchClassParams, setSearchClassParams] = useState([
    {
      field: "status",
      value: StatusEnum.Inactive,
      condition: ConditionEnum.NotEqual,
    },
  ]);
  const [exportParam, setExportParam] = useState([
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
    },
  ]);
  const [searchWaitingListParams, setSearchWaitingListParams] = useState([
    {
      field: "project_id",
      value: "",
      condition: ConditionEnum.IsNull,
    },
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
    },
  ]);
  const [searchCollapseParams, setSearchCollapseParams] = useState([]);
  const newClassParams = IsTeacher()
    ? [
        {
          field: "teacher_id",
          value: currentUser.user_id,
          condition: ConditionEnum.IsNull,
        },
        {
          field: "status",
          value: StatusEnum.Inactive,
          condition: ConditionEnum.NotEqual,
        },
      ]
    : [
        {
          field: "status",
          value: StatusEnum.Inactive,
          condition: ConditionEnum.NotEqual,
        },
      ];
  const fetchAllData = async () => {
    (IsManager() || IsAdmin()) &&
      fetchProjectAdmin(
        searchClassParams,
        setClasses,
        setSearchClassParams,
        setLoadingClass,
        setSubjects,
        setLoadingSubject,
        setProjects,
        setLoadingData
      );
    (IsTeacher() || IsStudent()) &&
      fetchProjectStudent(
        currentUser,
        IsStudent,
        IsTeacher,
        setClasses,
        setSearchClassParams,
        setLoadingClass,
        setSubjects,
        setLoadingSubject,
        setProjects,
        setLoadingData,
        setSemesters,
        setLoadingSemester
      );
  };
  const fetchStudentAllData = () => {
    fetchProjectStudent(
      currentUser,
      IsStudent,
      IsTeacher,
      setClasses,
      setSearchClassParams,
      setLoadingClass,
      setSubjects,
      setLoadingSubject,
      setProjects
    );
  };
  const fetchFilterData = async (
    searchClassParams,
    semesterDecode,
    subjectDecode,
    classDecode,
    projectDecode
  ) => {
    (IsManager() || IsAdmin()) && semesterDecode === undefined;
    fetchFilterAdmin(
      searchClassParams,
      searchProjectParams,
      isSelectClass,
      setSemesters,
      setSearchClassParams,
      setSearchProjectParams,
      setLoadingSemester,
      setLoadingSubject,
      setLoadingClass,
      setLoadingData,
      setSubjectOpt,
      setClassOpt,
      setClassObj,
      setProjectOpt,
      setClassId,
      searchWaitingListParams,
      setWaitingListStudents,
      setSearchWaitingListParams,
      setLoadingWaitingData,
      setSearchParamsURL
    );
    (IsManager() || IsAdmin()) && semesterDecode !== undefined;
    fetchFilterDecodeAdmin(
      searchClassParams,
      searchProjectParams,
      isSelectClass,
      setSemesters,
      setSearchClassParams,
      setSearchProjectParams,
      setLoadingSemester,
      setLoadingSubject,
      setLoadingClass,
      setLoadingData,
      setSubjectOpt,
      setClassOpt,
      setClassObj,
      setProjectOpt,
      setClassId,
      searchWaitingListParams,
      setWaitingListStudents,
      setSearchWaitingListParams,
      setLoadingWaitingData,
      setSearchParamsURL,
      semesterDecode,
      subjectDecode,
      classDecode,
      projectDecode
    );
    (IsTeacher() || IsStudent()) &&
      fetchFilterStudent(
        currentUser,
        IsStudent,
        IsTeacher,
        searchClassParams,
        searchProjectParams,
        isSelectClass,
        setSemesters,
        setSearchClassParams,
        setSearchProjectParams,
        setLoadingSemester,
        setLoadingSubject,
        setLoadingClass,
        setLoadingData,
        setSubjectOpt,
        setClassOpt,
        setClassObj,
        setProjectOpt,
        setClassId,
        searchWaitingListParams,
        setWaitingListStudents,
        setSearchWaitingListParams,
        setLoadingWaitingData,
        setSearchParamsURL
      );
  };

  const handleCollapseDelete = async (project) => {
    const IdArr = [];
    IdArr.push(project.project_id);
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
        if (result.isConfirmed) {
          setActionId(project.project_id);
          setLoadingCollapseDelete(true);
          const { data, err } = await axiosClient.delete(
            "Project/DeleteMultiple",
            { data: IdArr }
          );

          if (err) {
            // toast.error(`The ${project.project_code} was deleted fail`);
            showErrorMessage(err);
            setLoadingCollapseDelete(false);
            return;
          } else {
            toast.success(
              `The ${project.project_code} was deleted successfully`
            );
            setLoadingCollapseDelete(false);
            const newSearchCollapseParams = [
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
            ];
            setSearchCollapseParams(searchCollapseParams);
            fetchCollapseData(newSearchCollapseParams);
            // fetchSemesterData()
            // fetchFilterData(searchClassParams);
            fetchClassData(classId,
              checkedSemester,
              checkedSubject,
              checkedClass,
              checkedProject);
          }
        }
      });
  };
  const handleWaitingListDelete = async (id) => {
    const classStudentId = [];
    classStudentId.push(id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete waiting student?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoadingWaitDelete(true);
          const { data, err } = await axiosClient.delete(
            "ClassStudent/DeleteMultiple",
            {
              data: classStudentId,
            }
          );

          if (err) {
            // Toast.error("Delete waiting student fail!");
            showErrorMessage(err);
            setLoadingWaitDelete(false);
            return;
          }
          toast.success("Delete waiting student successfully!");
          setLoadingWaitDelete(false);
          fetchWaitingListData(
            {
              pageNumber: 1,
              pageSize: 5,
              sortString: "",
              filterConditions: [],
            },
            classId
          );
          // fetchSemesterData()
          // fetchFilterData(searchClassParams);
        }
      });
    // console.log(classStudentId);
  };

  const handleAddStudentToProject = async (project, student) => {
    setLoadingAddStudent(true);
    const { data, err } = await axiosClient.put(
      `ClassStudent/${student.class_student_id}`,
      {
        class_student_id: student.class_student_id,
        student_id: student.student_id,
        class_id: classId,
        project_id: project.project_id,
      }
    );

    if (err) {
      // toast.error("Add student fail!");
      showErrorMessage(err);
      setLoadingAddStudent(false);
      return;
    }
    toast.success("Add student successfully!");
    setLoadingAddStudent(false);
    // fetchWaitingData(searchWaitingParams)
    console.log(classId);

    const newSearchCollapseParams = [
      {
        field: "project_id",
        value: project.project_id,
        condition: ConditionEnum.Equal,
      },
      {
        field: "class_id",
        value: classId,
        condition: ConditionEnum.Equal,
      },
    ];
    fetchClassData(classId,
      checkedSemester,
      checkedSubject,
      checkedClass,
      checkedProject);
    // fetchCollapseData(newSearchCollapseParams)
    fetchWaitingListData(
      {
        pageNumber: 1,
        pageSize: 5,
        sortString: "",
        filterConditions: [],
      },
      classId
    );
    // fetchFilterData(searchClassParams);
  };

  const handleNewProject = async (
    formik,
    toggle,
    newValues,
    setLoadingData
  ) => {
    const { err } = await axiosClient.post(`/Project`, newValues);
    // console.log(newValues);
    if (err) {
      // toast.error("Add project fail!");
      showErrorMessage(err);
      setLoadingData(false);
    } else {
      toast.success("Add project successfully!");
      setLoadingData(false);
      fetchClassData(classId,
        checkedSemester,
        checkedSubject,
        checkedClass,
        checkedProject);
      formik.resetForm();
    }
    toggle();
    // fetchFilterData(searchClassParams);
    // fetchFilterData(searchClassParams);
  };

  const fetchCollapseData = async (searchParams) => {
    const { data, err } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      searchParams
    );
    setCollapseStudents(data);
    // setIsActionOnclick(false);
    setLoadingCollapseData(true);
  };

  const fetchWaitingListData = async (
    searchWaitingListParams,
    classId,
    isFilter
  ) => {
    const newFilterConditions = [
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNull,
      },
      {
        field: "class_id",
        value: classId,
        condition: ConditionEnum.Equal,
      },
    ];
    // console.log(searchWaitingListParams);
    const newSearchWaitingListParams = {
      ...searchWaitingListParams,
      filterConditions: newFilterConditions,
    };
    const { data, err } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      newFilterConditions
    );

    setWaitingListStudents(data);
    setSearchWaitingListParams(searchWaitingListParams);
    // fetchFilterData(searchClassParams);
    isFilter === false ? fetchFilterData(searchClassParams,
      checkedSemester,
      checkedSubject,
      checkedClass,
      checkedProject) : "";
    // console.log(classId);
    // const { data: classItem } = await axiosClient.get(`/Class/${classId}`);
    // setClassObj(classItem);
    setLoadingWaitingData(true);
  };

  const onPageChange = (pageNumber) => {
    const newSearchParams = {
      ...searchWaitingListParams,
      pageNumber: pageNumber,
    };
    setSearchWaitingListParams(newSearchParams);
    fetchWaitingListData(newSearchParams, classId);
  };
  const fetchDataAndSelect = async () => {
    await Promise.all([
      fetchFilterData(searchClassParams),
      async () => {
        const { data: classArr } = await axiosClient.post(
          "/Class/GetFilterData?sortString=created_date ASC",
          []
        );
        setClasses(classArr);
        setSearchClassParams(searchClassParams);
        setLoadingClass(true);

        setSubjects(getUnique(classArr, "subject_id"));
      },
      async () => {
        const { data: projectList } = await axiosClient.post(
          "/Project/GetFilterData?sortString=created_date ASC",
          []
        );
        setProjects(projectList);
      },
    ]);
    setLoadingDataAndSelect(true);
  };
  // const fetchProjectData = async (searchProjectParams) => {
  //   const { data: projectList } = await axiosClient.post(
  //     "/Project/GetFilterData?sortString=created_date ASC",
  //     searchProjectParams
  //   );
  //   setProjects(projectList);
  //   // setProjectOpt(projectList);
  //   setLoadingData(true);
  // };
  const handleExportToExcel = async () => {
    try {
      // Gọi API để lấy dữ liệu Excel
      const { data: exportExcel } = await axiosClient.post(
        "/ClassStudent/Export",
        [
          {
            field: "class_id",
            value: classId,
            condition: ConditionEnum.Equal,
          },
        ],
        {
          responseType: "arraybuffer", // Đảm bảo dữ liệu trả về dưới dạng binary
        }
      );
      exportToExcel(exportExcel);
    } catch (error) {
      console.error("Fail to download file Excel: ", error);
    }
  };
  const handleMoveToAnotherProject = async (
    project,
    student,
    fetchData,
    searchParams
  ) => {
    // setIsActionOnclick(true);
    setActionId(student.class_student_id);
    setLoadingMove(true);
    const { data, err } = await axiosClient.put(
      `ClassStudent/${student.class_student_id}`,
      {
        class_student_id: student.class_student_id,
        student_id: student.student_id,
        class_id: project.class_id,
        project_id: project.project_id,
        status: StatusEnum.Active,
      }
    );
    if (err) {
      toast.error("Move student fail!");
      setLoadingMove(false);
      return;
    } else {
      toast.success("Move student successfully!");
      // fetchFilterData(searchClassParams);
      setLoadingMove(false);
      fetchClassData(classId,
        checkedSemester,
        checkedSubject,
        checkedClass,
        checkedProject);
      // console.log(searchClassParams)
      // fetchCollapseData(searchParams);
      // fetchCollapseData()
    }
  };
  const handleCollapseStudentDelete = async (
    student,
    projectChange
    // fetchData,
    // searchParams
  ) => {
    setActionId(student.class_student_id);
    setLoadingRemove(true);
    let studentArr = [];
    studentArr.push({
      class_student_id: student.class_student_id,
      student_id: student.student_id,
      class_id: projectChange.class_id,
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
      // console.log(searchClassParams)
      setLoadingRemove(false);
      // fetchData(searchParams);
      fetchWaitingListData(
        {
          pageNumber: 1,
          pageSize: 5,
          sortString: "",
          filterConditions: [],
        },
        classId
      );
      console.log(
        checkedSemester,
        checkedSubject,
        checkedClass,
        checkedProject
      );

      fetchClassData(
        classId,
        checkedSemester,
        checkedSubject,
        checkedClass,
        checkedProject
      );
    }
  };
  const handleCollapseChangeStatus = async (project) => {
    const projectIdArr = [];
    projectIdArr.push(project.project_id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to change status of ${project.project_code} project ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          setActionId(project.project_id);
          setLoadingStatus(true);
          const { data, err } = await axiosClient.post(
            `/Project/UpdateStatus?status=${project.status === 0 ? "1" : "0"}`,
            projectIdArr
          );

          if (err) {
            // toast.error(`The ${project.project_code} was changed fail`);
            showErrorMessage(err);
            setLoadingStatus(false);
            return;
          } else {
            toast.success(
              `The ${project.project_code} was changed successfully`
            );
            setLoadingStatus(false);
            const newSearchCollapseParams = [
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
            ];
            setSearchCollapseParams(searchCollapseParams);
            fetchCollapseData(newSearchCollapseParams);
            // console.log(searchClassParams);
            // fetchSemesterData()
            // fetchFilterData(searchClassParams);
            fetchClassData(classId,
              checkedSemester,
              checkedSubject,
              checkedClass,
              checkedProject);
          }
        }
      });
  };

  const handleSetCollapseLeader = (studentId, project, setLoadingLeader) => {
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
          setLoadingLeader(false);
          fetchClassData(classId,
            checkedSemester,
            checkedSubject,
            checkedClass,
            checkedProject);
        }
      });
  };
  // console.log(searchClassParams);
  //   const handleMoveToAnotherProject = async (project, student, fetchData, searchParams) => {
  //   console.log(student);
  //   const { data, err } = await axiosClient.put(
  //     `ClassStudent/${student.class_student_id}`,
  //     {
  //       class_student_id: student.class_student_id,
  //       student_id: student.student_id,
  //       class_id: project.class_id,
  //       project_id: project.project_id,
  //     }
  //   );
  //   if (err) {
  //     toast.error("Add fail!");
  //     return;
  //   } else {
  //     toast.success("Add Successful!");
  //     // fetchWaitingData(searchWaitingParams)
  //     fetchData(searchParams);
  //   }
  // };
  const handleProjectAllocationSynchronize = async (classItem, projects) => {
    // console.log(classItem, projects)
    setLoadingSync(true);
    let convertId = classItem.class_convert_id;
    let bearToken = classItem.class_convert_token;

    let count = 0;

    if (convertId !== null && bearToken !== null) {
      console.log("a");
      const { data, err } = await axiosClient.post(
        `/Project/AsyncProjectList?classConvertId=${convertId}&bearToken=${bearToken}`,
        projects
      );
      setLoadingSync(false);
      projects.map((ele) => {
        if (
          ele.project_convert_id === null ||
          ele.project_convert_id === null
        ) {
          if (count > 0) return;
          toast.error(
            `Synchronize projects ${classItem.class_code} fail!!! All projects must have project gitlab ID and bearToken.`
          );
          // setLoadingSync(false);
          // return;
        }
        count++;
        // console.log(count)
      });
      if (err) {
        toast.error(`Synchronize projects ${classItem.class_code} fail!`);
        // showErrorMessage(err);
        return;
      } else {
        toast.success(
          `Synchronize projects ${classItem.class_code} successfully!`
        );
        // fetchData(searchParams);
      }
    } else {
      let toastErr = "";
      convertId === null && (toastErr = toastErr + "convert ID");
      convertId === null &&
        bearToken === null &&
        (toastErr = toastErr + " and ");
      bearToken === null && (toastErr = toastErr + "bearToken");
      toast.error(
        `Synchronize projects ${classItem.class_code} fail!!! Because the ${classItem.class_code} class does not have ${toastErr} yet.`
      );
    }
    setLoadingSync(false);
  };

  const fetchClassData = async (
    classId,
    semesterDecode,
    subjectDecode,
    classDecode,
    projectDecode
  ) => {
    // console.log(classDecode);
    classDecode === undefined
      ? fetchClassAuth(
          classId,
          currentUser,
          IsStudent,
          IsTeacher,
          setProjectOpt,
          setClassOpt,
          setClassObj,
          setSearchProjectParams,
          setLoadingData
        )
      : fetchClassDecodeAuth(
          classId,
          currentUser,
          IsStudent,
          IsTeacher,
          setProjectOpt,
          setClassOpt,
          setClassObj,
          setSearchProjectParams,
          setLoadingData,
          semesterDecode,
          subjectDecode,
          classDecode,
          projectDecode
        );
  };

  const fetchProjectData = async (
    projectId,
    semesterItem,
    subjectItem,
    classItem,
    projectItem
  ) => {
    console.log(semesterItem, subjectItem, classItem, projectItem);
    projectItem === undefined
      ? fetchProjectAuth(
          projectId,
          classId,
          setProjectOpt,
          setLoadingData,
          setSearchParamsURL
        )
      : fetchProjectDecodeAuth(
          projectId,
          classId,
          setProjectOpt,
          setLoadingData,
          setSearchParamsURL,
          semesterItem,
          subjectItem,
          classItem,
          projectItem
        );
  };

  const onFilter = (
    filter,
    semesterItem,
    subjectItem,
    classItem,
    projectItem
  ) => {
    // filterBasicUtils(
    //   filter,
    //   searchClassParams,
    //   setSearchClassParams,
    //   fetchFilterData
    // );
    let filterConditions = [];
    filterConditions = searchClassParams.filter(
      (obj) => obj.field !== filter.field
    );
    if (filter.value !== "all") {
      filterConditions.push(filter);
    }
    // console.log(filter.field);
    const newSearchParams = [...filterConditions];
    setSearchClassParams(newSearchParams);
    // console.log(newSearchParams)
    fetchFilterData(
      newSearchParams,
      semesterItem,
      subjectItem,
      classItem,
      projectItem
    );
    setClassId(filter.value);
    fetchWaitingListData(searchWaitingListParams, filter.value, true);
  };

  const onClassFilter = (
    filter,
    semesterItem,
    subjectItem,
    classItem,
    projectItem
  ) => {
    // console.log(classItem);
    fetchClassData(
      filter.value,
      semesterItem,
      subjectItem,
      classItem,
      projectItem
    );
    setClassId(filter.value);
    fetchWaitingListData(searchWaitingListParams, filter.value, true);
  };
  // console.log(decodeParam(projectItem));

  const onProjectFilter = (
    filter,
    semesterItem,
    subjectItem,
    classItem,
    projectItem
  ) => {
    fetchProjectData(
      filter.value,
      semesterItem,
      subjectItem,
      classItem,
      projectItem
    );
    // fetchWaitingListData(searchWaitingListParams, filter.value, true);
  };

  const fetchProjectOpt = async (classItem) => {
    const { data } = axiosClient.post(
      `/Project/GetProjectStudent?class_id=${classItem.class_id}&sortString=created_date ASC`,
      []
    );
    // console.log(classItem)
    setProjectOpt(data);
  };
  // console.log(decodeParam(semesterItem));
  useEffect(() => {
    // fetchSemesterData();
    fetchAllData();
    fetchFilterData(
      searchClassParams,
      decodeParam(semesterItem),
      decodeParam(subjectItem),
      decodeParam(classItem),
      decodeParam(projectItem)
    );
    setIsSelectClass(true);
    setCheckedSemester(decodeParam(semesterItem));
    setCheckedSubject(decodeParam(subjectItem));
    setCheckedClass(decodeParam(classItem));
    setCheckedProject(decodeParam(projectItem));
    // console.log(decodeParam(classItem))
    // console.log(decodeParam(projectItem))
    // if (decodeParam(classItem) !== null) {
    //   fetchProjectOpt(decodeParam(classItem));
    //   console.log('a')
    // }
    setLoadingDecode(true);
    // setProjectOpt(decodeParam(project))
    // fetchWaitingListData(searchWaitingListParams, classId, true);
  }, []);

  return (
    <>
      {/* {console.log(
        loadingWaitingData,
        loadingData,
        loadingSubject,
        loadingClass,
        loadingSemester
      )} */}
      <ToastContainer autoClose="2000" theme="colored" />
      <NavbarDashboard
        position="project"
        spin={
          loadingWaitingData &&
          loadingData &&
          loadingSubject &&
          loadingClass &&
          loadingSemester &&
          loadingDecode
        }
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    Project Allocation
                  </h3>
                  <div className="row p-0 m-0 mb-2 align-items-center justify-content-between ">
                    <div className="col-lg-7 col-md-5 my-auto">
                      {loadingData &&
                      loadingSubject &&
                      loadingClass &&
                      loadingSemester &&
                      loadingDecode ? (
                        <FilterDemo
                          semesters={semesters}
                          subjects={subjects}
                          classes={classes}
                          projects={projects}
                          onFilter={onFilter}
                          onClassFilter={onClassFilter}
                          onProjectFilter={onProjectFilter}
                          setIsSelectClass={setIsSelectClass}
                          checkedSemester={checkedSemester}
                          checkedSubject={checkedSubject}
                          checkedClass={checkedClass}
                          checkedProject={checkedProject}
                          setSearchParamsURL={setSearchParamsURL}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <AuthoComponentRoutes
                      element={
                        <div className="col-lg-5 col-md-6 mt-sm-0 mt-2 position-relative align-items-center float-end">
                          {loadingData &&
                            loadingSubject &&
                            loadingClass &&
                            loadingSemester && (
                              <NewProject
                                fetchFilterData={fetchFilterData}
                                searchClassParams={searchClassParams}
                                fetchAllData={fetchAllData}
                                classId={classId}
                                handleNewProject={handleNewProject}
                              />
                            )}
                          <div className="col-lg-7 float-end d-flex h-100 justify-content-end">
                            {loadingData &&
                              loadingSubject &&
                              loadingClass &&
                              loadingSemester && (
                                // <Tooltip
                                //   title="Synchronize"
                                //   className="me-5"
                                //   placement="top"
                                //   color="rgb(137, 32, 173)"
                                //   size="large"
                                // >
                                <div>
                                  {loadingSync ? (
                                    <BaseButton
                                      nameTitle="mt-1 me-1 px-3 py-1 btnLoadingSyn"
                                      color="primary"
                                      disabled="true"
                                      icon={<LoadingOutlined size={30} />}
                                    />
                                  ) : (
                                    <BaseButton
                                      // variant="outline"
                                      nameTitle="mt-1 me-1 px-3 py-1 "
                                      color="primary"
                                      isIconLeft={true}
                                      value="Sync"
                                      // variant="outline"
                                      icon={<SyncOutlined size={30} />}
                                      onClick={() =>
                                        handleProjectAllocationSynchronize(
                                          classOpt,
                                          projectOpt
                                        )
                                      }
                                    />
                                  )}
                                </div>

                                // </Tooltip>
                              )}

                            {/* <Tooltip
                              title="Export"
                              placement="top"
                              color="#8E69DF"
                              size="large"
                            > */}
                            <div>
                              <BaseButton
                                color="success"
                                variant="outline"
                                value="Export"
                                nameTitle="mt-1 me-1 px-3 py-1"
                                isIconLeft={true}
                                icon={<ExportOutlined />}
                                onClick={() => handleExportToExcel()}
                              />
                            </div>
                            {/* </Tooltip> */}
                            {/* <ImportProjectDemo
                              classId={classId}
                              fetchFilterData={fetchFilterData}
                              searchClassParams={searchClassParams}
                              fetchAllData={fetchAllData}
                            /> */}
                            {/* <Tooltip
                              title="Import"
                              placement="top"
                              color="#E6533C"
                              size="large"
                            > */}
                            <div>
                              {/* {console.log(classId)} */}
                              <BaseButton
                                variant="outline"
                                nameTitle="mt-1 px-3 py-1"
                                color="danger"
                                value="Import"
                                isIconLeft={true}
                                icon={<ImportOutlined />}
                                onClick={() =>
                                  navigate(`/project-import-student/${classId}`)
                                }
                              />
                            </div>
                            {/* </Tooltip> */}
                          </div>
                        </div>
                      }
                      listRole={[Role.Manager, Role.Admin, Role.Teacher]}
                    />
                  </div>
                </div>
                <Grid container className="m-0 flexGrow_1">
                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex flex-column"
                  >
                    <div id="project-allocation__header" className="d_flex_row">
                      {/* <div className="text-center m-0" style={{ width: "3%" }}>
                        <Checkbox />
                      </div> */}
                      {IsStudent() ? (
                        <>
                          <div
                            className="text-center m-0"
                            style={{ width: "5%" }}
                          >
                            #
                          </div>
                          <div style={{ width: "30%" }}>Fullname</div>
                          <div style={{ width: "35%" }}>Email</div>
                          <div style={{ width: "20%" }}>Phone</div>
                          <div
                            className="text-center m-0"
                            style={{ width: "10%" }}
                          >
                            Status
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="text-center m-0"
                            style={{ width: "5%" }}
                          >
                            #
                          </div>
                          <div style={{ width: "30%" }}>Fullname</div>
                          <div style={{ width: "45%" }}>Email</div>
                          <div
                            className="text-center m-0"
                            style={{ width: "10%" }}
                          >
                            Status
                          </div>
                          <div
                            className="text-center m-0"
                            style={{ width: "10%" }}
                          >
                            Action
                          </div>
                        </>
                      )}
                    </div>
                    <>
                      {/* {console.log(projectOpt)} */}
                      {loadingWaitingData && loadingDecode && (
                        <ProjectWaitingList
                          students={waitingListStudents}
                          searchWaitingListParams={searchWaitingListParams}
                          classId={classId}
                          classObj={classObj}
                          projects={projectOpt}
                          isWaitingList={true}
                          fetchFilterData={fetchFilterData}
                          searchClassParams={searchClassParams}
                          loadingAddStudent={loadingAddStudent}
                          loadingWaitDelete={loadingWaitDelete}
                          handleWaitingListDelete={handleWaitingListDelete}
                          handleAddStudentToProject={handleAddStudentToProject}
                          onPageChange={onPageChange}
                        />
                      )}
                      {/* {console.log(semesters)}
                      {console.log(subjectOpt)}
                      {console.log(classObj)}
                      {console.log(projectOpt)} */}
                      {loadingWaitingData &&
                        loadingData &&
                        loadingSubject &&
                        loadingClass &&
                        loadingSemester &&
                        loadingDecode &&
                        projectOpt?.map((project) => (
                          <ProjectCollapse
                            isWaitingList={false}
                            key={project.project_id}
                            project={project}
                            projects={projectOpt}
                            classId={classId}
                            classObj={classObj}
                            actionId={actionId}
                            loadingStatus={loadingStatus}
                            loadingCollapseDelete={loadingCollapseDelete}
                            loadingMove={loadingMove}
                            loadingRemove={loadingRemove}
                            fetchCollapseData={fetchCollapseData}
                            fetchFilterData={fetchFilterData}
                            searchClassParams={searchClassParams}
                            handleCollapseDelete={handleCollapseDelete}
                            handleMoveToAnotherProject={
                              handleMoveToAnotherProject
                            }
                            handleCollapseChangeStatus={
                              handleCollapseChangeStatus
                            }
                            handleCollapseStudentDelete={
                              handleCollapseStudentDelete
                            }
                            handleSetCollapseLeader={handleSetCollapseLeader}
                          />
                        ))}
                    </>
                  </Grid>
                </Grid>
                {/* <Tooltip
                  title="Help"
                  placement="topLeft"
                  color="#8E69DF"
                  size="small "
                > */}
                <BaseButton
                  color="info"
                  variant="outline"
                  nameTitle="btnHelp"
                  onClick={helpToggle}
                  icon={
                    <QuestionCircleOutlined
                      style={{ fontSize: "25px", marginTop: "2px" }}
                    />
                  }
                />
                <Modal
                  className="modalCarousel"
                  open={helpModal}
                  onOk={helpToggle}
                  onCancel={helpToggle}
                  style={{ minWidth: 1000 }}
                  closeIcon={
                    <CloseOutlined
                      onClick={helpToggle}
                      style={{ color: "#ffffff" }}
                    />
                  } // Customize the close icon color
                  footer={false}
                  centered
                >
                  <ProjectHelpSync />
                </Modal>
                {/* </Tooltip> */}
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};
