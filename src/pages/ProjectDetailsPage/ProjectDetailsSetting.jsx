import { Box, Grid } from "@mui/material";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { IssueSettings } from "src/components/IssueSetting/IssueSettings";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { IssueSettingEnum } from "src/enum/Enum";
import { Role } from "src/enum/Role";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { HandleAuth } from "src/utils/handleAuth";
import { decodeParam, genDataStateParam } from "src/utils/handleEnDecode";
import { HandleIssueSettings } from "src/utils/handleIssueSettings";

const searchIssueSetting = [
  {
    id: "issue_value",
    value: "Setting Value",
  },
];

const issue_group = [
  {
    value: IssueSettingEnum.IssueType,
    label: "Issue Type",
  },
  {
    value: IssueSettingEnum.IssueStatus,
    label: "Issue Status",
  },
  {
    value: IssueSettingEnum.WorkProcess,
    label: "Work Process",
  },
  {
    value: IssueSettingEnum.Others,
    label: "Others",
  },
];

export const ProjectDetailsSetting = () => {
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");

  const navigate = useNavigate();
  const { IsStudent } = HandleAuth();
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(undefined);
  const [checkedSetting, setCheckedSetting] = useState(undefined);
  const [checkedStatus, setCheckedStatus] = useState(undefined);
  const [issueSettings, setIssueSettings] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const {
    // handleSubjectIssueSetting,
    handleProjectIssueSetting,
  } = HandleIssueSettings();

  const [searchParams, setSearchParams] = useState(
    decodeParam(param) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: [],
        }
      : {
          pageNumber: decodeParam(param).pageNumber,
          pageSize: decodeParam(param).pageSize,
          sortString: decodeParam(param).sortString,
          filterConditions: decodeParam(param).filterConditions,
        }
  );
  const fetchData = async () => {
    const { data: projectById } = await axiosClient.get(`Project/${projectId}`);
    setProject(projectById);

    let filterConditions = handleProjectIssueSetting(projectId, projectById);
    // console.log(filterConditions)
    let newSearchParams = {
      ...searchParams,
      filterConditions: filterConditions.filterConditions,
    };
    const { data: issueSettingArr } = await axiosClient.post(
      "/IssueSetting/GetByPaging",
      newSearchParams
    );

    setSearchParams(newSearchParams);
    setIssueSettings(issueSettingArr);
    genDataStateParam(param, setCheckedSearchInput, "search", [], searchIssueSetting);
    genDataStateParam(param, setCheckedStatus, "status");
    genDataStateParam(param, setCheckedSetting, "issue_setting", issue_group);
    setLoadingData(true);
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
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      <NavbarDashboard
        position={IsStudent() ? "project-student-settings" : "project"}
        spin={loadingData}
        defaultOpenKeys="project-details-student"
        projectId={projectId}
        dashboardBody={
          <>
            <AuthoComponentRoutes
              element={
                <Tabs
                  defaultActiveKey="4"
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
                              {/* {loading ? (
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
                            <div className="card-body flex_height"></div>
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
                            <div className="card-body flex_height">
                              {" "}
                              {/* {loadingData ? (
                          <ProjectMilestones
                            projectId={projectId}
                            project={project}
                          />
                        ) : (
                          ""
                        )} */}
                            </div>
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
                            <div className="card-body flex_height">
                              <IssueSettings
                                id={projectId}
                                option={project}
                                typeIssue="project"
                                issueSettings={issueSettings}
                                setIssueSettings={setIssueSettings}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                                checkedSearchSelect={checkedSearchSelect}
                                setCheckedSearchSelect={setCheckedSearchSelect}
                                checkedSearchInput={checkedSearchInput}
                                setCheckedSearchInput={setCheckedSearchInput}
                                checkedSetting={checkedSetting}
                                setCheckedSetting={setCheckedSetting}
                                checkedStatus={checkedStatus}
                                setCheckedStatus={setCheckedStatus}
                                searchIssueSetting={searchIssueSetting}
                                setSearchParamsURL={setSearchParamsURL}
                              />
                              {/* // <ProjectSettings
                          //   projectId={projectId}
                          //   project={project}
                          // /> */}
                            </div>
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
                  <div className="card custom-card mb-0 flexGrow_1">
                    <div className="card-body d-flex flex-column flexGrow_1">
                      <Grid container className="m-0 flexGrow_1">
                        {loadingData && (
                              <IssueSettings
                                id={projectId}
                                option={project}
                                typeIssue="project"
                                issueSettings={issueSettings}
                                setIssueSettings={setIssueSettings}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                                checkedSearchSelect={checkedSearchSelect}
                                setCheckedSearchSelect={setCheckedSearchSelect}
                                checkedSearchInput={checkedSearchInput}
                                setCheckedSearchInput={setCheckedSearchInput}
                                checkedSetting={checkedSetting}
                                setCheckedSetting={setCheckedSetting}
                                checkedStatus={checkedStatus}
                                setCheckedStatus={setCheckedStatus}
                                searchIssueSetting={searchIssueSetting}
                                setSearchParamsURL={setSearchParamsURL}
                              />
                        )}
                      </Grid>
                    </div>
                  </div>
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
