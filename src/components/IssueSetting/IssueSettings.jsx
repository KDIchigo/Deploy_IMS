import {
  CaretDownOutlined,
  CloudSyncOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { AsyncEnum, ConditionEnum, IssueSettingEnum } from "src/enum/Enum";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import "./IssueSettings.scss";
import { FilterIssueSettings } from "./FilterIssueSettings/FilterIssueSettings";
import { IssueSettingsTable } from "./IssueSettingsTable/IssueSettingsTable";
import { NewIssueSetting } from "../IssueSetting/NewIssueSettings/NewIssueSettings";
import { Tooltip } from "antd";
import { HandleIssueSettings } from "src/utils/handleIssueSettings";
import { toast } from "react-toastify";
import { BaseSearchAll } from "../Base/BaseSearch/BaseSearchAll";
import { encodeParam } from "src/utils/handleEnDecode";

export const IssueSettings = ({
  id,
  typeIssue,
  option,
  issueSettings,
  setIssueSettings,
  searchParams,
  setSearchParams,
  checkedSearchSelect,
  setCheckedSearchSelect,
  checkedSearchInput,
  setCheckedSearchInput,
  checkedSetting,
  setCheckedSetting,
  checkedStatus,
  setCheckedStatus,
  searchIssueSetting,
  setSearchParamsURL,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  // const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  // const [checkedSearchInput, setCheckedSearchInput] = useState(undefined);
  // const [checkedSetting, setCheckedSetting] = useState(undefined);
  // const [checkedStatus, setCheckedStatus] = useState(undefined);
  const [spin, setSpin] = useState(false);
  // const [issueSettings, setIssueSettings] = useState({
  //   totalRecord: 0,
  //   data: [],
  //   summary: "",
  // });

  const selectTypeIssue = (typeIssue) => {
    let field = "";
    switch (typeIssue) {
      case "class":
        field = "class_id";
        break;
      case "project":
        field = "project_id";
        break;

      default:
        field = undefined;
        break;
    }
    return field;
  };

  const handleIssueSettingSynchronize = async (option) => {
    let convertId = 0;
    let bearToken = "";
    let id = "";
    let action = 0;
    switch (typeIssue) {
      case "class":
        convertId = option.class_convert_id;
        bearToken = option.class_convert_token;
        id = option.class_id;
        action = AsyncEnum.AsyncClass;
        break;
      case "project":
        convertId = option.project_convert_id;
        bearToken = option.project_convert_token;
        id = option.project_id;
        action = AsyncEnum.AsyncProject;
        break;
      default:
        convertId = 0;
        bearToken = "";
        id = "";
        action = 0;
        break;
    }

    if (convertId !== null && bearToken !== null) {
      setLoadingTable(true);
      const { data, err } = await axiosClient.post(
        `/IssueSetting/AsyncLabels?convertId=${convertId}&bearToken=${bearToken}&id=${id}&action=${action}`
      );
      if (err) {
        toast.error(`Synchronize issue setting ${typeIssue} fail!`);
        setLoadingTable(false);
        return;
      } else {
        toast.success(`Synchronize issue setting ${typeIssue} successfully!`);
        setLoadingTable(false);
        fetchData(searchParams);
      }
    } else {
      // let toastErr = "";
      // convertId === null && (toastErr = toastErr + "convert ID");
      // convertId === null &&
      //   bearToken === null &&
      //   (toastErr = toastErr + " and ");
      // bearToken === null && (toastErr = toastErr + "bearToken");
      toast.error(
        `You have not configured a personal token and project ID for this class. Please try again!`
      );
      setLoadingTable(false);
    }
  };
  let filterConditions = [];
  const {
    // handleSubjectIssueSetting,
    handleClassIssueSetting,
    handleProjectIssueSetting,
  } = HandleIssueSettings();
  // if (typeIssue === "subject") {
  //   filterConditions = handleSubjectIssueSetting(id);
  // }
  if (typeIssue === "class") {
    filterConditions = handleClassIssueSetting(id, option);
  }
  if (typeIssue === "project") {
    filterConditions = handleProjectIssueSetting(id, option);
  }

  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "",
  //   filterConditions: filterConditions.filterConditions,
  // });

  const fetchData = async (searchParams) => {
    const { data: issueSettingArr } = await axiosClient.post(
      "/IssueSetting/GetByPaging",
      searchParams
    );
    setIssueSettings(issueSettingArr);
    setLoading(false);
    setSpin(true);
    setLoadingTable(false);
  };
  const issueGroup = (issue_group) => {
    let value = "";
    switch (issue_group) {
      case IssueSettingEnum.IssueType:
        value = "Issue Type";
        break;
      case IssueSettingEnum.IssueStatus:
        value = "Issue Status";
        break;
      case IssueSettingEnum.WorkProcess:
        value = "Work Process";
        break;
      case IssueSettingEnum.Others:
        value = "Others";
        break;
      default:
        value = undefined;
        break;
    }
    return value;
  };
  const onChangeSetting = (value) => {
    setCheckedSetting(value);
  };
  const onChangeStatus = (value) => {
    setCheckedStatus(value);
  };
  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const handleSaveFilter = () => {
    setLoadingTable(true);
    saveFilter(searchParams, setSearchParams, fetchData, setSearchParamsURL);
  };
  const onSearch = (filter) => {
    setLoadingTable(true);
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };
  const onSearchAll = (filter, options) => {
    setLoadingTable(true);
    searchAllUtils(
      filter,
      options,
      searchParams,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };
  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const handleReset = () => {
    setLoadingTable(true);
    setLoading(true);
    setIsSearch(false);
    let reLoad = {
      ...searchParams,
      filterConditions: filterConditions.filterConditions,
    };
    setSearchParams(reLoad);
    fetchData(reLoad);
  };

  const filterIssueGroup = (value) => {
    const filter = {
      field: "issue_group",
      value: value,
      condition: ConditionEnum.Equal,
    };
    filterConditions.push(filter);
    const newSearchParams = {
      ...searchParams,
      filterConditions: filterConditions.filterConditions,
    };
    setSearchParams(newSearchParams);
    // fetchData(newSearchParams);
    return newSearchParams;
    // console.log(newSearchParams);
  };

  const onPageChange = (pageNumber, pageSize) => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    setSearchParams(newSearchParams);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  const onPageSizeChange = (pageSize) => {
    handlePageSizeChange(
      setLoadingTable,
      searchParams,
      pageSize,
      issueSettings,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };

  const onReset = () => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      filterConditions: filterConditions.filterConditions,
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setCheckedSetting(null);
    setCheckedStatus(null);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  // useEffect(() => {
  //   fetchData(searchParams);
  // }, []);
  return (
    <>
      {/* {console.log(option.subject_code)} */}
      <Box className="d-flex flex-column flexGrow_1 flex_height">
        {/* <div className="card custom-card mb-0 flexGrow_1">
        <div className="card-body d-flex flex-column flexGrow_1"> */}
        <div className="row p-0 m-0  mb-2 align-items-center justify-content-between ">
          <h3 className="fw-bold m-0 px-0" style={{ paddingBottom: 20 }}>
            Settings for{" "}
            {typeIssue === "class" ? " Class " + option.class_code : ""}
            {/* {typeIssue === "subject" ? " Subject " + option.subject_code : ""} */}
            {typeIssue === "project" ? " Project " + option.project_code : ""}
          </h3>
          <div className="col-lg-7 col-md-3 my-auto p-0">
            {/* <BaseSearch
              className="col-lg-8 col-md-8 p-0 m-0 me-2"
              placeholderInput="Search here..."
              placeholderSelect="Search by"
              options={searchIssueSetting}
              onSearch={onSearch}
              checkedSearchSelect={checkedSearchSelect}
              onResetSearchSelect={onResetSearchSelect}
              checkedSearchInput={checkedSearchInput}
              onResetSearchInput={onResetSearchInput}
            /> */}
            <div className="d-flex p-0 m-0">
              <BaseFilter
                className="me-1 p-0"
                icon={
                  <BaseButton
                    value="Filter"
                    color="light"
                    nameTitle="btnFilter"
                    icon={<CaretDownOutlined />}
                  />
                }
                filterBody={
                  <div className="cardDropdown" style={{ zIndex: 1 }}>
                    <div className="card custom-card mb-0">
                      <div className="card-body filterCard">
                        <FilterIssueSettings
                          id={id}
                          typeIssue={typeIssue}
                          selectTypeIssue={selectTypeIssue}
                          onFilter={onFilter}
                          fetchData={fetchData}
                          searchParams={searchParams}
                          onReset={onReset}
                          checkedStatus={checkedStatus}
                          onChangeStatus={onChangeStatus}
                          checkedSetting={checkedSetting}
                          onChangeSetting={onChangeSetting}
                          issueGroup={issueGroup}
                          issueSettings={issueSettings}
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
                options={searchIssueSetting}
                onSearch={onSearchAll}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              />
            </div>
          </div>
          <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 p-0 position-relative d-flex align-items-center justify-content-end">
            <div className="col-lg-7 float-end d-flex h-100 justify-content-end">
              <Tooltip
                title="Reset"
                placement="topLeft"
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
              {typeIssue === "project" ? (
                <>
                  {/* <Tooltip
                title="Synchronize"
                placement="top"
                color="rgb(137, 32, 173)"
                size="large"
              > */}
                  <div>
                    <BaseButton
                      // variant="outline"
                      nameTitle="float-start"
                      color="primary"
                      isIconLeft={true}
                      value="Sync"
                      // variant="outline"
                      icon={<SyncOutlined size={30} />}
                      onClick={() => handleIssueSettingSynchronize(option)}
                    />
                  </div>
                  {/* </Tooltip> */}
                  {/* <BaseButton
                  nameTitle="float-start ms-2"
                  type="button"
                  value="IMS"
                  color="purple"
                  isIconLeft={true}
                  icon={<CloudSyncOutlined size={10} />}
                  onClick={() =>
                    handleIssueSettingSynchronize(
                      option,
                      AsyncEnum.AsyncFollowIms
                    )
                  }
                />
                <BaseButton
                  nameTitle="float-start ms-2"
                  type="button"
                  value="Gitlab"
                  color="purple"
                  isIconLeft={true}
                  icon={<CloudSyncOutlined size={10} />}
                  onClick={() =>
                    handleIssueSettingSynchronize(
                      option,
                      AsyncEnum.AsyncFollowGitlab
                    )
                  }
                /> */}
                </>
              ) : (
                ""
              )}
            </div>
            <NewIssueSetting
              // dataGroup={IssueSettingEnum.WorkProcess}
              id={id}
              option={option}
              typeIssue={typeIssue}
              selectTypeIssue={selectTypeIssue}
              searchParams={searchParams}
              fetchData={fetchData}
              issueGroup={issueGroup}
            />
          </div>
        </div>

        <Grid container className="m-0 flexGrow_1">
          <Grid item md={12} xs={12} sm={12} className="d-flex flex-column ">
            <IssueSettingsTable
              onSearch={onSearch}
              issueSettings={issueSettings}
              fetchData={fetchData}
              searchParams={searchParams}
              id={id}
              typeIssue={typeIssue}
              selectTypeIssue={selectTypeIssue}
              handleReset={handleReset}
              loading={loading}
              isSearch={isSearch}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              issueGroup={issueGroup}
              loadingTable={loadingTable}
            />
          </Grid>
        </Grid>
        {/* </div>
      </div> */}
      </Box>
    </>
  );
};
