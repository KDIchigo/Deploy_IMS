import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, FilterOperatorEnum, IssueSettingEnum } from "src/enum/Enum";
import { IssueGeneral } from "./IssueGeneral/IssueGeneral";
import Box from "@mui/material/Box";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const IssueDetailsPage = () => {
  const { issueId, projectId } = useParams();
  const navigate = useNavigate();
  const [issueObj, setIssueObj] = useState({});
  const [issues, setIssues] = useState([]);
  const [subIssues, setSubIssues] = useState([]);
  const [students, setStudents] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [projectObj, setProjectObj] = useState([]);

  const [issueHistory, setIssueHistory] = useState({});
  const [issueSettings, setIssueSettings] = useState([]);
  const [issueRequirements, setIssueRequirements] = useState([]);
  const [loadingSubIssueData, setLoadingSubIssueData] = useState(false);
  const [loadingSubIssueAction, setLoadingSubIssueActionData] = useState(false);
  const [loadingIssueHistoryData, setLoadingIssueHistoryData] = useState(false);
  const [loadingSelectData, setLoadingSelectData] = useState(false);

  const fetchSubIssueData = async (issueId) => {
    const { data: issueById } = await axiosClient.get(`/Issue/${issueId}`);
    setIssueObj(issueById);

    const { data: subIssue } = await axiosClient.post(
      `/Issue/GetFilterData?sortString=created_date ASC`,
      [
        {
          field: "parent_id",
          value: issueId,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setSubIssues(subIssue);
    setLoadingSubIssueData(true);
    setLoadingSubIssueActionData(true);
  };
  const fetchIssueHistoryData = async () => {
    const { data: issueHistoryArr } = await axiosClient.post(
      "/IssueHistory/GetFilterData?sortString=data_group ASC",
      [
        {
          field: "issue_id",
          value: issueId,
          condition: 1,
        },
      ]
    );
    setIssueHistory(issueHistoryArr);
    // console.log(issueHistoryArr);
    setLoadingIssueHistoryData(true);
  };
  const fetchDataSelect = async () => {
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

    const { data: projectById } = await axiosClient.get(
      `/Project/${projectId}`
    );
    setProjectObj(projectById);

    const { data: issueSettingArr } = await axiosClient.post(
      `/IssueSetting/GetDataCombobox?project_id=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
    );
    setIssueSettings(issueSettingArr);

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
    milestones.push({
      field: "issue_title",
      value: "Ichigo Class 1",
      condition: ConditionEnum.Equal,
    })
    const { data: issueArr } = await axiosClient.post(
      `/Issue/GetFilterData?sortString=created_date ASC`,
      milestones
    );
    setIssues(issueArr)

    const { data: issueRequirements } = await axiosClient.post(
      `/Issue/GetRequirementIssue?projectId=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
    );
    setIssueRequirements(issueRequirements);
    setLoadingSelectData(true);
    // console.log(issueSettingArr);
  };
  const handleNewSubIssue = async (values) => {
    setLoadingSubIssueActionData(false);
    const { err } = await axiosClient.post(`/Issue`, values);

    if (err) {
      // toast.error("Add issue fail!");
      showErrorMessage(err);
      return;
    } else {
      fetchSubIssueData(issueId);
      toast.success("Add issue success!");
    }
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
      setLoadingData(false);
      setIsView(true);
      fetchSubIssueData(values.issue_id);
      fetchIssueHistoryData();
    }
  };
  const handleSubIssueDetails = (ele) => {
    setLoadingSubIssueData(false);
    setLoadingSelectData(false);
    setLoadingIssueHistoryData(false);
    navigate(`/issue-details/${ele.issue_id}/${projectId}`);
    fetchSubIssueData(ele.issue_id);
    fetchIssueHistoryData();
    fetchDataSelect();
  };
  useEffect(() => {
    fetchSubIssueData(issueId);
    // fetchIssueHistoryData();
    fetchDataSelect();
  }, []);
  return (
    <>
      {/* {console.log(issueSettings)} */}
      <ToastContainer autoClose="2000" theme="colored" />
      <NavbarDashboard
        position="issue"
        spin={
          loadingSubIssueData && loadingSelectData
        }
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="  card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    Issue Details
                  </h3>
                </div>
                {loadingSelectData ? (
                  issueSettings.length !== 0 ? (
                    <IssueGeneral
                      issueObj={issueObj}
                      students={students}
                      milestones={milestones}
                      issueSettings={issueSettings}
                      issueRequirements={issueRequirements}
                      issueHistory={issueHistory}
                      fetchSubIssueData={fetchSubIssueData}
                      loadingSubIssueData={loadingSubIssueData}
                      fetchIssueHistoryData={fetchIssueHistoryData}
                      loadingIssueHistoryData={loadingIssueHistoryData}
                      loadingSubIssueAction={loadingSubIssueAction}
                      subIssues={subIssues}
                      projectId={projectId}
                      handleNewSubIssue={handleNewSubIssue}
                      handleSubIssueDetails={handleSubIssueDetails}
                      handleUpdateIssue={handleUpdateIssue}
                      issues={issues}
                    />
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};
