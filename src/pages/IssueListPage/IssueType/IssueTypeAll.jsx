import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import { Empty, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { HandleAuth } from "src/utils/handleAuth";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import { BatchUpdate } from "../BatchUpdate/BatchUpdate";
import { SearchFilterAll } from "../FilterIssue/SearchFilterAll";
import { IssueTypeStudent } from "../IssueTypeStudent/IssueTypeStudent";
import { NewIssueAll } from "../NewIssue/NewIssueAll";
import "./IssueTypeAll.scss";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
const searchIssue = [
  {
    id: "issue_title",
    value: "Issue Title",
  },
];
export const IssueTypeAll = ({
  issueSettings,
  issueRequirements,
  students,
  milestones,
  project,
  projects,
  onProjectFilter,
  milestonesCondition,
  onChangeProject,
  checkedProject,
}) => {
  const { currentUser } = HandleAuth();
  let defaultSelectProject = undefined;
  if (project !== undefined) {
    defaultSelectProject = `${project.group_name} (${project.project_code})`;
  }
  const [spin, setSpin] = useState(true);
  const [issueStatus, setIssueStatus] = useState([]);
  const [workProcess, setWorkProcess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [issueId, setIssueId] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [openBatchUpdate, setOpenBatchUpdate] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [checkedIssueType, setCheckedIssueType] = useState();
  const [checkedIssueStatus, setCheckedIssueStatus] = useState();
  const [checkedIssueWorkProcess, setCheckedIssueWorkProcess] = useState();
  const [checkedAuthor, setCheckedAuthor] = useState();
  const [checkedAssignee, setCheckedAssignee] = useState();
  const [checkedRequirement, setCheckedRequirement] = useState();
  const [assigneeValue, setAssigneeValue] = useState([]);
  const handleAssigneeValue = (value) => {
    setAssigneeValue(value);
  };
  const [issues, setIssues] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [searchParams, setSearchParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortString: "",
    filterConditions: milestonesCondition,
  });

  const onPageChange = (pageNumber, pageSize) => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    setSearchParams(newSearchParams);
    fetchData(newSearchParams);
  };

  const onPageSizeChange = (pageSize) => {
    handlePageSizeChange(
      setLoadingTable,
      searchParams,
      pageSize,
      issues,
      setSearchParams,
      fetchData
    );
  };
  const handleIssuesSynchronize = async (project) => {
    setLoadingTable(false);
    const { data, err } = await axiosClient.post(
      `/Issue/AsyncGitlabIssue?convertId=${project.project_convert_id}&bearToken=${project.project_convert_token}&id=${project.project_id}`
    );
    if (err) {
      toast.error(`Synchronize issues ${project.project_code} project fail!`);
      setLoadingTable(true);
      return;
    } else {
      toast.success(
        `Synchronize issues ${project.project_code} project successfully!`
      );
      setLoadingTable(true);
      fetchData(searchParams);
    }
  };

  const handleBatchUpdate = (listUpdate, handleReset) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Are you sure to update multiple issues?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          // let ass = [];
          // listUpdate.assignee.length !== 0
          //   ? listUpdate.assignee.map((assignee) => ass.push(JSON.stringify(assignee)))
          //   : "";
          const value = [];
          for (let select of issueId) {
            value.push({
              issue_id: select.issue_id,
              due_date: select.due_date,
              issue_title: select.issue_title,
              description: select.description,
              modified_by: currentUser.email,
              issue_type:
                listUpdate.issue_type === ""
                  ? select.issue_type
                  : listUpdate.issue_type,
              issue_status:
                listUpdate.issue_status === ""
                  ? select.issue_status
                  : listUpdate.issue_status,
              work_process:
                listUpdate.work_process === ""
                  ? select.work_process
                  : listUpdate.work_process,
              assignee:
                listUpdate.assignee === ""
                  ? select.assignee
                  : listUpdate.assignee,
              milestone_id:
                listUpdate.milestone_id === ""
                  ? select.milestone_id
                  : listUpdate.milestone_id,
            });
          }
          if (issueId.length === 0) {
            toast.warning("Please choose any issue to update");
          } else {
            const { data, err } = await axiosClient.post(
              "/Issue/UpdateMultiple",
              value
            );
            if (err) {
              toast.error("Update multiple issue fail!");
              return;
            } else {
              toast.success("Update multiple issue successfully!");
              // setIssueId([]);
              handleReset();
              handleAssigneeValue([]);
              fetchData(searchParams);
            }
          }
        }
      });
  };

  const handleUpdateMultiple = async (selectedRowKeys) => {
    const value = [];
    for (let select of selectedRowKeys) {
      value.push(JSON.parse(select));
    }
    // console.log(selectedRowKeys);
    setIssueId(value);
  };
  const onReset = () => {
    setLoadingTable(false);
    const newSearchParams = {
      ...searchParams,
      filterConditions: milestonesCondition,
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setCheckedIssueStatus(null);
    setCheckedIssueType(null);
    setCheckedIssueWorkProcess(null);
    setCheckedAuthor(null);
    setCheckedAssignee(null);
    setCheckedRequirement(null);
    fetchData(newSearchParams);
  };

  const handleSaveFilter = () => {
    setLoadingTable(false);
    saveFilter(searchParams, setSearchParams, fetchData);
  };
  const onSearch = (filter) => {
    setLoadingTable(false);
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };
  const onSearchAll = (filter, options) => {
    setLoadingTable(true);
    searchAllUtils(filter, options, searchParams, setSearchParams, fetchData);
  };
  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const onChangeIssueStatus = (value) => {
    setCheckedIssueStatus(value);
  };
  const onChangeIssueType = (value) => {
    setCheckedIssueType(value);
  };

  const onChangeIssueWorkProcess = (value) => {
    setCheckedIssueWorkProcess(value);
  };

  const onChangeAuthor = (value) => {
    setCheckedAuthor(value);
  };

  const onChangeAssignee = (value) => {
    setCheckedAssignee(value);
  };

  const onChangeRequirement = (value) => {
    setCheckedRequirement(value);
  };

  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const fetchData = async (searchParams) => {
    const { data: issueArr } = await axiosClient.post(
      `/Issue/getByPaging`,
      searchParams
    );
    setIssues(issueArr);
    setLoading(false);
    setLoadingData(true);
    setLoadingTable(true);
  };

  useEffect(() => {
    fetchData(searchParams);
  }, []);
  return (
    <>
      {loadingData ? (
        <Box className="d-flex flex-column flexGrow_1 flex_height">
          {/* <div className="card custom-card mb-0 flexGrow_1">
        <div className="card-body d-flex flex-column flexGrow_1"> */}
          <div className="d-flex">
            <div className="col-lg-9">
              <h3 className="fw-bold m-0" style={{ paddingBottom: 30 }}>
                Issue List
              </h3>
            </div>

            <div className="col-lg-3 float-end d-flex">
              <BaseSelectInput
                label="Project"
                isLabel={false}
                id="project_id"
                type="project"
                defaultValue={defaultSelectProject}
                placeholder="Project"
                classNameDiv="col-lg-6 ms-1 "
                options={projects}
                isFilter={true}
                isFilterIssue={true}
                onFilter={onProjectFilter}
                checked={checkedProject}
                onChange={onChangeProject}
              />
              {project !== undefined && (
                <BaseButton
                  color="light"
                  value="Batch Update"
                  // variant="outline"
                  nameTitle=" ms-4 btn-batch"
                  onClick={() => setOpenBatchUpdate(!openBatchUpdate)}
                />
              )}
            </div>
          </div>
          {/* {console.log(project)} */}
          {project !== undefined ? (
            <div className="row flexGrow_1">
              <div className="col-8 d-flex flex-column flexGrow_1">
                <div className="row p-0 m-0  mb-2 align-items-center justify-content-between ">
                  <div className="col-lg-7 col-md-3 my-auto d-flex p-0">
                    {/* <BaseSearch
                      className="col-lg-9 col-md-8 p-0 m-0 me-2"
                      placeholderInput="Search here..."
                      placeholderSelect="Search by"
                      options={searchIssue}
                      onSearch={onSearch}
                      checkedSearchSelect={checkedSearchSelect}
                      onResetSearchSelect={onResetSearchSelect}
                      checkedSearchInput={checkedSearchInput}
                      onResetSearchInput={onResetSearchInput}
                    /> */}
                    {/* <BaseSelectInput
                    label="Project"
                    isLabel={false}
                    id="project_id"
                    type="project"
                    defaultValue={project.project_code}
                    placeholder="Project"
                    classNameDiv="col-lg-2 mx-auto p-0 ms-3"
                    options={projects}
                    isFilter={true}
                    isFilterIssue={true}
                    onFilter={onProjectFilter}
                    // onChange={(value) => console.log(value)}
                  /> */}
                    {/* <Tooltip
                    title="Synchronize"
                    placement="top"
                    color="rgb(137, 32, 173)"
                    size="large"
                  > */}
                    {/* <div>
                    <BaseButton
                      nameTitle="float-start ms-2"
                      color="primary"
                      isIconLeft={true}
                      value="Sync"
                      // variant="outline"
                      icon={<SyncOutlined size={30} />}
                      onClick={() => handleIssuesSynchronize(project)}
                    />
                  </div> */}
                    {/* </Tooltip> */}
                  </div>
                  <div className="d-flex col-lg-7 col-md-8 p-0 m-0">
                    <BaseFilter
                      className="me-1 p-0 "
                      icon={
                        <BaseButton
                          value="Filter"
                          color="light"
                          icon={<CaretDownOutlined />}
                        />
                      }
                      filterBody={
                        <div
                          className="cardDropdown"
                          style={{ zIndex: 1, width: 400 }}
                        >
                          <div className="card custom-card mb-0">
                            <div className="card-body filterCard">
                              <SearchFilterAll
                                issueSettings={issueSettings}
                                issueRequirements={issueRequirements}
                                students={students}
                                onFilter={onFilter}
                                onReset={onReset}
                                onChangeIssueStatus={onChangeIssueStatus}
                                checkedIssueStatus={checkedIssueStatus}
                                onChangeIssueType={onChangeIssueType}
                                checkedIssueType={checkedIssueType}
                                checkedIssueWorkProcess={
                                  checkedIssueWorkProcess
                                }
                                onChangeIssueWorkProcess={
                                  onChangeIssueWorkProcess
                                }
                                checkedAuthor={checkedAuthor}
                                onChangeAuthor={onChangeAuthor}
                                checkedAssignee={checkedAssignee}
                                onChangeAssignee={onChangeAssignee}
                                checkedRequirement={checkedRequirement}
                                onChangeRequirement={onChangeRequirement}
                                handleSaveFilter={handleSaveFilter}
                              />
                            </div>
                          </div>
                        </div>
                      }
                    />
                    <BaseSearchAll
                      className="col-lg-7 p-0 m-0"
                      placeholderInput="Search here..."
                      onSearch={onSearchAll}
                      options={searchIssue}
                      checkedSearchSelect={checkedSearchSelect}
                      onResetSearchSelect={onResetSearchSelect}
                      checkedSearchInput={checkedSearchInput}
                      onResetSearchInput={onResetSearchInput}
                    />
                  </div>
                  <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative align-items-center float-end p-0">
                    <NewIssueAll
                      // dataGroup={IssueSettingEnum.WorkProcess}
                      issues={issues}
                      searchParams={searchParams}
                      fetchData={fetchData}
                      students={students}
                      milestones={milestones}
                      projectId={project.project_id}
                      issueSettings={issueSettings}
                      issueRequirements={issueRequirements}
                    />
                    <div className="col-lg-7 float-end me-4 mt-1 d-flex h-100 justify-content-end flex-row align-items-center">
                      <Tooltip
                        title="Reset"
                        placement="top"
                        color="#845adf"
                        size="large"
                      >
                        {loading ? (
                          <LoadingOutlined
                            className="filterIcon me-4 float-end"
                            disabled
                          />
                        ) : (
                          <ReloadOutlined
                            className="filterIcon me-4 float-end"
                            onClick={() => {
                              setLoading(true);
                              onReset();
                            }}
                          />
                        )}
                      </Tooltip>
                      {/* <BaseButton
                      color="light"
                      value="Batch Update"
                      variant="outline"
                      nameTitle="me-2"
                      onClick={() => setOpenBatchUpdate(!openBatchUpdate)}
                    /> */}
                      <div>
                        <BaseButton
                          nameTitle="float-start "
                          color="primary"
                          isIconLeft={true}
                          value="Sync"
                          // variant="outline"
                          icon={<SyncOutlined size={30} />}
                          onClick={() => handleIssuesSynchronize(project)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Grid container className="m-0 flexGrow_1">
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sm={12}
                    className="d-flex flex-column flexGrow_1"
                  >
                    {/* <AuthoComponentRoutes
                element={
                  <IssueTypeTable
                    issues={issues}
                    searchParams={searchParams}
                    onPageChange={onPageChange}
                    fetchData={fetchData}
                    students={students}
                    milestones={milestones}
                    projectId={projectId}
                    issueStatus={issueStatus}
                    workProcess={workProcess}
                    isIssueAll={true}
                    handleUpdateMultiple={handleUpdateMultiple}
                  />
                }
                listRole={[Role.Admin, Role.Manager, Role.Teacher]}
              /> */}
                    <div className="d-flex flex-column flexGrow_1">
                      {issues.data.length !== 0 ? (
                        <div className="issue__list">
                          <IssueTypeStudent
                            issues={issues}
                            projectId={project.project_id}
                            searchParams={searchParams}
                            onPageChange={onPageChange}
                            fetchData={fetchData}
                            openBatchUpdate={openBatchUpdate}
                            handleUpdateMultiple={handleUpdateMultiple}
                            loadingTable={loadingTable}
                          />
                        </div>
                      ) : (
                        <div className="issue__list d-flex flex-column flexGrow_1">
                          <IssueTypeStudent
                            issues={issues}
                            projectId={project.project_id}
                            searchParams={searchParams}
                            onPageChange={onPageChange}
                            fetchData={fetchData}
                            openBatchUpdate={openBatchUpdate}
                            handleUpdateMultiple={handleUpdateMultiple}
                            loadingTable={loadingTable}
                          />
                        </div>
                      )}
                    </div>
                    <BasePagination
                      pageNumber={searchParams.pageNumber}
                      onPageChange={(pageNumber, pageSize) => {
                        onPageChange(pageNumber, pageSize);
                      }}
                      onPageSizeChange={(pageSize) => {
                        onPageSizeChange(pageSize);
                      }}
                      pageSize={searchParams.pageSize}
                      totalRecord={issues.totalRecord}
                    />
                  </Grid>
                </Grid>
              </div>
              <div
                className={
                  openBatchUpdate
                    ? "col-3 d-flex flex-column widthBatchUpdate mx-2 ps-3"
                    : "col-3 d-flex flex-column widthUnBatchUpdate d-none mx-2 ps-3"
                }
              >
                <BatchUpdate
                  issueSettings={issueSettings}
                  students={students}
                  milestones={milestones}
                  handleBatchUpdate={handleBatchUpdate}
                  handleAssigneeValue={handleAssigneeValue}
                  assigneeValue={assigneeValue}
                />
              </div>
            </div>
          ) : (
            <div className="row flexGrow_1">
              <div className="col-8 d-flex flex-column flexGrow_1">
                <Grid container className="m-0 flexGrow_1">
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sm={12}
                    className="d-flex flex-column flexGrow_1"
                  >
                    <div className="issue__list d-flex flex-column flexGrow_1">
                      <div className="d-flex flex-column flexGrow_1">
                        <div className="d-flex flex-column flexGrow_1 justify-content-center">
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          )}
          {/* </div>
      </div> */}
        </Box>
      ) : (
        <Spin tip="Loading" size="large" style={{ minHeight: "100vh" }}>
          <Box className="d-flex flex-column flexGrow_1 flex_height">
            <h3 className="fw-bold m-0" style={{ paddingBottom: 30 }}>
              Issue List
            </h3>
          </Box>
        </Spin>
      )}
    </>
  );
};
