import moment from "moment";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum, FilterOperatorEnum, StatusEnum } from "src/enum/Enum";

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
const handleClassFilterCondition = (
  studentArr,
  currentUser,
  IsStudent,
  IsTeacher
) => {
  // console.log(studentArr)
  let classFilterArr = [];
  if (IsStudent()) {
    studentArr.length !== 0
      ? studentArr.map((ele, index) => {
          if (studentArr.length > 0) {
            if (index === 0 && studentArr.length > 1) {
              classFilterArr.push({
                field: "class_id",
                value: ele.class_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
                parenthesis: FilterOperatorEnum.OpenParenthesis,
              });
            } else if (index > 0) {
              classFilterArr.push({
                field: "class_id",
                value: ele.class_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
              });
            }
            if (index > 0 && index === studentArr.length - 1) {
              classFilterArr.push({
                field: "created_by",
                value: currentUser.user_id,
                condition: ConditionEnum.Equal,
                parenthesis: FilterOperatorEnum.CloseParenthesis,
              });
            }
          }
        })
      : classFilterArr.push({
          field: "created_by",
          value: currentUser.user_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
        });
  } else if (IsTeacher()) {
    classFilterArr.push(
      {
        field: "created_by",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
        operator: FilterOperatorEnum.OR,
        parenthesis: FilterOperatorEnum.OpenParenthesis,
      },
      {
        field: "teacher_id",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
        parenthesis: FilterOperatorEnum.CloseParenthesis,
      }
    );
  }
  return classFilterArr;
};
const handleProjectFilterCondition = (
  studentArr,
  currentUser,
  IsStudent,
  IsTeacher
) => {
  let projectFilterArr = [];
  console.log(studentArr);
  if (IsStudent()) {
    studentArr.length !== 0
      ? studentArr.map((ele, index) => {
          if (studentArr.length > 0) {
            if (index === 0 && studentArr.length > 1) {
              projectFilterArr.push({
                field: "project_id",
                value: ele.project_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
                parenthesis: FilterOperatorEnum.OpenParenthesis,
              });
            } else if (index > 0) {
              projectFilterArr.push({
                field: "project_id",
                value: ele.project_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
              });
            }
            if (index > 0 && index === studentArr.length - 1) {
              projectFilterArr.push({
                field: "created_by",
                value: currentUser.user_id,
                condition: ConditionEnum.Equal,
                parenthesis: FilterOperatorEnum.CloseParenthesis,
              });
            }
          }
        })
      : projectFilterArr.push({
          field: "created_by",
          value: currentUser.user_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
        });
  } else if (IsTeacher()) {
    projectFilterArr = [];
  }
  return projectFilterArr;
};

const handleFilterChartProjectCondition = async (
  isSelectMonthWeek,
  option,
  setSelectedWeek,
  generateWeekOptions,
  projectList,
  setProject,
  setIssueStatus,
  setLineChart,
  setIssueCard,
  setBarChart,
  setLoadingSelectData,
  setAverageReq,
  setIssueTypes,
  setMembers,
  classId,
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
  console.log(projectList);
  if (projectList.length === 0) {
    setMembers([]);
    console.log(projectList);
  } else {
    let newMemberSearchParam = [
      {
        field: "project_id",
        value: projectList[0].project_id,
        condition: ConditionEnum.Equal,
      },
      {
        field: "class_id",
        value: classId,
        condition: ConditionEnum.Equal,
      },
    ];
    const { data: member } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      newMemberSearchParam
    );
    setMembers(member);

    let assignee = "";
    if (memberId !== "all") {
      assignee = `&assignee_id=${memberId}`;
    }

    const { data: averageRequire } = await axiosClient.post(
      `Issue/GetRequirementTracker?projectId=${projectList[0].project_id}&class_id=${projectList[0].class_id}&subject_id=${projectList[0].subject_id}${assignee}`
    );

    setAverageReq(averageRequire);

    const { data: project } = await axiosClient.get(
      `/Project/${projectList[0].project_id}`
    );
    setProject(project);

    const { data: issueStatusArr } = await axiosClient.post(
      `Issue/GetIssueStatusPercentageTracker?projectId=${projectList[0].project_id}&class_id=${projectList[0].class_id}&subject_id=${projectList[0].subject_id}${assignee}`
    );
    setIssueStatus(issueStatusArr);
    // console.log(issueStatusArr);

    const { data: issueArr } = await axiosClient.post(
      `Issue/GetIssueStatusTracker?projectId=${projectList[0].project_id}&class_id=${projectList[0].class_id}&subject_id=${projectList[0].subject_id}&from=${from_date}&to=${to_date}${assignee}`
    );
    setLineChart(issueArr);
    // console.log(issueArr);
    const { data: issueCardArr } = await axiosClient.post(
      `Issue/GetIssueMonthlyTracker?projectId=${projectList[0].project_id}&class_id=${projectList[0].class_id}&subject_id=${projectList[0].subject_id}${assignee}`
    );
    setIssueCard(issueCardArr);
    // console.log(issueCardArr);
    const { data: barChartArr } = await axiosClient.post(
      `Issue/GetRequirementIssueTracker?projectId=${projectList[0].project_id}&class_id=${projectList[0].class_id}&subject_id=${projectList[0].subject_id}${assignee}`
    );
    setBarChart(barChartArr);

    const { data: issueTypes } = await axiosClient.post(
      `IssueSetting/GetDataCombobox?project_id=${projectList[0].project_id}&class_id=${projectList[0].class_id}&subject_id=${projectList[0].subject_id}`
    );
    // console.log(issueTypes);
    setIssueTypes(issueTypes);
  }

  // console.log(barChartArr);
  setLoadingSelectData(true);
};

const fetchUserDashboardStudent = async (
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
) => {
  const { data: studentArr } = await axiosClient.post(
    "/ClassStudent/GetFilterData?sortString=created_date ASC",
    [
      {
        field: "student_id",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
      },
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNotNull,
      },
    ]
  );
  let classFilter = handleClassFilterCondition(
    studentArr,
    currentUser,
    IsStudent,
    IsTeacher
  );
  //   classFilter.push({
  //     field: "status",
  //     value: StatusEnum.Inactive,
  //     condition: ConditionEnum.NotEqual,
  //   });

  const { data: classArr } = await axiosClient.post(
    "/Class/GetFilterData?sortString=created_date ASC",
    classFilter
  );
  console.log(classFilter);
  setClasses(classArr);
  setSearchClassParams(classFilter);
  setLoadingClass(true);

  setSubjects(getUnique(classArr, "subject_id"));
  setLoadingSubject(true);
  let projectFilter = handleProjectFilterCondition(
    studentArr,
    currentUser,
    IsStudent,
    IsTeacher
  );
  let projectParams =
    classArr.length === 0
      ? []
      : [
          {
            field: "class_id",
            value: classArr[0].class_id,
            condition: ConditionEnum.Equal,
          },
        ];
  const { data: projectList } = await axiosClient.post(
    "/Project/GetFilterData?sortString=created_date ASC",
    projectFilter
  );
  setProjects(projectList);
  console.log(projectFilter);
  setLoadingData(true);
};

const fetchUserDashboardAdmin = async (
  searchClassParams,
  setClasses,
  setSearchClassParams,
  setLoadingClass,
  setSubjects,
  setLoadingSubject,
  setProjects,
  setLoadingData
) => {
  const { data: classArr } = await axiosClient.post(
    "/Class/GetFilterData?sortString=created_date ASC",
    searchClassParams
  );
  setClasses(classArr);
  // console.log(searchClassParams)
  setSearchClassParams(searchClassParams);
  setLoadingClass(true);
  //   console.log("all", classArr);

  setSubjects(getUnique(classArr, "subject_id"));
  setLoadingSubject(true);

  let projectParams =
    classArr.length === 0
      ? []
      : [
          {
            field: "class_id",
            value: classArr[0].class_id,
            condition: ConditionEnum.Equal,
          },
        ];
  const { data: projectList } = await axiosClient.post(
    "/Project/GetFilterData?sortString=created_date ASC",
    []
  );
  setProjects(projectList);
  // setProjectOpt(projectList);
  setLoadingData(true);
  // setLoadingAll(true);
};

const fetchFilterUserDashboardAdmin = async (
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
) => {
  const { data: systemSettingArr } = await axiosClient.post(
    `/Setting/GetFilterData?sortString=display_order ASC`,
    [
      {
        field: "data_group",
        value: "2",
        condition: ConditionEnum.Equal,
      },
      {
        field: "status",
        value: StatusEnum.Inactive,
        condition: ConditionEnum.NotEqual,
      },
    ]
  );
  setSemesters(systemSettingArr);
  setLoadingSemester(true);

  let newSearchClassParams = [
    ...searchClassParams,
    {
      field: "semester_id",
      value:
        systemSettingArr.length !== 0 ? systemSettingArr[0].setting_id : "",
      condition: ConditionEnum.Equal,
    },
  ];

  const { data: classArr } = await axiosClient.post(
    "/Class/GetFilterData?sortString=created_date ASC",
    isSelectClass ? searchClassParams : newSearchClassParams
  );
  setClassOpt(classArr);
  setSearchClassParams(searchClassParams);
  setLoadingClass(true);

  setSubjectOpt(getUnique(classArr, "subject_id"));
  setLoadingSubject(true);
  // console.log(getUnique(classArr, "subject_id"));

  let newSearchProjectParams = [...searchProjectParams];
  newSearchProjectParams = [
    {
      field: "class_id",
      value: classArr.length !== 0 ? classArr[0].class_id : "",
      condition: ConditionEnum.Equal,
    },
  ];
  classArr.length !== 0 ? setClassId(classArr[0].class_id) : "";
  setClassObj(classArr.length !== 0 ? classArr[0] : "");
  const { data: projectList } = await axiosClient.post(
    "/Project/GetFilterData?sortString=created_date ASC",
    newSearchProjectParams
  );
  // console.log(projectList);
  setProjectOpt(projectList[0]);
  setSearchProjectParams(newSearchProjectParams);

  // setIssueTypes(issueTypes);
  console.log(projectList);
  if (projectList.length !== 0) {
    let newMemberSearchParam = [
      {
        field: "project_id",
        value: projectList[0].project_id,
        condition: ConditionEnum.Equal,
      },
      {
        field: "class_id",
        value: classArr[0].class_id,
        condition: ConditionEnum.Equal,
      },
    ];
    handleFilterChartProjectCondition(
      isSelectMonthWeek,
      option,
      setSelectedWeek,
      generateWeekOptions,
      projectList,
      setProject,
      setIssueStatus,
      setLineChart,
      setIssueCard,
      setBarChart,
      setLoadingSelectData,
      setAverageReq,
      setIssueTypes,
      setMembers,
      classArr[0].class_id,
      memberId
    );
  } else {
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
  }

  // setLoadingSelectData(true);
  setLoadingFilterData(false);
  setLoadingData(true);
};

const fetchFilterUserDashboardStudent = async (
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
) => {
  let newSearchClassParams = [];
  const { data: studentArr } = await axiosClient.post(
    "/ClassStudent/GetFilterData?sortString=created_date ASC",
    [
      {
        field: "student_id",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
      },
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNotNull,
      },
    ]
  );
  const { data: systemSettingArr } = await axiosClient.post(
    `/Setting/GetFilterData?sortString=display_order ASC`,
    [
      {
        field: "data_group",
        value: "2",
        condition: ConditionEnum.Equal,
      },
      {
        field: "status",
        value: StatusEnum.Inactive,
        condition: ConditionEnum.NotEqual,
      },
    ]
  );
  setSemesters(systemSettingArr);
  setLoadingSemester(true);

  // console.log(searchClassParams);
  newSearchClassParams = [
    ...searchClassParams,
    {
      field: "semester_id",
      value:
        systemSettingArr.length !== 0 ? systemSettingArr[0].setting_id : "",
      condition: ConditionEnum.Equal,
    },
  ];

  let classFilter = handleClassFilterCondition(
    studentArr,
    currentUser,
    IsStudent,
    IsTeacher
  );
  classFilter.map((ele) => newSearchClassParams.push(ele));
  // console.log(newSearchClassParams);
  const { data: classArr } = await axiosClient.post(
    "/Class/GetFilterData?sortString=created_date ASC",
    isSelectClass ? searchClassParams : newSearchClassParams
  );
  // console.log(newSearchClassParams);
  setClassOpt(classArr);
  setSearchClassParams(searchClassParams);
  setLoadingClass(true);

  setSubjectOpt(getUnique(classArr, "subject_id"));
  setLoadingSubject(true);
  // console.log(getUnique(classArr, "subject_id"));

  let newSearchProjectParams = [...searchProjectParams];
  newSearchProjectParams = [
    {
      field: "class_id",
      value: classArr.length !== 0 ? classArr[0].class_id : "",
      condition: ConditionEnum.Equal,
    },
  ];
  let projectFilter = handleProjectFilterCondition(
    studentArr,
    currentUser,
    IsStudent,
    IsTeacher
  );
  projectFilter.map((ele) => newSearchProjectParams.push(ele));

  if (classArr.length !== 0) {
    classArr[0].teacher_id === currentUser.user_id &&
      (newSearchProjectParams = [
        {
          field: "class_id",
          value: classArr[0].class_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
        },
      ]);
  }

  setClassObj(classArr.length !== 0 ? classArr[0] : "");
  classArr.length !== 0 ? setClassId(classArr[0].class_id) : "";
  const { data: projectList } = await axiosClient.post(
    "/Project/GetFilterData?sortString=created_date ASC",
    newSearchProjectParams
  );
  // console.log(projectList);
  setProjectOpt(projectList[0]);
  console.log(projectList);
  console.log(newSearchProjectParams);
  console.log(classArr);
  console.log(projectFilter);
  setSearchProjectParams(newSearchProjectParams);
  if (projectList.length !== 0) {
    console.log(newSearchProjectParams);
    handleFilterChartProjectCondition(
      isSelectMonthWeek,
      option,
      setSelectedWeek,
      generateWeekOptions,
      projectList,
      setProject,
      setIssueStatus,
      setLineChart,
      setIssueCard,
      setBarChart,
      setLoadingSelectData,
      setAverageReq,
      setIssueTypes,
      setMembers,
      classArr[0].class_id,
      memberId
    );
  } else {
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
  }

  setLoadingSelectData(true);
  setLoadingFilterData(false);
  setLoadingData(true);
};

const fetchClassAuth = async (
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
) => {
  const { data: studentArr } = await axiosClient.post(
    "/ClassStudent/GetFilterData?sortString=created_date ASC",
    [
      {
        field: "student_id",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
      },
    ]
  );

  let projectFilter = [];
  (IsStudent() || IsTeacher()) &&
    (projectFilter = handleProjectFilterCondition(
      studentArr,
      currentUser,
      IsStudent,
      IsTeacher
    ));
  if (IsStudent() || IsTeacher()) {
    projectFilter = handleProjectFilterCondition(
      studentArr,
      currentUser,
      IsStudent,
      IsTeacher
    );
  }
  projectFilter.push({
    field: "class_id",
    value: classId,
    condition: ConditionEnum.Equal,
  });
  const { data: projectList } = await axiosClient.post(
    "/Project/GetFilterData?sortString=created_date ASC",
    projectFilter
  );

  setProjectOpt(projectList[0]);

  handleFilterChartProjectCondition(
    isSelectMonthWeek,
    option,
    setSelectedWeek,
    generateWeekOptions,
    projectList,
    setProject,
    setIssueStatus,
    setLineChart,
    setIssueCard,
    setBarChart,
    setLoadingSelectData,
    setAverageReq,
    setIssueTypes,
    setMembers,
    classId,
    memberId
  );
  // setSearchProjectParams(projectFilter);
  setLoadingFilterData(false);
  setLoadingData(true);
};

const fetchProjectAuth = async (
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
) => {
  let newSearchProjectParams = [];
  projectId === "all"
    ? (newSearchProjectParams = [
        {
          field: "class_id",
          value: classId,
          condition: ConditionEnum.Equal,
        },
      ])
    : (newSearchProjectParams = [
        {
          field: "project_id",
          value: projectId,
          condition: ConditionEnum.Equal,
        },
      ]);
  const { data: projectList } = await axiosClient.post(
    "/Project/GetFilterData?sortString=created_date ASC",
    newSearchProjectParams
  );
  setProjectOpt(projectList[0]);

  handleFilterChartProjectCondition(
    isSelectMonthWeek,
    option,
    setSelectedWeek,
    generateWeekOptions,
    projectList,
    setProject,
    setIssueStatus,
    setLineChart,
    setIssueCard,
    setBarChart,
    setLoadingSelectData,
    setAverageReq,
    setIssueTypes,
    setMembers,
    classId,
    memberId
  );

  setLoadingFilterData(false);
  setLoadingData(true);
};
export {
  fetchFilterUserDashboardAdmin,
  fetchFilterUserDashboardStudent,
  fetchUserDashboardAdmin,
  fetchUserDashboardStudent,
  fetchClassAuth,
  fetchProjectAuth,
};
