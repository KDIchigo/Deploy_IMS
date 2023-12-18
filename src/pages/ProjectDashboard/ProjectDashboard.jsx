import {
  ExportOutlined,
  LoadingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum } from "src/enum/Enum";
import { exportToExcel } from "src/utils/handleExcel";
import { handlePageSizeChange } from "src/utils/handleSearchFilter";
import { MonthWeekSelector } from "./FilterProjectMonthWeek/MonthWeekSelector";
import "./ProjectDashboard.scss";
import ProjectIssueBarChart from "./ProjectDashboardChart/ProjectIssueBarChart";
import { ProjectDashBoardTable } from "./ProjectDashboardTable/ProjectDashboardTable";

// const projectId = "47382c37-e832-4656-874c-2f5e6ac3e30a";
// const from_date = "2023-11-16T08:48:48.322Z";
// const to_date = "2023-11-22T08:48:48.322Z";
const From_date = "true";

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

    weekOptions.push({
      value: `${i + 1}`,
      label: `Week ${i + 1}: ${startOfWeek.format(
        "DD/MM/yyyy (ddd)"
      )} - ${endOfWeek.format("DD/MM/yyyy (ddd)")}`,
      weekStart: `${startOfWeek.format("DD/MM/yyyy")}`,
      weekEnd: `${endOfWeek.format("DD/MM/yyyy")}`,
    });
  }

  return weekOptions;
};
const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(generateWeekOptions()[0]);
  const [loadingSync, setLoadingSync] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [pieChart, setPieChart] = useState([]);
  const [lineChart, setLineChart] = useState([]);
  const [pieChartMilestone, setPieChartMilestone] = useState([]);
  const [lineChartMilestone, setLineChartMilestone] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [projectMember, setProjectMember] = useState([]);
  const [classObj, setClassObj] = useState([]);
  const [members, setMembers] = useState([]);
  const [commits, setCommits] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [loadingData, setLoadingData] = useState(false);
  const [project, setProject] = useState("");
  const [checkedMember, setCheckedMember] = useState();
  const [searchParams, setSearchParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortString: "created_at ASC",
    filterConditions: [
      {
        field: "project_id",
        value: projectId,
        condition: ConditionEnum.Equal,
      },
    ],
  });
  const fetchData = async (projectId, option, isSelectMonthWeek) => {
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
      const date = generateWeekOptions()[0];
      from_date = moment(`${date.weekStart} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
        .utcOffset(0, true)
        .toISOString();
      to_date = moment(`${date.weekEnd} 00:00:00`, "DD/MM/yyyy HH:mm:ss")
        .utcOffset(0, true)
        .toISOString();
    }

    const { data: project } = await axiosClient.get(`/Project/${projectId}`);
    setProject(project);
    console.log(project);
    const { data: issueMilestoneArr } = await axiosClient.post(
      `Project/GetMilestoneStatusTracker?projectId=${projectId}`
    );
    // setPieChartMilestone(issueMilestoneArr);
    // // console.log(issueStatusArr);
    // const { data: lineChartMilestoneArr } = await axiosClient.post(
    //   `Project/GetWeeklyMilestoneStatusTracker?projectId=${projectId}&from=${from_date}&to=${to_date}&isFrom_date=${From_date}`
    // );
    // setLineChartMilestone(lineChartMilestoneArr);
    // // console.log(issueArr);
    // const { data: pieChartArr } = await axiosClient.post(
    //   `Project/GetIssueSettingStatusTracker?projectId=${projectId}&class_id=${project.class_id}&subject_id=${project.subject_id}`
    // );
    // setPieChart(pieChartArr);
    // // console.log(issueStatusArr);
    // const { data: lineChartArr } = await axiosClient.post(
    //   `Project/GetWeeklyIssueSettingStatusTracker?projectId=${projectId}&class_id=${project.class_id}&subject_id=${project.subject_id}&from=${from_date}&to=${to_date}`
    // );
    // setLineChart(lineChartArr);
    const { data: memberArr } = await axiosClient.post(
      `Project/GetMemberTracker?projectId=${projectId}&class_id=${project.class_id}&subject_id=${project.subject_id}`
    );
    setProjectMember(memberArr);

    let newMemberSearchParam = [
      {
        field: "project_id",
        value: projectId,
        condition: ConditionEnum.Equal,
      },
      {
        field: "class_id",
        value: project.class_id,
        condition: ConditionEnum.Equal,
      },
    ];
    const { data: member } = await axiosClient.post(
      `/ClassStudent/GetFilterData?sortString=created_date ASC`,
      newMemberSearchParam
    );
    setMembers(member);

    const { data: classItem } = await axiosClient.get(
      `/Class/${project.class_id}`
    );
    setClassObj(classItem);
    setLoadingData(true);
  };

  const fetchCommitsData = async (searchParams) => {
    const { data: commitArr } = await axiosClient.post(
      `/Commit/GetByPaging`,
      searchParams
    );
    setCommits(commitArr);
    setLoadingTable(false);
  };

  const handleExportCommitsToExcel = async () => {
    try {
      setLoadingExport(true);
      // Gọi API để lấy dữ liệu Excel
      const { data: exportExcel } = await axiosClient.post(
        "/Commit/Export",
        [
          {
            field: "project_id",
            value: projectId,
            condition: ConditionEnum.Equal,
          },
        ],
        {
          responseType: "arraybuffer", // Đảm bảo dữ liệu trả về dưới dạng binary
        }
      );
      exportToExcel(exportExcel, "CommitList.xlsx");
    } catch (error) {
      // console.error("Fail to download file Excel: ", error);
      setLoadingExport(false);
    }
    setLoadingExport(false);
  };

  const onPageChange = (pageNumber, pageSize) => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    setSearchParams(newSearchParams);
    fetchCommitsData(newSearchParams);
  };

  const onPageSizeChange = (pageSize) => {
    handlePageSizeChange(
      setLoadingTable,
      searchParams,
      pageSize,
      commits,
      setSearchParams,
      fetchCommitsData
    );
  };

  const handleProjectCommitSynchronize = async (project) => {
    // console.log(classItem, projects)
    let convertId = project.project_convert_id;
    let bearToken = project.project_convert_token;
    if (convertId === null || bearToken === null) {
      toast.error(
        `Synchronize projects ${project.project_code} fail!!! ${project.project_code} project must have project gitlab ID and bearToken.`
      );
      setLoadingSync(false);
      return;
    }
    let projects = [project];
    if (convertId !== null && bearToken !== null) {
      setLoadingSync(true);
      const { data, err } = await axiosClient.post(
        `/Project/AsyncCommit?projectConvertId=${convertId}&bearToken=${bearToken}`,
        projects
      );
      if (err) {
        toast.error(`Synchronize projects ${project.project_code} fail!`);
        // showErrorMessage(err);
        setLoadingSync(false);
        return;
      } else {
        toast.success(
          `Synchronize projects ${project.project_code} successfully!`
        );
        setLoadingSync(false);
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
        `Synchronize projects ${project.project_code} fail!!! Because the ${project.project_code} project does not have ${toastErr} yet.`
      );
      setLoadingSync(false);
    }
  };

  const onChangeMember = (value) => {
    setCheckedMember(value);
  };

  //--------------------- Filter------------------------
  const handleWeekChange = (value, obj) => {
    setSelectedWeek(value);
    fetchData(projectId, obj, true);
    // console.log(value);
  };

  const onMemberFilter = (filter, id) => {
    setLoadingTable(true);
    const filterConditions = searchParams.filterConditions.filter(
      (obj) => obj.field !== filter.field
    );
    if (filter.value !== "all") {
      filterConditions.unshift(filter);
    }
    // console.log(filter.field);
    const newSearchParams = {
      ...searchParams,
      filterConditions: filterConditions,
    };
    setSearchParams(newSearchParams);
    fetchCommitsData(newSearchParams);
    // filterBasicUtils(filter, searchParams, setSearchParams, fetchCommitsData);
    // fetchMemberData(filter.value, selectedWeek, isSelectedWeek);
    // fetchWaitingListData(searchWaitingListParams, filter.value, true);
  };
  console.log(classObj);
  //----------------------------------------------------
  useEffect(() => {
    fetchData(projectId);
    fetchCommitsData(searchParams);
  }, []);
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      {/* <Box className="box w-100 d-flex flex-column flexGrow_1 flex-height"> */}
      <NavbarDashboard
        position="project"
        spin={loadingData}
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 d-flex flex-column flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    Project Dashboard for {project.project_code}
                  </h3>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-6">
                        <BaseSelectInput
                          isLabel={false}
                          id="semester_id"
                          type="setting"
                          options={[]}
                          classNameDiv="selectProjectDesign"
                          defaultValue={classObj.semester_name}
                          isFilter={false}
                          disabled={true}
                          placeholder="Semester"
                          onFilter={onMemberFilter}
                          checked={checkedMember}
                          onChange={onChangeMember}
                        />
                      </div>
                      <div className="col-6">
                        <BaseSelectInput
                          isLabel={false}
                          id="subject_id"
                          type="subject"
                          options={[]}
                          classNameDiv="selectProjectDesign"
                          defaultValue={classObj.subject_code}
                          isFilter={false}
                          disabled={true}
                          placeholder="Subject"
                          onFilter={onMemberFilter}
                          checked={checkedMember}
                          onChange={onChangeMember}
                        />
                      </div>
                      <div className="col-6 mt-4">
                        <BaseSelectInput
                          isLabel={false}
                          id="class_id"
                          type="class"
                          options={[]}
                          classNameDiv="selectProjectDesign"
                          defaultValue={project.class_code}
                          isFilter={false}
                          disabled={true}
                          placeholder="Class"
                          onFilter={onMemberFilter}
                          checked={checkedMember}
                          onChange={onChangeMember}
                        />
                      </div>
                      <div className="col-6 mt-4">
                        <BaseSelectInput
                          isLabel={false}
                          id="project_id"
                          type="project"
                          options={[]}
                          classNameDiv="selectProjectDesign"
                          defaultValue={project.project_code}
                          isFilter={false}
                          disabled={true}
                          placeholder="Project"
                          onFilter={onMemberFilter}
                          checked={checkedMember}
                          onChange={onChangeMember}
                        />
                      </div>
                      <h6 className="mt-4" style={{ fontWeight: "bold" }}>
                        Project Issue Statics By Week
                      </h6>
                      <div className="col-6">
                        {/* <ProjectMonthWeekSelector
                      onWeekChange={handleWeekChange}
                      months={months}
                      weeks={weeks}
                      selectedMonth={selectedMonth}
                      selectedWeek={selectedWeek}
                      handleMonthChange={handleMonthChange}
                      handleWeekChange={handleWeekChange}
                    /> */}
                        {/* <BaseButton
                      color="light"
                      value="Issue"
                      onClick={() => navigate(`/issue-list/${projectId}`)}
                    /> */}
                        <MonthWeekSelector
                          selectedWeek={selectedWeek}
                          handleWeekChange={handleWeekChange}
                          generateWeekOptions={generateWeekOptions}
                        />
                      </div>
                      <div className="col-6">
                        <BaseSelectInput
                          isLabel={false}
                          id="author_id"
                          type="class_student"
                          options={members}
                          defaultValue="all"
                          isFilter={true}
                          placeholder="Member"
                          onFilter={onMemberFilter}
                          checked={checkedMember}
                          onChange={onChangeMember}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    {loadingData && (
                      <ProjectIssueBarChart projectMember={projectMember} />
                    )}
                  </div>
                </div>

                <div className="mt-3 row">
                  <div className="col-7">
                    {" "}
                    <strong style={{ fontStyle: "italic" }}>
                      Found {commits.totalRecord} commits
                    </strong>
                  </div>
                  <div className="col-5">
                    {" "}
                    {loadingExport ? (
                      <BaseButton
                        color="primary"
                        nameTitle=" px-3 py-1 float-end btnLoadingExport"
                        icon={<LoadingOutlined />}
                      />
                    ) : (
                      <BaseButton
                        color="primary"
                        // variant="outline"
                        value="Export"
                        isIconLeft={true}
                        nameTitle=" px-3 py-1 float-end "
                        icon={<ExportOutlined />}
                        onClick={() => handleExportCommitsToExcel()}
                      />
                    )}
                    {loadingSync ? (
                      <BaseButton
                        nameTitle=" me-2 float-end btnLoadingSync"
                        color="primary"
                        icon={<LoadingOutlined size={10} />}
                      />
                    ) : (
                      <BaseButton
                        nameTitle=" me-2 float-end"
                        value="Sync Gitlab"
                        color="primary"
                        isIconLeft={true}
                        icon={<SyncOutlined size={10} />}
                        onClick={() => handleProjectCommitSynchronize(project)}
                      />
                    )}
                  </div>
                </div>
                <Grid container className="mt-3 d-flex flex-column flexGrow_1">
                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex flex-column"
                  >
                    <ProjectDashBoardTable
                      commits={commits}
                      project={project}
                      searchParams={searchParams}
                      onPageChange={onPageChange}
                      onPageSizeChange={onPageSizeChange}
                      fetchData={fetchCommitsData}
                      loadingTable={loadingTable}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Box>
        }
      />

      {/* </Box> */}
    </>
  );
};

export default ProjectDashboard;
