import { Box, Grid } from "@mui/material";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, FilterOperatorEnum } from "src/enum/Enum";
import { Role } from "src/enum/Role";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { HandleAuth } from "src/utils/handleAuth";
import {
  decodeParam,
  encodeParam,
  genDataStateParam,
  genFilterDataStateParam,
  genFilterDateDataStateParam,
} from "src/utils/handleEnDecode";
import { ProjectMilestones } from "./ProjectMilestone/ProjectMilestones";

const searchProjectMilestones = [
  {
    id: "milestone_name",
    value: "Milestone Name",
  },
];
export const ProjectDetailsMilestone = () => {
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  const from_date = searchURLParams.get("from_date");
  const to_date = searchURLParams.get("to_date");

  const navigate = useNavigate();
  const { IsStudent } = HandleAuth();
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [milestones, setMilestones] = useState([]);
  const [classMilestones, setClassMilestones] = useState([]);
  // const [searchParams, setSearchParams] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const [checkedFromDate, setCheckedFromDate] = useState(undefined);
  const [checkedToDate, setCheckedToDate] = useState(undefined);
  const [checkedStatus, setCheckedStatus] = useState();
  // const [classMilestones, setClassMilestones] = useState([]);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);

  const fetchData = async () => {
    const { data: projectObj } = await axiosClient.get(`Project/${projectId}`);
    setProject(projectObj);

    const { data: milestoneArr } = await axiosClient.post(
      `/Milestone/GetProjectMilestone?class_id=${projectObj.class_id}&project_id=${projectId}&sortString=created_date ASC`,
      searchParams
    );
    setMilestones(milestoneArr);

    setLoadingTable(false);
    setLoadingData(true);
  };
  const [searchParams, setSearchParams] = useState(
    decodeParam(param) === null ? [] : decodeParam(param)
  );
// console.log(decodeParam(from_date))
// console.log(decodeParam(to_date))
  const fetchDataSelect = async () => {
    const { data: projectObj } = await axiosClient.get(`Project/${projectId}`);
    setProject(projectObj);

    let newSearchParams = [
      {
        field: "is_customized",
        value: true,
        condition: ConditionEnum.Equal,
        operator: FilterOperatorEnum.OR,
        parenthesis: FilterOperatorEnum.OpenParenthesis
      },
      {
        field: "is_editable",
        value: 0,
        condition: ConditionEnum.Equal,
        parenthesis: FilterOperatorEnum.CloseParenthesis
      },
      {
        field: "class_id",
        value: projectObj.class_id,
        condition: ConditionEnum.Equal,
      },
      // {
      //   field: "is_customized",
      //   value: 1,
      //   condition: ConditionEnum.Equal,
      // },
      {
        field: "project_id",
        value: projectId,
        condition: ConditionEnum.Equal,
        operator: FilterOperatorEnum.AND
      },

    ];
    const { data: milestoneClass } = await axiosClient.post(
      "/Milestone/GetFilterData?sortString=created_date ASC",
      newSearchParams
    );
    setClassMilestones(milestoneClass);
    setSearchParams(newSearchParams);
    const { data: milestoneArr } = await axiosClient.post(
      `/Milestone/GetProjectMilestone?class_id=${projectObj.class_id}&project_id=${projectId}&sortString=created_date ASC`,
      searchParams
    );
    setSearchParams(searchParams);
    setMilestones(milestoneArr);
    setLoadingTable(false);
    genFilterDataStateParam(
      param,
      setCheckedSearchInput,
      "search",
      [],
      searchProjectMilestones
    );
    genFilterDateDataStateParam(to_date, setCheckedFromDate, "from_date");
    genFilterDateDataStateParam(from_date, setCheckedToDate, "to_date");
    genFilterDataStateParam(param, setCheckedStatus, "status_inProgress");
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    setLoadingData(true);
  };
  // console.log(decodeParam(param));
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
    fetchDataSelect();
  }, []);
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position={IsStudent() ? "project-student-milestones" : "project"}
        spin={loadingData}
        defaultOpenKeys="project-details-student"
        projectId={projectId}
        dashboardBody={
          <>
            <AuthoComponentRoutes
              element={
                <Tabs
                  defaultActiveKey="3"
                  onChange={onChange}
                  type="card"
                  className="flex_height tabScreen"
                  items={[
                    {
                      label: "General",
                      children: (
                        <div className="flex_height">
                          <div className="card custom-card mb-0 flex_height">
                            <div className="card-body flex_height"></div>
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
                              {loadingData && (
                                <>
                                  <ProjectMilestones
                                    projectId={projectId}
                                    project={project}
                                    milestones={milestones}
                                    setMilestones={setMilestones}
                                    classMilestones={classMilestones}
                                    searchParams={searchParams}
                                    setSearchParams={setSearchParams}
                                    checkedFromDate={checkedFromDate}
                                    setCheckedFromDate={setCheckedFromDate}
                                    checkedToDate={checkedToDate}
                                    setCheckedToDate={setCheckedToDate}
                                    checkedStatus={checkedStatus}
                                    setCheckedStatus={setCheckedStatus}
                                    checkedSearchSelect={checkedSearchSelect}
                                    setCheckedSearchSelect={
                                      setCheckedSearchSelect
                                    }
                                    checkedSearchInput={checkedSearchInput}
                                    setCheckedSearchInput={
                                      setCheckedSearchInput
                                    }
                                    searchProjectMilestones={
                                      searchProjectMilestones
                                    }
                                    setSearchParamsURL={setSearchParamsURL}
                                    // fetchData={fetchData}
                                  />
                                  {/* <Milestone
                                    id={projectId}
                                    option={project}
                                    typeMilestone="project"
                                  /> */}
                                </>
                              )}
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
                            <div className="card-body flex_height"></div>
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
                          <>
                            {/* <Milestone
                              id={projectId}
                              option={project}
                              typeMilestone="project"
                            /> */}
                            <ProjectMilestones
                              projectId={projectId}
                              project={project}
                              milestones={milestones}
                              setMilestones={setMilestones}
                              classMilestones={classMilestones}
                              searchParams={searchParams}
                              setSearchParams={setSearchParams}
                              checkedFromDate={checkedFromDate}
                              setCheckedFromDate={setCheckedFromDate}
                              checkedToDate={checkedToDate}
                              setCheckedToDate={setCheckedToDate}
                              checkedStatus={checkedStatus}
                              setCheckedStatus={setCheckedStatus}
                              checkedSearchSelect={checkedSearchSelect}
                              setCheckedSearchSelect={setCheckedSearchSelect}
                              checkedSearchInput={checkedSearchInput}
                              setCheckedSearchInput={setCheckedSearchInput}
                              searchProjectMilestones={searchProjectMilestones}
                              setSearchParamsURL={setSearchParamsURL}
                              // fetchData={fetchData}
                            />
                          </>
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
