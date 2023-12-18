import { Box } from "@mui/material";
import { Empty, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import {
  fetchClassAuth,
  fetchFilterUserDashboardAdmin,
  fetchFilterUserDashboardStudent,
  fetchProjectAuth,
  fetchUserDashboardAdmin,
  fetchUserDashboardStudent,
} from "src/utils/HandleUserDashboard";
import { HandleAuth } from "src/utils/handleAuth";
import { FilterDashboard } from "./FilterDashboard/FilterDashboard";
import { MonthWeekProjectSelector } from "./FilterMonthWeek/MonthWeekUserSelector";
import UserDashboardChart from "./UserDashboardChart/UserDashboardChart";
import IssueBarChart from "./UserDashboardChart/component/IssueBarChart";

const projectId = "ee895312-1d69-4e84-800d-754b45742847";
// const classesId = "8d6ee876-0561-463d-abcd-ad13f5d622e0";
// const subjectId = "12e31ac9-d743-46e9-80ee-846645bbb048";
// const from_date = "2023-11-16T08:48:48.322Z";
// const to_date = "2023-11-22T08:48:48.322Z";
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

const handleSecondDecimal = (number) => {
  if(number === null || number === undefined) {
    return null;
  }
  if(Number.isInteger(number)){
    return number;
  }
  return number.toFixed(2);
};

const generateWeekOptions = () => {
  const weekOptions = [];
  const currentWeek = moment();

  for (let i = 0; i < 12; i++) {
    const startOfWeek = currentWeek
      .clone()
      .subtract(i, "weeks")
      .startOf("week");
    const endOfWeek = currentWeek.clone().subtract(i, "weeks").endOf("week");

    const weekLabel = `Week ${i + 1}: ${startOfWeek.format(
      "DD/MM/yyyy (ddd)"
    )} - ${endOfWeek.format("DD/MM/yyyy (ddd)")}`;

    // weekOptions.push(
    //   <Option key={i + 1} value={i + 1}>
    //     {weekLabel}
    //   </Option>
    // );
    weekOptions.push({
      value: `${i + 1}`,
      label: `Week ${i + 1}: ${startOfWeek.format(
        "DD/MM/yyyy (ddd)"
      )} - ${endOfWeek.format("DD/MM/yyyy (ddd)")}`,
      weekStart: `${startOfWeek.format("DD/MM/yyyy")}`,
      weekEnd: `${endOfWeek.format("DD/MM/yyyy")}`,
    });
    // console.log({
    //   value: `${i + 1}`,
    //   label: `Week ${i + 1}:${startOfWeek.format(
    //     "DD/MM/yyyy (ddd)"
    //   )} - ${endOfWeek.format("DD/MM/yyyy (ddd)")}`,
    //   weekStart: `${startOfWeek.format("DD/MM/yyyy")}`,
    //   weekEnd: `${endOfWeek.format("DD/MM/yyyy")}`,
    // });
  }

  return weekOptions;
};
const UserDashboard = () => {
  const { currentUser, IsStudent, IsTeacher, IsManager, IsAdmin, IsLeader } =
    HandleAuth();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isSelectedWeek, setIsSelectedWeek] = useState(false);
  // const [isSelectMonthWeek, setIsSelectMonthWeek] = useState(false);

  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [loadingClass, setLoadingClass] = useState(false);
  const [loadingSemester, setLoadingSemester] = useState(false);
  const [loadingSelectData, setLoadingSelectData] = useState(false);
  const [loadingFilterData, setLoadingFilterData] = useState(false);
  const [projectOpt, setProjectOpt] = useState([]);
  const [classOpt, setClassOpt] = useState([]);
  const [subjectOpt, setSubjectOpt] = useState([]);
  const [classObj, setClassObj] = useState([]);
  const [members, setMembers] = useState([]);
  const [isSelectClass, setIsSelectClass] = useState(false);
  const [classId, setClassId] = useState(undefined);
  const [memberId, setMemberId] = useState("all");
  const [issueTypes, setIssueTypes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [issueStatus, setIssueStatus] = useState([]);
  const [lineChart, setLineChart] = useState([]);
  const [barChart, setBarChart] = useState([]);
  const [issueCard, setIssueCard] = useState([]);
  const [averageReq, setAverageReq] = useState([]);
  const [project, setProject] = useState("");
  const [searchClassParams, setSearchClassParams] = useState([
    {
      field: "status",
      value: StatusEnum.Inactive,
      condition: ConditionEnum.NotEqual,
    },
  ]);
  const [searchProjectParams, setSearchProjectParams] = useState([]);

  // console.log(currentWeekStartDate);
  // console.log(currentWeekEndDate);
  // const fetchData = async (projectId) => {
  //   const { data: project } = await axiosClient.get(`/Project/${projectId}`);
  //   setProject(project);
  //   // console.log(project);
  //   const { data: issueTypes } = await axiosClient.post(
  //     `IssueSetting/GetDataCombobox?project_id=${projectId}&class_id=${project.class_id}&subject_id=${project.subject_id}`
  //   );
  //   setIssueTypes(issueTypes);

  //   setLoadingData(true);
  // };
  // const dateInput = "25/11/2023";
  // const formattedDate = moment(`${dateInput} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
  //   .utcOffset(0, true) // Set múi giờ là UTC và giữ nguyên múi giờ của ngày ban đầu
  //   .toISOString();
  // console.log(formattedDate);
  const fetchSelectData = async (
    option,
    isSelectMonthWeek,
    project,
    memberId
  ) => {
    let from_date = "";
    let to_date = "";
    // isSelectMonthWeek;
    if (isSelectMonthWeek) {
      from_date = moment(`${option.weekStart} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
        .utcOffset(0, true)
        .toISOString();
      to_date = moment(`${option.weekEnd} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
        .utcOffset(0, true)
        .toISOString();
    } else {
      setSelectedWeek(generateWeekOptions()[0]);
      const date = generateWeekOptions()[0];
      from_date = moment(`${date.weekStart} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
        .utcOffset(0, true)
        .toISOString();
      to_date = moment(`${date.weekEnd} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
        .utcOffset(0, true)
        .toISOString();
    }

    let assignee = "";
    if (memberId !== "all") {
      assignee = `&assignee_id=${memberId}`;
    }
    // const { data: project } = await axiosClient.get(`/Project/${projectId}`);
    // setProject(project);

    const { data: issueStatusArr } = await axiosClient.post(
      `Issue/GetIssueStatusPercentageTracker?projectId=${project.project_id}&class_id=${project.class_id}&subject_id=${project.subject_id}${assignee}`
    );
    setIssueStatus(issueStatusArr);
    // console.log(issueStatusArr);

    const { data: issueArr } = await axiosClient.post(
      `Issue/GetIssueStatusTracker?projectId=${project.project_id}&class_id=${project.class_id}&subject_id=${project.subject_id}&from=${from_date}&to=${to_date}${assignee}`
    );
    setLineChart(issueArr);
    // console.log(issueArr);
    const { data: issueCardArr } = await axiosClient.post(
      `Issue/GetIssueMonthlyTracker?projectId=${project.project_id}&class_id=${project.class_id}&subject_id=${project.subject_id}${assignee}`
    );
    setIssueCard(issueCardArr);
    // console.log(issueCardArr);
    const { data: barChartArr } = await axiosClient.post(
      `Issue/GetRequirementIssueTracker?projectId=${project.project_id}&class_id=${project.class_id}&subject_id=${project.subject_id}${assignee}`
    );
    setBarChart(barChartArr);
    const { data: averageRequire } = await axiosClient.post(
      `Issue/GetRequirementTracker?projectId=${project.project_id}&class_id=${project.class_id}&subject_id=${project.subject_id}`
    );
    setAverageReq(averageRequire);
    // console.log(averageRequire);
    // console.log(barChartArr);
    setLoadingFilterData(false);
    setLoadingSelectData(true);
  };

  const fetchAllData = async () => {
    (IsManager() || IsAdmin()) &&
      fetchUserDashboardAdmin(
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
      fetchUserDashboardStudent(
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
  const fetchFilterData = async (
    searchClassParams,
    option,
    isSelectMonthWeek
  ) => {
    // console.log(option, isSelectMonthWeek);
    (IsManager() || IsAdmin()) &&
      fetchFilterUserDashboardAdmin(
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
        setMembers,
        setClassId,
        // option,
        // projectId,
        // handleWeekOptions,
        // isDateWithinRange,
        setIssueStatus,
        setLineChart,
        setIssueCard,
        setBarChart,
        setIssueTypes,
        setAverageReq,
        setLoadingSelectData,
        setLoadingFilterData,
        setSelectedWeek,
        generateWeekOptions,
        setProject,
        isSelectMonthWeek,
        option,
        memberId
      );
    (IsTeacher() || IsStudent()) &&
      fetchFilterUserDashboardStudent(
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
        setMembers,
        setClassId,
        setIssueStatus,
        setLineChart,
        setIssueCard,
        setBarChart,
        setIssueTypes,
        setAverageReq,
        setLoadingSelectData,
        setLoadingFilterData,
        setSelectedWeek,
        generateWeekOptions,
        setProject,
        isSelectMonthWeek,
        option,
        memberId
      );
  };

  const fetchClassData = async (classId, option, isSelectMonthWeek) => {
    fetchClassAuth(
      classId,
      currentUser,
      IsStudent,
      IsTeacher,
      setProjectOpt,
      setSearchProjectParams,
      setLoadingData,
      isSelectMonthWeek,
      option,
      setSelectedWeek,
      generateWeekOptions,
      setProject,
      setMembers,
      setIssueStatus,
      setLineChart,
      setIssueCard,
      setBarChart,
      setLoadingSelectData,
      setLoadingFilterData,
      setIssueTypes,
      setAverageReq,
      memberId
    );
  };

  const fetchProjectData = async (projectId, option, isSelectMonthWeek) => {
    fetchProjectAuth(
      projectId,
      classId,
      setProjectOpt,
      setLoadingData,
      isSelectMonthWeek,
      option,
      setSelectedWeek,
      generateWeekOptions,
      setProject,
      setMembers,
      setIssueStatus,
      setLineChart,
      setIssueCard,
      setBarChart,
      setLoadingSelectData,
      setLoadingFilterData,
      setIssueTypes,
      setAverageReq,
      memberId
    );
  };

  const fetchMemberData = async (projectId, option, isSelectMonthWeek) => {};
  const onFilter = (filter) => {
    setLoadingFilterData(true);
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
    setClassId(filter.value);
    fetchFilterData(newSearchParams, selectedWeek, isSelectedWeek);
  };

  const onClassFilter = (filter) => {
    setLoadingFilterData(true);
    setClassId(filter.value);
    fetchClassData(filter.value, selectedWeek, isSelectedWeek);
    // fetchWaitingListData(searchWaitingListParams, filter.value, true);
  };

  const onProjectFilter = (filter) => {
    setLoadingFilterData(true);
    fetchProjectData(filter.value, selectedWeek, isSelectedWeek);
    // fetchWaitingListData(searchWaitingListParams, filter.value, true);
  };

  const onMemberFilter = (filter, id) => {
    setLoadingFilterData(true);
    // console.log(filter);
    setMemberId(filter.value);
    fetchSelectData(selectedWeek, true, projectOpt, filter.value);
    // fetchMemberData(filter.value, selectedWeek, isSelectedWeek);
    // fetchWaitingListData(searchWaitingListParams, filter.value, true);
  };

  //--------------------- Filter------------------------

  const handleWeekChange = (value, obj) => {
    setLoadingFilterData(true);
    setSelectedWeek(obj);
    fetchSelectData(obj, true, projectOpt, memberId);
    setIsSelectedWeek(true);
    // console.log(value);
  };

  //----------------------------------------------------
  const students = [
    {
      student_id: "1",
      student_name: "Ichigo",
    },
  ];

  // fetchData();
  useEffect(() => {
    fetchAllData();
    fetchFilterData(searchClassParams, selectedWeek, isSelectedWeek);
    // fetchDataSelect();
    // fetchSelectData();
    setIsSelectClass(true);
    setLoading(true)
  }, []);
  return (
    <>
      {/* {console.log(loadingData, loadingSelectData)} */}
      <NavbarDashboard
        spin={ loading &&
          loadingData &&
          loadingSelectData 
        }
        position="user_dashboard"
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1 ">
            <div className="card custom-card mb-0 d-flex flex-column flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0 " style={{ paddingBottom: 20 }}>
                    User Dashboard
                  </h3>
                </div>
                {/* <DemoData/> */}
                <div className="row">
                  <div className="col-5">
                    <div className="mt-2">
                      {loadingData &&
                        loadingSubject &&
                        loadingClass &&
                        loadingSemester && (
                          <FilterDashboard
                            semesters={semesters}
                            subjects={subjects}
                            classes={classes}
                            projects={projects}
                            onFilter={onFilter}
                            setIsSelectClass={setIsSelectClass}
                            onClassFilter={onClassFilter}
                            onProjectFilter={onProjectFilter}
                          />
                        )}
                    </div>
                    <div className="row mb-1 mt-5">
                      {" "}
                      <h6 style={{fontWeight: "bold"}}>Project Issue Statics By Week</h6>
                      {/* <MonthWeekSelector
                        onWeekChange={handleWeekChange}
                        months={months}
                        weeks={weeks}
                        selectedMonth={selectedMonth}
                        selectedWeek={selectedWeek}
                        handleMonthChange={handleMonthChange}
                        handleWeekChange={handleWeekChange}
                      /> */}
                      <div className="col-6">
                        <MonthWeekProjectSelector
                          selectedWeek={selectedWeek}
                          handleWeekChange={handleWeekChange}
                          generateWeekOptions={generateWeekOptions}
                        />
                      </div>
                      <div className="col-6">
                        <BaseSelectInput
                          isLabel={false}
                          id="assignee"
                          type="class_student"
                          options={members}
                          defaultValue="all"
                          isFilterBasic={true}
                          onFilter={onMemberFilter}
                          placeholder="Member"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    {loadingData && loadingSelectData && (
                      <IssueBarChart barChart={barChart} />
                    )}
                  </div>

                  <div className="col-3  mt-4">
                    <div
                      className="average-card w-100"
                      style={{
                        backgroundColor: "#eeeeee",
                        width: "300px",
                        height: "70px",
                        textAlign: "center",
                        paddingTop: "11px",
                      }}
                    >
                      <span>{handleSecondDecimal(averageReq.averageRequirementCount)}</span>
                      <p>Average project requirement</p>
                    </div>
                    <div
                      className="average-card mt-5 w-100"
                      style={{
                        backgroundColor: "#eeeeee",
                        width: "300px",
                        height: "70px",
                        textAlign: "center",
                        paddingTop: "11px",
                      }}
                    >
                      <span>{handleSecondDecimal(averageReq.requirementCount)}</span>
                      <p>Total project requirement</p>
                    </div>
                  </div>
                </div>
                {/* <h2>{projectOpt.group_name}</h2> */}
                <div>
                {console.log(loadingData ,
                    loadingSelectData ,
                    projectOpt !== undefined ,
                    issueTypes.length !== 0 ,
                    classOpt.length !== 0)}
                  {!loadingFilterData && loadingData && loadingSelectData ? (
                    loadingData &&
                    loadingSelectData &&
                    projectOpt !== undefined &&
                    classOpt.length !== 0 &&
                    issueTypes.length !== 0 ? (
                      issueTypes.issue_types.map((issueType) => (
                        <div key={issueType.issue_setting_id}>
                          <a
                            className="mx-2"
                            style={{ color: "blue", fontWeight: "bold" }}
                            onClick={() =>
                              navigate(
                                `/issue-list/${projectOpt.project_id}/${issueType.issue_setting_id}`
                              )
                            }
                          >
                            {issueType.issue_value}
                          </a>
                          {!loadingFilterData &&
                          loadingData &&
                          loadingSelectData ? (
                            <UserDashboardChart
                              lineChart={lineChart}
                              issueStatus={issueStatus}
                              issueCard={issueCard}
                              issueTypes={issueType.issue_value}
                              loadingData={loadingData}
                            />
                          ) : (
                            <Spin
                              tip="Loading"
                              size="large"
                              style={{ minHeight: "100vh" }}
                            >
                              <UserDashboardChart
                                lineChart={lineChart}
                                issueStatus={issueStatus}
                                issueCard={issueCard}
                                issueTypes={issueType.issue_value}
                                loadingData={loadingData}
                              />
                            </Spin>
                          )}
                        </div>
                      ))
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )
                  ) : (
                    <Spin
                      tip="Loading"
                      size="large"
                      style={{ minHeight: "100vh" }}
                    >
                      {loadingData &&
                      loadingSelectData &&
                      projectOpt !== undefined &&
                      issueTypes.length !== 0 &&
                      classOpt.length !== 0 ? (
                        issueTypes.issue_types.map((issueType) => (
                          <div key={issueType.issue_setting_id}>
                            <a
                              className="mx-2"
                              style={{ color: "blue", fontWeight: "bold" }}
                              onClick={() =>
                                navigate(
                                  `/issue-list/${projectOpt.project_id}/${issueType.issue_setting_id}`
                                )
                              }
                            >
                              {issueType.issue_value}
                            </a>
                            {/* {!loadingFilterData &&
                            loadingData &&
                            loadingSelectData ? ( */}
                            <UserDashboardChart
                              lineChart={lineChart}
                              issueStatus={issueStatus}
                              issueCard={issueCard}
                              issueTypes={issueType.issue_value}
                              loadingData={loadingData}
                            />
                            {/* ) : (
                              <Spin
                                tip="Loading"
                                size="large"
                                style={{ minHeight: "100vh" }}
                              >
                                <UserDashboardChart
                                  lineChart={lineChart}
                                  issueStatus={issueStatus}
                                  issueCard={issueCard}
                                  issueTypes={issueType.issue_value}
                                  loadingData={loadingData}
                                />
                              </Spin>
                            )} */}
                          </div>
                        ))
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Spin>
                  )}
                </div>
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};

export default UserDashboard;
