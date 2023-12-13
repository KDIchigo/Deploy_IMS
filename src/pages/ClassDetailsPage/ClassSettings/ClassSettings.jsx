import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { ConditionEnum, FilterOperatorEnum } from "src/enum/Enum";
import { filterUtils, searchUtils } from "src/utils/handleSearchFilter";
import "./ClassSettings.scss";
import { MyTable } from "./ClassSettingsTable/MyTable";
import { NewIssueSetting } from "./ClassSettingsTable/NewIssueSetting/NewIssueSetting";
import { FilterClassSettings } from "./FilterClassSettings/FilterClassSettings";
import { Spin, Tooltip } from "antd";
const searchIssueSetting = [
  {
    id: "issue_value",
    value: "Setting Value",
  },
  {
    id: "issue_group",
    value: "Setting Group",
  },
];
export const ClassSettings = ({ classId, classObj }) => {
  const [loading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [checkedSetting, setCheckedSetting] = useState();
  const [checkedStatus, setCheckedStatus] = useState();
  const [spin, setSpin] = useState(false);
  const [classSettings, setClassSettings] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const filterConditions = [
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
      operator: FilterOperatorEnum.OR,
    },
    {
      field: "subject_id",
      value: classObj.subject_id,
      condition: ConditionEnum.Equal,
      operator: FilterOperatorEnum.OR,
    },
  ];
  const [searchParams, setSearchParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortString: "",
    filterConditions: filterConditions,
  });

  const fetchData = async (searchParams) => {
    const { data: issueSettingArr } = await axiosClient.post(
      "/IssueSetting/GetByPaging",
      searchParams
    );
    setClassSettings(issueSettingArr);
    setLoading(false);
    setSpin(true);
  };
  const issueGroup = (issue_group) => {
    let value = "";
    switch (issue_group) {
      case 1:
        value = "Issue Type";
        break;
      case 2:
        value = "Issue Status";
        break;
      case 3:
        value = "Work Process";
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
  const onSearch = (filter) => {
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const handleReset = () => {
    setLoading(true);
    setIsSearch(false);
    let reLoad = {
      ...searchParams,
      filterConditions: [
        {
          field: "class_id",
          value: classId,
          condition: ConditionEnum.Equal,
        },
      ],
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
      filterConditions: filterConditions,
    };
    setSearchParams(newSearchParams);
    // fetchData(newSearchParams);
    return newSearchParams;
    // console.log(newSearchParams);
  };

  const onPageChange = (pageNumber) => {
    const newSearchParams = { ...searchParams, pageNumber: pageNumber };
    setSearchParams(newSearchParams);
    fetchData(newSearchParams);
    console.log(pageNumber);
  };
  const onReset = () => {
    const newSearchParams = {
      ...searchParams,
      filterConditions: [
        {
          field: "class_id",
          value: classId,
          condition: ConditionEnum.Equal,
        },
      ],
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(null);
    setCheckedSearchInput(null);
    setCheckedSetting(null);
    setCheckedStatus(null);
    fetchData(newSearchParams);
  };

  useEffect(() => {
    fetchData(searchParams);
  }, []);
  return (
    <>
      <Box className="d-flex flex-column flexGrow_1 flex_height">
        {/* <div className="card custom-card mb-0 flexGrow_1">
        <div className="card-body d-flex flex-column flexGrow_1"> */}
        <div className="row p-0 m-0  mb-2 align-items-center justify-content-between ">
          <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
            Setting for {classObj.class_code}
          </h3>
          <div className="col-lg-7 col-md-3 my-auto d-flex p-0">
            <BaseSearch
              className="col-lg-9 col-md-8 p-0 m-0"
              placeholderInput="Search here..."
              placeholderSelect="Search by"
              options={searchIssueSetting}
              onSearch={onSearch}
              checkedSearchSelect={checkedSearchSelect}
              onResetSearchSelect={onResetSearchSelect}
              checkedSearchInput={checkedSearchInput}
              onResetSearchInput={onResetSearchInput}
            />
          </div>
          <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative align-items-center float-end p-0">
            <NewIssueSetting
              // dataGroup={IssueSettingEnum.WorkProcess}
              classId={classId}
              issueGroup={issueGroup}
              classSettings={classSettings}
              searchParams={searchParams}
              fetchData={fetchData}
            />
            <div className="col-lg-7 float-end me-4 mt-1 d-flex h-100 justify-content-end flex-row align-items-center">
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
              <BaseFilter
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
                        <FilterClassSettings
                          onFilter={onFilter}
                          fetchData={fetchData}
                          searchParams={searchParams}
                          onReset={onReset}
                          issueGroup={issueGroup}
                          classSettings={classSettings}
                          checkedStatus={checkedStatus}
                          onChangeStatus={onChangeStatus}
                          checkedSetting={checkedSetting}
                          onChangeSetting={onChangeSetting}
                        />
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>

        <Grid container className="m-0 flexGrow_1">
          <Grid item md={12} xs={12} sm={12} className="d-flex flex-column ">
            {/* <DemoTable
                onSearch={onSearch}
                classSettings={classSettings}
                fetchData={fetchData}
                searchParams={searchParams}
                classId={classId}
                handleReset={handleReset}
                loading={loading}
                isSearch={isSearch}
              /> */}
            <MyTable
              onSearch={onSearch}
              classSettings={classSettings}
              fetchData={fetchData}
              searchParams={searchParams}
              classId={classId}
              handleReset={handleReset}
              loading={loading}
              isSearch={isSearch}
              onPageChange={onPageChange}
              issueGroup={issueGroup}
            />
          </Grid>
        </Grid>
        {/* </div>
      </div> */}
      </Box>
    </>
  );
};
