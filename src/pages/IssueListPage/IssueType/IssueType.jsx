import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IssueTypeTable } from "../IssueTypeTable/IssueTypeTable";
import { axiosClient } from "src/axios/AxiosClient";
import {
  ConditionEnum,
  FilterOperatorEnum,
  IssueSettingEnum,
} from "src/enum/Enum";
import { NewIssue } from "../NewIssue/NewIssue";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { Role } from "src/enum/Role";
import { IssueTypeStudent } from "../IssueTypeStudent/IssueTypeStudent";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { FilterIssue } from "../FilterIssue/FilterIssue";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Spin } from "antd";
import { SearchFilter } from "../FilterIssue/SearchFilter";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  decodeParam,
  encodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";
const searchIssue = [
  {
    id: "issue_title",
    value: "Issue Title",
  },
];
export const IssueType = ({
  issueType,
  project,
  projects,
  issueSettings,
  issueRequirements,
  students,
  milestones,
  onProjectFilter,
  milestonesCondition,
  onChangeProject,
  checkedProject,
  searchParamsURL,
  setSearchParamsURL,
  param,
  tab,
  projectParam,
}) => {
  const navigate = useNavigate();
  const defaultSelectProject = `${project.group_name} (${project.project_code})`;
  const [spin, setSpin] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(undefined);
  const [checkedIssueStatus, setCheckedIssueStatus] = useState();
  const [checkedIssueWorkProcess, setCheckedIssueWorkProcess] = useState();
  const [checkedAuthor, setCheckedAuthor] = useState();
  const [checkedAssignee, setCheckedAssignee] = useState();
  const [checkedRequirement, setCheckedRequirement] = useState();
  const [issues, setIssues] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  // const newSearchParams = [{
  //   field: "issue_type",
  //   value: issueType.issue_setting_id,
  //   condition: ConditionEnum.Equal,
  //   operator: FilterOperatorEnum.AND,
  // }]
  let milestonesArr = [
    {
      field: "issue_type",
      value: issueType.issue_setting_id,
      condition: ConditionEnum.Equal,
      operator: FilterOperatorEnum.AND,
    },
  ];
  // milestonesCondition.push({
  //   field: "issue_type",
  //   value: issueType.issue_setting_id,
  //   condition: ConditionEnum.Equal,
  //   operator: FilterOperatorEnum.AND,
  // });
  if (milestonesCondition.length !== 0) {
    milestonesCondition.map((milestone) => milestonesArr.push(milestone));
  }
  // newSearchParams.push(milestonesCondition)
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "",
  //   filterConditions: milestonesArr,
  // });
  const [searchParams, setSearchParams] = useState(
    decodeParam(param) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: milestonesArr,
        }
      : {
          pageNumber: decodeParam(param).pageNumber,
          pageSize: decodeParam(param).pageSize,
          sortString: decodeParam(param).sortString,
          filterConditions: decodeParam(param).filterConditions,
        }
  );

  const onPageChange = (pageNumber, pageSize) => {
    setLoadingTable(false);
    const newSearchParams = {
      ...searchParams,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    setSearchParams(newSearchParams);
    setSearchParamsURL({
      projectParam: projectParam,
      tab: tab,
      param: encodeParam(newSearchParams),
    });
    fetchData(newSearchParams);
  };

  const onPageSizeChange = (pageSize) => {
    setLoadingTable(false);
    let pageNumber = searchParams.pageNumber;
    if (searchParams.pageNumber * pageSize > issues.totalRecord) {
      pageNumber = 1;
    }
    const newSearchParams = {
      ...searchParams,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    setSearchParams(newSearchParams);
    const filterConditions = JSON.stringify(newSearchParams.filterConditions);
    setSearchParamsURL({
      projectParam: projectParam,
      tab: tab,
      param: encodeParam(newSearchParams),
    });
    setSearchParams(newSearchParams);
    fetchData(newSearchParams);
  };
  const onReset = () => {
    setLoadingTable(false);
    const newSearchParams = {
      ...searchParams,
      filterConditions: milestonesArr,
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(undefined);
    setCheckedIssueStatus(null);
    setCheckedIssueWorkProcess(null);
    setCheckedAuthor(null);
    setCheckedAssignee(null);
    setSearchParamsURL({
      projectParam: projectParam,
      tab: tab,
      param: encodeParam(newSearchParams),
    });
    fetchData(newSearchParams);
  };

  const handleSaveFilter = () => {
    setLoadingTable(false);
    // saveFilter(searchParams, setSearchParams, fetchData);
    const newSearchParams = { ...searchParams, pageNumber: 1 };
    setSearchParams(newSearchParams);
    // console.log(encodeURI(newSearchParams.filterConditions))
    // console.log(newSearchParams)
    setSearchParamsURL({
      projectParam: projectParam,
      tab: tab,
      param: encodeParam(newSearchParams),
    });
    fetchData(newSearchParams);
  };
  const onSearch = (filter) => {
    setLoadingTable(false);
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };
  const onSearchAll = (filter, options) => {
    setLoadingTable(false);
    // searchAllUtils(filter, options, searchParams, setSearchParams, fetchData);
    // if(param ===null) {

    // }
    const filterConditions = searchParams.filterConditions.filter(
      (obj) => obj.condition !== ConditionEnum.Like
    );
    if (options.length === 1) {
      filterConditions.push({
        field: options[0].id,
        value: filter,
        condition: ConditionEnum.Like,
      });
    } else {
      options.map((ele, index) => {
        if (index === 0) {
          filterConditions.push({
            field: ele.id,
            value: filter,
            condition: ConditionEnum.Like,
            operator: FilterOperatorEnum.OR,
            parenthesis: FilterOperatorEnum.OpenParenthesis,
          });
        }
        if (index > 0 && index < options.length - 1) {
          filterConditions.push({
            field: ele.id,
            value: filter,
            condition: ConditionEnum.Like,
            operator: FilterOperatorEnum.OR,
          });
        }
        if (index === options.length - 1) {
          filterConditions.push({
            field: ele.id,
            value: filter,
            condition: ConditionEnum.Like,
            parenthesis: FilterOperatorEnum.CloseParenthesis,
          });
        }
      });
    }
    const newSearchParams = {
      ...searchParams,
      pageNumber: 1,
      filterConditions: filterConditions,
    };
    setSearchParamsURL({
      projectParam: projectParam,
      tab: tab,
      param: encodeParam(newSearchParams),
    });
    setSearchParams(newSearchParams);
    fetchData(newSearchParams);
  };
  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const onChangeIssueStatus = (value) => {
    setCheckedIssueStatus(value);
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

    // setSearchParamsURL({
    //   projectParam: projectParam,
    //   tab: encodeParam(null),
    //   param: encodeParam(searchParams),
    // });
    // console.log(param);
    genDataStateParam(
      encodeParam(searchParams),
      setCheckedSearchInput,
      "search",
      [],
      searchIssue
    );
    genDataStateParam(
      encodeParam(searchParams),
      setCheckedRequirement,
      "issue",
      issueRequirements
    );
    genDataStateParam(
      encodeParam(searchParams),
      setCheckedIssueStatus,
      "issue_group",
      issueSettings.issue_statuses,
      null,
      "issue_status"
    );
    genDataStateParam(
      encodeParam(searchParams),
      setCheckedIssueWorkProcess,
      "issue_group",
      issueSettings.work_process,
      null,
      "work_process"
    );
    genDataStateParam(
      encodeParam(searchParams),
      setCheckedAuthor,
      "class_student",
      students,
      null,
      "created_by"
    );
    // console.log(students)
    genDataStateParam(
      encodeParam(searchParams),
      setCheckedAssignee,
      "class_student",
      students,
      null,
      "assignee"
    );
    setIssues(issueArr);
    setLoading(false);
    setLoadingData(true);
    // setSearchParamsURL({
    //   projectParam: encodeParam(project.project_id),
    //   tab: encodeParam(issueType.issue_setting_id),
    // });
    setLoadingTable(true);
  };
  useEffect(() => {
    fetchData(searchParams);
  }, []);

  return (
    <>
      {/* {console.log(loadingTable)} */}
      {loadingData && loadingTable ? (
        <Box className="d-flex flex-column flexGrow_1 flex_height">
          <div className="d-flex">
            <div className="col-lg-10">
              <h3 className="fw-bold m-0" style={{ paddingBottom: 30 }}>
                Issue List
              </h3>
            </div>
            <div className="col-lg-2 ms-2">
              {" "}
              <BaseSelectInput
                label="Project"
                isLabel={false}
                id="project_id"
                type="project"
                defaultValue={defaultSelectProject}
                placeholder="Project"
                classNameDiv="col-lg-10 ms-4"
                options={projects}
                isFilter={true}
                isFilterIssue={true}
                onFilter={onProjectFilter}
                checked={checkedProject}
                onChange={onChangeProject}
                // onChange={(value) => console.log(value)}
              />
            </div>
          </div>
          {/* <div className="card custom-card mb-0 flexGrow_1">
        <div className="card-body d-flex flex-column flexGrow_1"> */}
          <div className="row p-0 m-0  mb-2 align-items-center justify-content-between ">
            <div className="col-lg-7 col-md-3 my-auto d-flex p-0">
              {/* <BaseSearch
                className="col-lg-9 col-md-8 p-0 m-0"
                placeholderInput="Search here..."
                placeholderSelect="Search by"
                options={searchIssue}
                onSearch={onSearch}
                checkedSearchSelect={checkedSearchSelect}
                onResetSearchSelect={onResetSearchSelect}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              /> */}
            </div>
            <div className="d-flex col-lg-7 col-md-8 p-0 m-0">
              <BaseFilter
                className="me-1 p-0 "
                icon={
                  <BaseButton
                    value="Filter"
                    color="light"
                    nameTitle="btnFilter"
                    icon={<CaretDownOutlined />}
                  />
                }
                filterBody={
                  <div className="cardDropdown" style={{ zIndex: 1, width: 500 }}>
                    <div className="card custom-card mb-0">
                      <div className="card-body filterCard">
                        {/* <FilterIssue
                            onFilter={onFilter}
                            fetchData={fetchData}
                            searchParams={searchParams}
                            onReset={onReset}
                            // checkedStatus={checkedStatus}
                            // onChangeStatus={onChangeStatus}
                            // checkedSetting={checkedSetting}
                            // onChangeSetting={onChangeSetting}
                          /> */}
                        <SearchFilter
                          issueSettings={issueSettings}
                          issueRequirements={issueRequirements}
                          students={students}
                          onFilter={onFilter}
                          onReset={onReset}
                          onChangeIssueStatus={onChangeIssueStatus}
                          checkedIssueStatus={checkedIssueStatus}
                          checkedIssueWorkProcess={checkedIssueWorkProcess}
                          onChangeIssueWorkProcess={onChangeIssueWorkProcess}
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
                options={searchIssue}
                onSearch={onSearchAll}
                checkedSearchSelect={checkedSearchSelect}
                onResetSearchSelect={onResetSearchSelect}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              />
            </div>
            <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative d-flex align-items-center justify-content-end p-0">
              <div className="col-lg-7 float-end d-flex h-100 justify-content-end">
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
              </div>
              <BaseButton
                nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
                onClick={() =>
                  navigate(
                    `/new-issue/${project.project_id}/${issueType.issue_setting_id}`
                  )
                }
                color="warning"
                value="Add New"
              />
              {/* <NewIssue
                // dataGroup={IssueSettingEnum.WorkProcess}
                issues={issues}
                issueType={issueType}
                searchParams={searchParams}
                fetchData={fetchData}
                students={students}
                milestones={milestones}
                projectId={project.project_id}
                issueSettings={issueSettings}
                issueRequirements={issueRequirements}
              /> */}
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
                  issueSettings={issueSettings}
                />
              }
              listRole={[Role.Admin, Role.Manager, Role.Teacher]}
            /> */}
              <div className="d-flex flex-column flexGrow_1">
                {issues.data.length !== 0 ? (
                  <div className="issue__list">
                    <IssueTypeStudent
                      issues={issues}
                      searchParams={searchParams}
                      onPageChange={onPageChange}
                      fetchData={fetchData}
                      projectId={project.project_id}
                      loadingTable={loadingTable}
                    />
                  </div>
                ) : (
                  <div className="issue__list d-flex flex-column flexGrow_1">
                    <IssueTypeStudent
                      issues={issues}
                      searchParams={searchParams}
                      onPageChange={onPageChange}
                      fetchData={fetchData}
                      projectId={project.project_id}
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
