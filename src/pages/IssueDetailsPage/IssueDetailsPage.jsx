import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import {
  ConditionEnum,
  FilterOperatorEnum,
  IssueSettingEnum,
} from "src/enum/Enum";
import { IssueGeneral } from "./IssueGeneral/IssueGeneral";
import Box from "@mui/material/Box";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const IssueDetailsPage = () => {
  const { issueId, projectId } = useParams();
  const navigate = useNavigate();
  const [issueObj, setIssueObj] = useState({});
  const [issues, setIssues] = useState([]);
  const [students, setStudents] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [projectObj, setProjectObj] = useState([]);

  const [issueSettings, setIssueSettings] = useState([]);
  const [issueRequirements, setIssueRequirements] = useState([]);
  const [loadingSelectData, setLoadingSelectData] = useState(false);

  const [loadingAssigneeApi, setLoadingAssigneeApi] = useState(false);
  const [isCallAssignees, setIsCallAssignees] = useState(false);
  const [loadingMilestoneApi, setLoadingMilestoneApi] = useState(false);
  const [isCallMilestones, setIsCallMilestones] = useState(false);
  const [loadingIssueSettingApi, setLoadingIssueSettingApi] = useState(false);
  const [isCallIssueSettings, setIsCallIssueSettings] = useState(false);
  const [loadingIssueRequirementApi, setLoadingIssueRequirementApi] =
    useState(false);
  const [isCallIssueRequirements, setIsCallIssueRequirements] = useState(false);

  const fetchAssignee = async () => {
    if (!isCallAssignees) {
      setLoadingAssigneeApi(true);
      const { data: studentArr } = await axiosClient.post(
        "/ClassStudent/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: projectId,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setStudents(studentArr);
      setIsCallAssignees(true);
      setLoadingAssigneeApi(false);
    }
  };

  const fetchMilestone = async () => {
    if (!isCallMilestones) {
      setLoadingMilestoneApi(true);
      const { data: milestoneArr } = await axiosClient.post(
        "/Milestone/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: projectId,
            condition: ConditionEnum.Equal,
          },
        ]
      );

      setMilestones(milestoneArr);
      setIsCallMilestones(true);
      setLoadingMilestoneApi(false);
    }
  };

  const fetchIssueSetting = async () => {
    if (!isCallIssueSettings) {
      setLoadingIssueSettingApi(true);
      const { data: projectById } = await axiosClient.get(
        `/Project/${projectId}`
      );
      const { data: issueSettingArr } = await axiosClient.post(
        `/IssueSetting/GetDataCombobox?project_id=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
      );
      setIssueSettings(issueSettingArr);
      // if (issueTypeId !== undefined) {
      //   setIssueType(
      //     issueSettingArr.issue_types.filter(
      //       (ele) => ele.issue_setting_id === issueTypeId
      //     )[0]
      //   );
      // }
      setIsCallIssueSettings(true);
      setLoadingIssueSettingApi(false);
      setLoadingSelectData(true);
    }
  };

  const fetchIssueRequirement = async () => {
    if (!isCallIssueRequirements) {
      setLoadingIssueRequirementApi(true);
      const { data: projectById } = await axiosClient.get(
        `/Project/${projectId}`
      );
      const { data: issueRequirements } = await axiosClient.post(
        `/Issue/GetRequirementIssue?projectId=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
      );
      setIssueRequirements(issueRequirements);
      setIsCallIssueRequirements(true);
      setLoadingIssueRequirementApi(false);
    }
  };

  const fetchDataSelect = async () => {
    const { data: issueById } = await axiosClient.get(`/Issue/${issueId}`);
    setIssueObj(issueById);
    setLoadingIssueSettingApi(true);
    const { data: projectById } = await axiosClient.get(
      `/Project/${projectId}`
    );
    const { data: issueSettingArr } = await axiosClient.post(
      `/IssueSetting/GetDataCombobox?project_id=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
    );
    setIssueSettings(issueSettingArr);

    setIsCallIssueSettings(true);
    setLoadingIssueSettingApi(false);
    setLoadingSelectData(true);
    // const { data: studentArr } = await axiosClient.post(
    //   "/ClassStudent/GetFilterData?sortString=created_date ASC",
    //   [
    //     {
    //       field: "project_id",
    //       value: projectId,
    //       condition: ConditionEnum.Equal,
    //     },
    //   ]
    // );
    // setStudents(studentArr);

    // const { data: milestoneArr } = await axiosClient.post(
    //   "/Milestone/GetFilterData?sortString=created_date ASC",
    //   [
    //     {
    //       field: "project_id",
    //       value: projectId,
    //       condition: ConditionEnum.Equal,
    //     },
    //   ]
    // );

    // setMilestones(milestoneArr);

    // const { data: projectById } = await axiosClient.get(
    //   `/Project/${projectId}`
    // );
    // setProjectObj(projectById);

    // const { data: issueSettingArr } = await axiosClient.post(
    //   `/IssueSetting/GetDataCombobox?project_id=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
    // );
    // setIssueSettings(issueSettingArr);

    // let milestones = [];
    // for (let [index, milestoneItem] of milestoneArr.entries()) {
    //   // console.log(index, milestoneItem);
    //   if (index === 0 && milestoneArr.length > 1) {
    //     milestones.push({
    //       field: "milestone_id",
    //       value: milestoneItem.milestone_id,
    //       condition: ConditionEnum.Equal,
    //       operator: FilterOperatorEnum.OR,
    //       parenthesis: FilterOperatorEnum.OpenParenthesis,
    //     });
    //   } else if (index === milestoneArr.length - 1 && milestoneArr.length > 1) {
    //     milestones.push({
    //       field: "milestone_id",
    //       value: milestoneItem.milestone_id,
    //       condition: ConditionEnum.Equal,
    //       parenthesis: FilterOperatorEnum.CloseParenthesis,
    //     });
    //   } else {
    //     milestones.push({
    //       field: "milestone_id",
    //       value: milestoneItem.milestone_id,
    //       condition: ConditionEnum.Equal,
    //       operator: FilterOperatorEnum.OR,
    //     });
    //   }
    // }
    // milestones.push({
    //   field: "issue_title",
    //   value: "Ichigo Class 1",
    //   condition: ConditionEnum.Equal,
    // });
    // const { data: issueArr } = await axiosClient.post(
    //   `/Issue/GetFilterData?sortString=created_date ASC`,
    //   milestones
    // );
    // setIssues(issueArr);

    // const { data: issueRequirements } = await axiosClient.post(
    //   `/Issue/GetRequirementIssue?projectId=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
    // );
    // setIssueRequirements(issueRequirements);
    // console.log(issueSettingArr);
  };

  const handleUpdateIssue = async (values, setLoadingData, setIsView) => {
    setLoadingData(true);
    const { err } = await axiosClient.put(`/Issue/${values.issue_id}`, values);

    if (err) {
      // toast.error(`The issue named ${issueObj.issue_title} was updated fail!`);
      showErrorMessage(err);
      setLoadingData(false);
    } else {
      toast.success(
        `The issue named ${issueObj.issue_title} was updated successfully!`
      );
      setIsView(true);
      fetchSubIssueData(values.issue_id);
      setLoadingData(false);
      // fetchIssueHistoryData();
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchDataSelect();
  }, []);
  return (
    <>
      {/* {console.log(issueSettings)} */}
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="issue"
        spin={loadingSelectData}
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="  card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    Issue Details
                  </h3>
                </div>
                {loadingSelectData && (
                  <IssueGeneral
                    issueObj={issueObj}
                    students={students}
                    milestones={milestones}
                    issueSettings={issueSettings}
                    issueRequirements={issueRequirements}
                    projectId={projectId}
                    handleUpdateIssue={handleUpdateIssue}
                    issues={issues}
                    fetchIssueRequirement={fetchIssueRequirement}
                    loadingIssueRequirementApi={loadingIssueRequirementApi}
                    fetchIssueSetting={fetchIssueSetting}
                    loadingIssueSettingApi={loadingIssueSettingApi}
                    fetchMilestone={fetchMilestone}
                    loadingMilestoneApi={loadingMilestoneApi}
                    fetchAssignee={fetchAssignee}
                    loadingAssigneeApi={loadingAssigneeApi}
                  />
                )}
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};
