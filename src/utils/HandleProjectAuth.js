import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum, FilterOperatorEnum, StatusEnum } from "src/enum/Enum";
import { encodeParam } from "./handleEnDecode";

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
  let classFilterArr = [];
  console.log("a", studentArr);
  if (IsStudent()) {
    studentArr.length !== 0
      ? studentArr.map((ele, index) => {
          if (studentArr.length > 0) {
            if (index === 0) {
              classFilterArr.push({
                field: "class_id",
                value: ele.class_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
                parenthesis: FilterOperatorEnum.OpenParenthesis,
              });
            }
            if (index > 0 && studentArr.length > 1) {
              classFilterArr.push({
                field: "class_id",
                value: ele.class_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
              });
            }
            if (index === studentArr.length - 1) {
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
  if (IsStudent()) {
    studentArr.length !== 0
      ? studentArr.map((ele, index) => {
          if (studentArr.length > 0) {
            if (index === 0) {
              projectFilterArr.push({
                field: "project_id",
                value: ele.project_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
                parenthesis: FilterOperatorEnum.OpenParenthesis,
              });
            }
            if (index > 0 && studentArr.length > 1) {
              projectFilterArr.push({
                field: "project_id",
                value: ele.project_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
              });
            }
            if (index === studentArr.length - 1) {
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

const fetchProjectStudent = async (
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

const fetchProjectAdmin = async (
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

const fetchFilterAdminOld = async (
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
  setLoadingWaitingData
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
  setClassOpt(classArr[0]);
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

  if (classArr.length !== 0) {
    const { data: projectList } = await axiosClient.post(
      `/Project/GetProjectStudent?class_id=${classArr[0].class_id}`
    );
    // const { data: projectList } = await axiosClient.post(
    //   "/Project/GetFilterData?sortString=created_date ASC",
    //   newSearchProjectParams
    // );
    // console.log(projectList);
    setProjectOpt(projectList);
    setSearchProjectParams(newSearchProjectParams);
    const newSearchWaitingListParams = [
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNull,
      },
      {
        field: "class_id",
        value: classArr.length !== 0 ? classArr[0].class_id : "",
        condition: ConditionEnum.Equal,
      },
      {
        field: "status",
        value: StatusEnum.Inactive,
        condition: ConditionEnum.NotEqual,
      },
    ];
    const { data, err } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      newSearchWaitingListParams
    );

    setWaitingListStudents(data);
    setSearchWaitingListParams(searchWaitingListParams);
    // fetchFilterData(searchClassParams);
    setLoadingWaitingData(true);
    setLoadingData(true);
  } else {
    setProjectOpt([]);
    setLoadingWaitingData(true);
    setLoadingData(true);
  }
};
const fetchFilterAdmin = async (
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

  let semesterParams = {
    key: systemSettingArr[0].setting_id,
    value: systemSettingArr[0].setting_value,
  };
  const { data: classArr } = await axiosClient.post(
    "/Class/GetFilterData?sortString=created_date ASC",
    isSelectClass ? searchClassParams : newSearchClassParams
  );
  setClassOpt(classArr[0]);
  setSearchClassParams(searchClassParams);
  setLoadingClass(true);

  setSubjectOpt(getUnique(classArr, "subject_id"));
  let subjectParams = {
    key: getUnique(classArr, "subject_id")[0].subject_id,
    value: getUnique(classArr, "subject_id")[0].subject_code,
  };
  setLoadingSubject(true);
  // console.log(getUnique(classArr, "subject_id"));

  // let newSearchProjectParams = [...searchProjectParams];
  // newSearchProjectParams = [
  //   {
  //     field: "class_id",
  //     value: classArr.length !== 0 ? classArr[0].class_id : "",
  //     condition: ConditionEnum.Equal,
  //   },
  // ];
  classArr.length !== 0 ? setClassId(classArr[0].class_id) : "";
  setClassObj(classArr.length !== 0 ? classArr[0] : "");
  let classParams = {
    key: classArr[0],
    value: classArr[0].class_code,
  };
  // const { data: projectList } = await axiosClient.post(
  //   "/Project/GetFilterData?sortString=created_date ASC",
  //   newSearchProjectParams
  // );
  // // console.log(projectList);
  // setProjectOpt(projectList);
  // setSearchProjectParams(newSearchProjectParams);

  if (classArr.length !== 0) {
    const { data: projectList } = await axiosClient.post(
      `/Project/GetProjectStudent?class_id=${classArr[0].class_id}&sortString=created_date ASC`,
      []
    );
    setProjectOpt(projectList);

    const newSearchWaitingListParams = [
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNull,
      },
      {
        field: "class_id",
        value: classArr.length !== 0 ? classArr[0].class_id : "",
        condition: ConditionEnum.Equal,
      },
      {
        field: "status",
        value: StatusEnum.Inactive,
        condition: ConditionEnum.NotEqual,
      },
    ];
    const { data, err } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      newSearchWaitingListParams
    );
    setWaitingListStudents(data);
    setSearchWaitingListParams(searchWaitingListParams);
    let projectParams = {
      key: "all",
      value: "all",
    };
  } else {
    setProjectOpt([]);
    setWaitingListStudents([]);
  }

  // fetchFilterData(searchClassParams);
  setLoadingWaitingData(true);
  setLoadingData(true);
};

const fetchFilterDecodeAdmin = async (
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

  let semesterParams = {
    key: systemSettingArr[0].setting_id,
    value: systemSettingArr[0].setting_value,
  };
  const { data: classArr } = await axiosClient.post(
    "/Class/GetFilterData?sortString=created_date ASC",
    isSelectClass ? searchClassParams : newSearchClassParams
  );
  setClassOpt(classArr[0]);
  setSearchClassParams(searchClassParams);
  setLoadingClass(true);

  setSubjectOpt(getUnique(classArr, "subject_id"));
  setLoadingSubject(true);
  // console.log(getUnique(classArr, "subject_id"));

  let newSearchProjectParams = [...searchProjectParams];
  newSearchProjectParams = [
    {
      field: "class_id",
      value: classDecode !== null ? classDecode.class_id : "",
      condition: ConditionEnum.Equal,
    },
  ];
  classDecode !== null ? setClassId(classDecode.class_id) : "";
  setClassObj(classDecode !== null ? classDecode : "");

  const { data: projectList } = await axiosClient.post(
    "/Project/GetFilterData?sortString=created_date ASC",
    newSearchProjectParams
  );
  // console.log(projectList);
  setProjectOpt(projectList);
  setSearchProjectParams(newSearchProjectParams);

  if (classDecode !== null) {
    if (projectDecode.project_code === "all") {
      const { data: projectList } = await axiosClient.post(
        `/Project/GetProjectStudent?class_id=${classDecode.class_id}&sortString=created_date ASC`,
        []
      );
      setProjectOpt(projectList);
    } else {
      const { data: projectList } = await axiosClient.post(
        `/Project/GetProjectStudent?class_id=${classDecode.class_id}&sortString=created_date ASC`,
        [
          {
            field: "project_id",
            value: projectDecode.project_id,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setProjectOpt(projectList);
    }

    console.log(projectDecode);

    const newSearchWaitingListParams = [
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNull,
      },
      {
        field: "class_id",
        value: classDecode !== null ? classDecode.class_id : "",
        condition: ConditionEnum.Equal,
      },
      {
        field: "status",
        value: StatusEnum.Inactive,
        condition: ConditionEnum.NotEqual,
      },
    ];
    const { data, err } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      newSearchWaitingListParams
    );
    setWaitingListStudents(data);
    setSearchWaitingListParams(searchWaitingListParams);
  } else {
    setProjectOpt([]);
    setWaitingListStudents([]);
  }

  // fetchFilterData(searchClassParams);
  setLoadingWaitingData(true);
  setLoadingData(true);
};

const fetchFilterStudent = async (
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
  setLoadingWaitingData
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

  const { data: classArr } = await axiosClient.post(
    "/Class/GetFilterData?sortString=created_date ASC",
    isSelectClass ? searchClassParams : newSearchClassParams
  );
  // console.log(searchClassParams);
  setClassOpt(classArr[0]);
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
  console.log(projectFilter);
  if (classArr.length !== 0) {
    classArr[0].teacher_id === currentUser.user_id &&
      (newSearchProjectParams = [
        {
          field: "class_id",
          value: classArr[0].class_id,
          condition: ConditionEnum.Equal,
        },
      ]);
    const { data: projectList } = await axiosClient.post(
      `/Project/GetProjectStudent?class_id=${classArr[0].class_id}&sortString=created_date ASC`,
      newSearchProjectParams
    );
    setProjectOpt(projectList);
  } else {
    setProjectOpt([]);
  }

  setClassObj(classArr.length !== 0 ? classArr[0] : "");
  classArr.length !== 0 ? setClassId(classArr[0].class_id) : "";
  // const { data: projectList } = await axiosClient.post(
  //   "/Project/GetFilterData?sortString=created_date ASC",
  //   newSearchProjectParams
  // );
  setSearchProjectParams(newSearchProjectParams);

  const newSearchWaitingListParams = [
    {
      field: "project_id",
      value: "",
      condition: ConditionEnum.IsNull,
    },
    {
      field: "class_id",
      value: classArr.length !== 0 ? classArr[0].class_id : "",
      condition: ConditionEnum.Equal,
    },
    {
      field: "status",
      value: StatusEnum.Inactive,
      condition: ConditionEnum.NotEqual,
    },
  ];
  const { data, err } = await axiosClient.post(
    `/ClassStudent/GetFilterData?sortString=created_date ASC`,
    newSearchWaitingListParams
  );

  setWaitingListStudents(data);
  setSearchWaitingListParams(searchWaitingListParams);
  // fetchFilterData(searchClassParams);
  setLoadingWaitingData(true);
  setLoadingData(true);
};

const fetchClassAuth = async (
  classId,
  currentUser,
  IsStudent,
  IsTeacher,
  setProjectOpt,
  setClassOpt,
  setClassObj,
  setSearchProjectParams,
  setLoadingData
) => {
  // const { data: studentArr } = await axiosClient.post(
  //   "/ClassStudent/GetFilterData?sortString=created_date ASC",
  //   [
  //     {
  //       field: "student_id",
  //       value: currentUser.user_id,
  //       condition: ConditionEnum.Equal,
  //     },
  //   ]
  // );

  let projectFilter = [];
  // (IsStudent() || IsTeacher()) &&
  //   (projectFilter = handleProjectFilterCondition(
  //     studentArr,
  //     currentUser,
  //     IsStudent,
  //     IsTeacher
  //   ));
  // if (IsStudent() || IsTeacher()) {
  //   projectFilter = handleProjectFilterCondition(
  //     studentArr,
  //     currentUser,
  //     IsStudent,
  //     IsTeacher
  //   );
  // }
  const { data: classItem } = await axiosClient.get(`/Class/${classId}`);
  setClassOpt(classItem);
  setClassObj(classItem);

  // projectFilter.push({
  //   field: "class_id",
  //   value: classId,
  //   condition: ConditionEnum.Equal,
  // });
  // const { data: projectList } = await axiosClient.post(
  //   "/Project/GetFilterData?sortString=created_date ASC",
  //   [
  //     {
  //       field: "class_id",
  //       value: classId,
  //       condition: ConditionEnum.Equal,
  //     },
  //   ]
  // );
  const { data: projectList } = await axiosClient.post(
    `/Project/GetProjectStudent?class_id=${classId}&sortString=created_date ASC`,
    []
  );
  setProjectOpt(projectList);
  // console.log(projectList);
  // setProjectOpt(projectList);
  // setSearchProjectParams(projectFilter);
  setLoadingData(true);
};

const fetchClassDecodeAuth = async (
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
) => {
  let projectFilter = [];
  // if(classDecode !== null) {
  //   const { data: classItem } = await axiosClient.get(
  //     `/Class/${classDecode.class_id}`
  //   );
  //   setClassOpt(classItem);
  //   setClassObj(classItem);
  // } 
  console.log(classDecode)
  // console.log(classItem)

  const { data: projectList } = await axiosClient.post(
    `/Project/GetProjectStudent?class_id=${classDecode.class_id}&sortString=created_date ASC`,
    []
  );
  setProjectOpt(projectList);
  console.log(projectList);
  setLoadingData(true);
};
const fetchProjectAuth = async (
  projectId,
  classId,
  setProjectOpt,
  setLoadingData,
  setSearchParamsURL
) => {
  // let newSearchProjectParams = [];
  // projectId === "all"
  //   ? (newSearchProjectParams = [
  //       {
  //         field: "class_id",
  //         value: classId,
  //         condition: ConditionEnum.Equal,
  //       },
  //     ])
  //   : (newSearchProjectParams = [
  //       {
  //         field: "project_id",
  //         value: projectId,
  //         condition: ConditionEnum.Equal,
  //       },
  //     ]);
  // const { data: projectList } = await axiosClient.post(
  //   "/Project/GetFilterData?sortString=created_date ASC",
  //   newSearchProjectParams
  // );
  const { data: projectList } = await axiosClient.post(
    `/Project/GetProjectStudent?class_id=${classId}&sortString=created_date ASC`,
    []
  );
  let projects =
    projectId === "all"
      ? projectList
      : projectList.filter((ele) => ele.project_id === projectId);
  setProjectOpt(projects);
  // setSearchParamsURL({ project: encodeParam(projects) });
  setLoadingData(true);
};

const fetchProjectDecodeAuth = async (
  projectId,
  classId,
  setProjectOpt,
  setLoadingData,
  setSearchParamsURL,
  semesterItem,
  subjectItem,
  classItem,
  projectItem
) => {
  const { data: projectList } = await axiosClient.post(
    `/Project/GetProjectStudent?class_id=${classItem.class_id}&sortString=created_date ASC`,
    []
  );
  console.log(projectList);
  let projects =
    projectId === "all"
      ? projectList
      : projectList.filter((ele) => ele.project_id === projectId);
  setProjectOpt(projects);
  // setSearchParamsURL({ project: encodeParam(projects) });
  setLoadingData(true);
};
export {
  fetchFilterAdmin,
  fetchFilterDecodeAdmin,
  fetchFilterStudent,
  fetchProjectAdmin,
  fetchProjectStudent,
  fetchClassAuth,
  fetchClassDecodeAuth,
  fetchProjectAuth,
  fetchProjectDecodeAuth,
};
