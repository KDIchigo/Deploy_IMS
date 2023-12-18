import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import {
  ConditionEnum,
  FilterOperatorEnum,
  IssueSettingEnum,
  StatusEnum,
} from "src/enum/Enum";
import { HandleAuth } from "src/utils/handleAuth";
import "./IssueListPage.scss";
import { IssueType } from "./IssueType/IssueType";
import { IssueTypeAll } from "./IssueType/IssueTypeAll";
import {
  projectsByStudent,
  projectsByTeacher,
} from "src/utils/HandleIssueAuth";
import { useSearchParams } from "react-router-dom";
import { decodeParam, encodeParam } from "src/utils/handleEnDecode";
// const projectId = "35d4c71d-8bf0-42fb-8804-14d2c092dbf6";

export const IssueListPage = () => {
  const { projectId, issueTypeId } = useParams();
  const { currentUser, IsStudent, IsLeader, IsTeacher, IsManager, IsAdmin } =
    HandleAuth();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const projectParam = searchURLParams.get("projectParam");
  const tab = searchURLParams.get("tab");
  const param = searchURLParams.get("param");

  // console.log(projectId);
  // projectId === undefined && (projectId = "35d4c71d-8bf0-42fb-8804-14d2c092dbf6")
  // console.log(projectId)
  const navigate = useNavigate();
  const [spin, setSpin] = useState(false);
  const [milestonesCondition, setMilestonesCondition] = useState([]);
  const [isFilterProject, setIsFilterProject] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelectData, setLoadingSelectData] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [issueRequirements, setIssueRequirements] = useState([]);
  const [checkedProject, setCheckedProject] = useState();
  const [projectDecode, setProjectDecode] = useState(undefined);
  const [tabDecode, setTabDecode] = useState(undefined);
  const [issueSettings, setIssueSettings] = useState([]);
  const [searchParams, setSearchParams] = useState([
    {
      field: "issue_group",
      value: IssueSettingEnum.IssueType,
      condition: ConditionEnum.Equal,
    },
    {
      field: "project_id",
      value: projectId,
      condition: ConditionEnum.Equal,
    },
  ]);

  const handleTabClick = (key) => {
    // Do something when a tab is clicked
    setSearchParamsURL({
      projectParam: projectParam,
      tab: encodeParam(key),
      param: param,
    });
  };

  const fetchAllData = async (projectDecodeId) => {
    let projectList = [];
    let projectParam = [
      {
        field: "status",
        value: StatusEnum.Inactive,
        condition: ConditionEnum.NotEqual,
      },
    ];
    let isNull = false;
    // console.log(IsStudent(), currentUser);
    if (projectId === undefined) {
      if (IsStudent()) {
        const { data: classStudent } = await axiosClient.post(
          `/ClassStudent/GetFilterData?sortString=created_date ASC`,
          [
            {
              field: "student_id",
              value: currentUser.user_id,
              condition: ConditionEnum.Equal,
            },
          ]
        );
        classStudent.length !== 0
          ? classStudent
              .filter((ele) => ele.project_id !== null)
              .map((project) => {
                projectParam.push({
                  field: "project_id",
                  value: project.project_id,
                  condition: ConditionEnum.Equal,
                  operator: FilterOperatorEnum.OR,
                });
              })
          : (isNull = true);
        // projectsByStudent(currentUser, projectParam, isNull)
      } else if (IsTeacher()) {
        const { data: classItem } = await axiosClient.post(
          `/Class/GetFilterData?sortString=created_date ASC`,
          [
            {
              field: "teacher_id",
              value: currentUser.user_id,
              condition: ConditionEnum.Equal,
            },
          ]
        );
        let projectTeacherParam = [];
        classItem.length !== 0
          ? classItem.map((classEle) => {
              projectParam.push({
                field: "class_id",
                value: classEle.class_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
              });
            })
          : (isNull = true);
      } else if (IsManager()) {
        const { data: subjectItem } = await axiosClient.post(
          `/Subject/GetFilterData?sortString=created_date ASC`,
          [
            {
              field: "assignee_id",
              value: currentUser.user_id,
              condition: ConditionEnum.Equal,
            },
          ]
        );
        let classManagerParam = [];
        if (subjectItem.length !== 0) {
          subjectItem.map((subjectEle) => {
            classManagerParam.push({
              field: "subject_id",
              value: subjectEle.subject_id,
              condition: ConditionEnum.Equal,
              operator: FilterOperatorEnum.OR,
            });
          });
          const { data: classItem } = await axiosClient.post(
            `/Class/GetFilterData?sortString=created_date ASC`,
            classManagerParam
          );
          if (classItem.length !== 0) {
            classItem.map((classEle) => {
              projectParam.push({
                field: "class_id",
                value: classEle.class_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
              });
            });
          } else {
            isNull = true;
          }
        } else {
          isNull = true;
        }
      }
      if (isNull) {
        projectList = [];
        setProjects(projectList);
        setProject(projectList[0]);
        // setSearchParamsURL({ projectParam: encodeParam(projectList[0])});
      } else {
        const { data: projectLists } = await axiosClient.post(
          `/Project/GetFilterData?sortString=created_date ASC`,
          projectParam
        );
        // console.log(projectParam)
        // console.log(projectLists)
        projectList = projectLists;
        setProjects(projectLists);
        // setProject(projectLists[0]);
        projectDecodeId === null
          ? setProject(projectList[0])
          : setProject(
              projectList.filter((ele) => ele.project_id === projectDecodeId)[0]
            );
        // console.log(
        //   projectList.filter((ele) => ele.project_id === projectDecodeId)[0]
        // );
        // setSearchParamsURL({ projectParam: encodeParam(projectList[0]) });
      }
    } else {
      const { data: project } = await axiosClient.get(`/Project/${projectId}`);
      const { data: projectLists } = await axiosClient.post(
        `/Project/GetFilterData?sortString=created_date ASC`,
        projectParam
      );
      projectList = [project];
      setProjects(projectLists);
      setProject(project);
      // setSearchParamsURL({ projectParam: encodeParam(project) });

      const { data: milestoneArr } = await axiosClient.post(
        "/Milestone/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: projectList[0].project_id,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setMilestones(milestoneArr);
      let milestones = [];
      for (let [index, milestoneItem] of milestoneArr.entries()) {
        // console.log(index, milestoneItem);
        if (index === 0 && milestoneArr.length > 1) {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            operator: FilterOperatorEnum.OR,
            parenthesis: FilterOperatorEnum.OpenParenthesis,
          });
        } else if (
          index === milestoneArr.length - 1 &&
          milestoneArr.length > 1
        ) {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            parenthesis: FilterOperatorEnum.CloseParenthesis,
          });
        } else {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            operator: FilterOperatorEnum.OR,
          });
        }
      }
      setMilestonesCondition(milestones);
    }
    setLoadingProjects(true);

    if (projectList.length !== 0) {
      // setProject(projectList[0]);
      let newProject = [];
      if (projectDecodeId === null) {
        setProject(projectList[0]);
        newProject = projectList;
      } else {
        setProject(
          projectList.filter((ele) => ele.project_id === projectDecodeId)[0]
        );
        newProject = projectList.filter(
          (ele) => ele.project_id === projectDecodeId
        );
      }
      // console.log(newProject);
      const { data: issueSettings } = await axiosClient.post(
        `IssueSetting/GetDataCombobox?project_id=${newProject[0].project_id}&class_id=${newProject[0].class_id}&subject_id=${newProject[0].subject_id}`
      );
      setIssueSettings(issueSettings);
      // console.log(issueSettings);

      const { data: studentArr } = await axiosClient.post(
        "/ClassStudent/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: newProject[0].project_id,
            condition: ConditionEnum.Equal,
          },
          {
            field: "status",
            value: StatusEnum.Active,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setStudents(studentArr);

      const { data: milestoneArr } = await axiosClient.post(
        "/Milestone/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: newProject[0].project_id,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setMilestones(milestoneArr);
      let milestones = [];
      for (let [index, milestoneItem] of milestoneArr.entries()) {
        // console.log(index, milestoneItem);
        if (index === 0 && milestoneArr.length > 1) {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            operator: FilterOperatorEnum.OR,
            parenthesis: FilterOperatorEnum.OpenParenthesis,
          });
        } else if (
          index === milestoneArr.length - 1 &&
          milestoneArr.length > 1
        ) {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            parenthesis: FilterOperatorEnum.CloseParenthesis,
          });
        } else {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            operator: FilterOperatorEnum.OR,
          });
        }
      }
      setMilestonesCondition(milestones);

      let newSearchParams = [];
      newSearchParams = [
        {
          field: "issue_group",
          value: IssueSettingEnum.IssueType,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.AND,
        },
        {
          field: "project_id",
          value: newProject[0].project_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
          parenthesis: FilterOperatorEnum.OpenParenthesis,
        },
        {
          field: "class_id",
          value: newProject[0].class_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
        },
        {
          field: "subject_id",
          value: newProject[0].subject_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
          parenthesis: FilterOperatorEnum.CloseParenthesis,
        },
      ];
      // const { data: issueTypeArr } = await axiosClient.post(
      //   `/IssueSetting/GetFilterData?sortString=created_date ASC`,
      //   newSearchParams
      // );

      setSearchParams(newSearchParams);
      setIssueTypes(issueSettings.issue_types);
      // console.log(decodeParam(tab));
      if (issueSettings.issue_types.length !== 0) {
        if (decodeParam(tab) === null) {
          if (issueTypeId === "all") {
            setSearchParamsURL({
              projectParam: encodeParam(newProject[0].project_id),
              tab: encodeParam("all"),
              param: param,
            });
          } else if (issueTypeId === undefined) {
            setSearchParamsURL({
              projectParam: encodeParam(newProject[0].project_id),
              tab: encodeParam(issueSettings.issue_types[0].issue_setting_id),
              param: param,
            });
          } else {
            setSearchParamsURL({
              projectParam: encodeParam(newProject[0].project_id),
              tab: encodeParam(issueTypeId),
              param: param,
            });
          }
        } else {
          setSearchParamsURL({
            projectParam: encodeParam(newProject[0].project_id),
            tab: tab,
            param: param,
          });
        }
      } else {
        setSearchParamsURL({
          projectParam: encodeParam(newProject[0].project_id),
          tab: encodeParam(null),
          param: param,
        });
      }

      const { data: issueRequirementArr } = await axiosClient.post(
        `/Issue/GetRequirementIssue?projectId=${newProject[0].project_id}&class_id=${newProject[0].class_id}&subject_id=${newProject[0].subject_id}`
      );
      setIssueRequirements(issueRequirementArr);
      // console.log(issueRequirementArr);
    }
    setLoadingData(true);
    setLoadingSelectData(true);
  };

  const fetchData = async () => {
    let projectList = [];
    let projectParam = [];
    let isNull = false;
    // console.log(IsStudent(), currentUser);
    if (projectId === undefined) {
      if (IsStudent()) {
        const { data: classStudent } = await axiosClient.post(
          `/ClassStudent/GetFilterData?sortString=created_date ASC`,
          [
            {
              field: "student_id",
              value: currentUser.user_id,
              condition: ConditionEnum.Equal,
            },
          ]
        );
        classStudent.length !== 0
          ? classStudent
              .filter((ele) => ele.project_id !== null)
              .map((project) => {
                projectParam.push({
                  field: "project_id",
                  value: project.project_id,
                  condition: ConditionEnum.Equal,
                  operator: FilterOperatorEnum.OR,
                });
              })
          : (isNull = true);
      }
      if (isNull) {
        projectList = [];
        setProjects(projectList);
        setProject(projectList[0]);
      } else {
        const { data: projectLists } = await axiosClient.post(
          `/Project/GetFilterData?sortString=created_date ASC`,
          projectParam
        );
        projectList = projectLists;
        setProjects(projectList);
        setProject(projectList[0]);
      }
    } else {
      const { data: project } = await axiosClient.get(`/Project/${projectId}`);
      const { data: projectLists } = await axiosClient.post(
        `/Project/GetFilterData?sortString=created_date ASC`,
        projectParam
      );
      projectList = [project];
      setProjects(projectLists);
      setProject(project);
    }
    setLoadingProjects(true);

    let newSearchParams = [];
    projectList.length !== 0 &&
      (newSearchParams = [
        {
          field: "issue_group",
          value: IssueSettingEnum.IssueType,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.AND,
        },
        {
          field: "project_id",
          value: projectList[0].project_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
          parenthesis: FilterOperatorEnum.OpenParenthesis,
        },
        {
          field: "class_id",
          value: projectList[0].class_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
        },
        {
          field: "subject_id",
          value: projectList[0].subject_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
          parenthesis: FilterOperatorEnum.CloseParenthesis,
        },
      ]);
    const { data: issueTypeArr } = await axiosClient.post(
      `/IssueSetting/GetFilterData?sortString=created_date ASC`,
      newSearchParams
    );

    setSearchParams(newSearchParams);
    setIssueTypes(issueTypeArr);
    setLoadingData(true);
  };

  const fetchSelectData = async () => {
    let projectList = [];
    if (projectId === undefined) {
      const { data: projectLists } = await axiosClient.post(
        `/Project/GetFilterData?sortString=created_date ASC`,
        []
      );

      projectList = projectLists;
      setProjects(projectList);
      setProject(projectList[0]);
    } else {
      const { data: project } = await axiosClient.get(`/Project/${projectId}`);
      const { data: projectLists } = await axiosClient.post(
        `/Project/GetFilterData?sortString=created_date ASC`,
        []
      );
      projectList = [project];
      setProjects(projectLists);
      setProject(project);
    }
    if (projectList.length !== 0) {
      setProject(projectList[0]);

      const { data: issueSettings } = await axiosClient.post(
        `IssueSetting/GetDataCombobox?project_id=${
          projectId === undefined ? projectList[0].project_id : projectId
        }&class_id=${projectList[0].class_id}&subject_id=${
          projectList[0].subject_id
        }`
      );
      setIssueSettings(issueSettings);
      // console.log(issueSettings);

      const { data: studentArr } = await axiosClient.post(
        "/ClassStudent/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: projectList[0].project_id,
            condition: ConditionEnum.Equal,
          },
          {
            field: "status",
            value: StatusEnum.Active,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setStudents(studentArr);

      const { data: milestoneArr } = await axiosClient.post(
        "/Milestone/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: projectList[0].project_id,
            condition: ConditionEnum.Equal,
          },
          // {
          //   field: "class_id",
          //   value: project.class_id,
          //   condition: ConditionEnum.Equal,
          //   operator: FilterOperatorEnum.OR,
          // }
        ]
      );
      setMilestones(milestoneArr);
      let milestones = [];
      for (let [index, milestoneItem] of milestoneArr.entries()) {
        // console.log(index, milestoneItem);
        if (index === 0 && milestoneArr.length > 1) {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            operator: FilterOperatorEnum.OR,
            parenthesis: FilterOperatorEnum.OpenParenthesis,
          });
        } else if (
          index === milestoneArr.length - 1 &&
          milestoneArr.length > 1
        ) {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            parenthesis: FilterOperatorEnum.CloseParenthesis,
          });
        } else {
          milestones.push({
            field: "milestone_id",
            value: milestoneItem.milestone_id,
            condition: ConditionEnum.Equal,
            operator: FilterOperatorEnum.OR,
          });
        }
      }
      setMilestonesCondition(milestones);
    }

    setLoadingSelectData(true);
  };

  const fetchFilterData = async (projectId, isFilterProject) => {
    const { data: project } = await axiosClient.get(`/Project/${projectId}`);
    setProject(project);
    setLoadingProjects(true);
    const newSearchParams = [
      {
        field: "issue_group",
        value: IssueSettingEnum.IssueType,
        condition: ConditionEnum.Equal,
        operator: FilterOperatorEnum.AND,
      },
      {
        field: "project_id",
        value: project.project_id,
        condition: ConditionEnum.Equal,
        operator: FilterOperatorEnum.OR,
        parenthesis: FilterOperatorEnum.OpenParenthesis,
      },
      {
        field: "class_id",
        value: project.class_id,
        condition: ConditionEnum.Equal,
        parenthesis: FilterOperatorEnum.CloseParenthesis,
      },
      // {
      //   field: "subject_id",
      //   value: project.subject_id,
      //   condition: ConditionEnum.Equal,
      //   operator: FilterOperatorEnum.OR,
      //   parenthesis: FilterOperatorEnum.CloseParenthesis,
      // },
    ];
    const { data: issueTypeArr } = await axiosClient.post(
      `/IssueSetting/GetFilterData?sortString=created_date ASC`,
      newSearchParams
    );
    setSearchParams(newSearchParams);
    setIssueTypes(issueTypeArr);
    setLoadingData(true);

    const { data: issueSettings } = await axiosClient.post(
      `IssueSetting/GetDataCombobox?project_id=${project.project_id}&class_id=${project.class_id}&subject_id=${project.subject_id}`
    );
    setIssueSettings(issueSettings);
    // console.log(issueSettings);

    const { data: studentArr } = await axiosClient.post(
      "/ClassStudent/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "project_id",
          value: project.project_id,
          condition: ConditionEnum.Equal,
        },
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setStudents(studentArr);

    const { data: milestoneArr } = await axiosClient.post(
      "/Milestone/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "project_id",
          value: project.project_id,
          condition: ConditionEnum.Equal,
        },
        // {
        //   field: "class_id",
        //   value: project.class_id,
        //   condition: ConditionEnum.Equal,
        //   operator: FilterOperatorEnum.OR,
        // }
      ]
    );
    setMilestones(milestoneArr);
    let milestones = [];
    for (let [index, milestoneItem] of milestoneArr.entries()) {
      // console.log(index, milestoneItem);
      if (index === 0 && milestoneArr.length > 1) {
        milestones.push({
          field: "milestone_id",
          value: milestoneItem.milestone_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
          parenthesis: FilterOperatorEnum.OpenParenthesis,
        });
      } else if (index === milestoneArr.length - 1 && milestoneArr.length > 1) {
        milestones.push({
          field: "milestone_id",
          value: milestoneItem.milestone_id,
          condition: ConditionEnum.Equal,
          parenthesis: FilterOperatorEnum.CloseParenthesis,
        });
      } else {
        milestones.push({
          field: "milestone_id",
          value: milestoneItem.milestone_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
        });
      }
    }
    setMilestonesCondition(milestones);
    const { data: issueRequirementArr } = await axiosClient.post(
      `/Issue/GetRequirementIssue?projectId=${project.project_id}&class_id=${project.class_id}&subject_id=${project.subject_id}`
    );
    setIssueRequirements(issueRequirementArr);

    if (isFilterProject) {
      setSearchParamsURL({
        projectParam: encodeParam(projectId),
        tab: encodeParam(issueSettings.issue_types[0].issue_setting_id),
        param: encodeParam(null),
      });
    } else {
      setSearchParamsURL({
        projectParam: encodeParam(projectId),
        tab: encodeParam(issueSettings.issue_types[0].issue_setting_id),
        param: param,
      });
    }
    // console.log(projectId)
    setLoadingSelectData(true);
  };

  const fetchProjectsData = async () => {
    const { data: projectList } = await axiosClient.post(
      `/Project/GetFilterData?sortString=created_date ASC`,
      []
    );
    setProjects(projectList);
    setLoadingProjects(true);
  };

  const onProjectFilter = (filter) => {
    // filterUtils(filter, searchParams, setSearchParams, fetchData);
    setLoadingData(false);
    setLoadingSelectData(false);
    setLoadingProjects(false);
    fetchFilterData(filter.value, true);
  };
  // console.log(decodeParam(projectParam));
  // console.log(decodeParam(tab));
  const onChangeProject = (value) => {
    setCheckedProject(value);
  };
  useEffect(() => {
    // fetchData();
    // fetchProjectsData();
    // fetchSelectData();
    fetchAllData(decodeParam(projectParam));
    // setProjectDecode(decodeParam(projectParam));
    // setTabDecode(decodeParam(tab));
    // console.log("abc");
  }, []);
  return (
    <>
      {/* {console.log(loadingData, loadingSelectData, loadingProjects)} */}
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      {/* {console.log(decodeParam(projectParam))} */}
      <NavbarDashboard
        position="issue"
        spin={loadingData && loadingSelectData && loadingProjects}
        dashboardBody={
          <Tabs
            onChange={handleTabClick}
            type="card"
            defaultActiveKey={
              issueTypeId !== undefined
                ? issueTypeId
                : decodeParam(tab) === null
                ? undefined
                : decodeParam(tab)
            }
            activeKey={decodeParam(tab) === null ? undefined : decodeParam(tab)}
            className="flex_height tabScreen"
            items={
              issueTypes.length !== 0 &&
              issueTypes
                .map((issueType, index) => {
                  return {
                    label: issueType.issue_value,
                    children: (
                      <div className="flex_height">
                        <div className="card custom-card mb-0 flex_height">
                          <div className="card-body flex_height ">
                            {loadingData &&
                              loadingSelectData &&
                              loadingProjects && (
                                <IssueType
                                  issueType={issueType}
                                  project={project}
                                  projects={projects}
                                  issueSettings={issueSettings}
                                  issueRequirements={issueRequirements}
                                  students={students}
                                  milestones={milestones}
                                  onProjectFilter={onProjectFilter}
                                  milestonesCondition={milestonesCondition}
                                  onChangeProject={onChangeProject}
                                  checkedProject={checkedProject}
                                  searchParamsURL={searchParamsURL}
                                  setSearchParamsURL={setSearchParamsURL}
                                  param={param}
                                  tab={tab}
                                  projectParam={projectParam}
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    ),
                    key: issueType.issue_setting_id,
                  };
                })
                .concat([
                  {
                    label: "All",
                    children: (
                      <div className="flex_height">
                        <div className="card custom-card mb-0 flex_height">
                          <div className="card-body flex_height">
                            {loadingData &&
                              loadingSelectData &&
                              loadingProjects && (
                                <IssueTypeAll
                                  project={project}
                                  projects={projects}
                                  issueSettings={issueSettings}
                                  issueRequirements={issueRequirements}
                                  students={students}
                                  milestones={milestones}
                                  onProjectFilter={onProjectFilter}
                                  milestonesCondition={milestonesCondition}
                                  onChangeProject={onChangeProject}
                                  checkedProject={checkedProject}
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    ),
                    key: "all",
                  },
                ])
            }
          />
        }
      />
    </>
  );
};
