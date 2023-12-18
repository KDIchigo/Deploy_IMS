import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, SettingEnum } from "src/enum/Enum";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import "./SystemSettingListPage.scss";
import { FilterSetting } from "./components/FilterSetting/FilterSetting";
import { NewSystemSetting } from "./components/NewSystemSetting/NewSystemSetting";
import { SystemSettingTable } from "./components/SystemSettingTable/SystemSettingTable";
import { Tooltip } from "antd";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  backDataStateParam,
  checkCurrentURL,
  decodeParam,
  encodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";

const searchSetting = [
  {
    id: "setting_value",
    value: "Setting Value",
  },
];
const settings = [
  {
    value: SettingEnum.Role,
    label: "Role",
  },
  {
    value: SettingEnum.Domain,
    label: "Domain",
  },
  {
    value: SettingEnum.Semester,
    label: "Semester",
  },
];
const filter = {
  field: "",
  value: "",
  condition: ConditionEnum.Equal,
};
const SystemSettingListPage = () => {
  const location = useLocation();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  const [paramDecode, setParamDecode] = useState(param);
  // const pageNumberURL = searchURLParams.get("pageNumber");
  // const pageSizeURL = searchURLParams.get("pageSize");
  // const sortStringURL = searchURLParams.get("sortString");
  // const filterConditionsJson = searchURLParams.get("filterConditions");
  // const filterConditions = filterConditionsJson
  //   ? JSON.parse(filterConditionsJson)
  //   : [];

  const dataGroup = (data_group) => {
    let value = "";
    switch (data_group) {
      case 1:
        value = "Role";
        break;
      case 2:
        value = "Semester";
        break;
      case 3:
        value = "Email Domain";
        break;
      default:
        value = undefined;
        break;
    }
    return value;
  };
  const [settings, setSettings] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });

  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [checkedSettingGroup, setCheckedSettingGroup] = useState();
  const [checkedStatus, setCheckedStatus] = useState();

  const [searchParams, setSearchParams] = useState(
    decodeParam(paramDecode) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: [],
        }
      : {
          pageNumber: decodeParam(paramDecode).pageNumber,
          pageSize: decodeParam(paramDecode).pageSize,
          sortString: decodeParam(paramDecode).sortString,
          filterConditions: decodeParam(paramDecode).filterConditions,
        }
  );

  const fetchDataEffect = async (searchParams) => {
    const { data: settingList } = await axiosClient.post(
      "/Setting/GetByPaging",
      searchParams
    );
    setSettings(settingList);

    genDataStateParam(
      paramDecode,
      setCheckedSearchInput,
      "search",
      [],
      searchSetting
    );
    genDataStateParam(paramDecode, setCheckedStatus, "status");
    genDataStateParam(paramDecode, setCheckedSettingGroup, "setting_group");
    setSearchParamsURL({ param: encodeParam(searchParams) });

    setLoading(false);
    setLoadingData(true);
    setLoadingTable(false);
    // console.log(settingList.data);
  };
  const fetchData = async (searchParams) => {
    const { data: settingList } = await axiosClient.post(
      "/Setting/GetByPaging",
      searchParams
    );
    setSettings(settingList);
    setLoading(false);
    setLoadingData(true);
    setLoadingTable(false);
    // console.log(settingList.data);
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
      settings,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };

  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
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

  const onReset = () => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      filterConditions: [],
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setCheckedSettingGroup(null);
    setCheckedStatus(null);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  const handleSaveFilter = () => {
    setLoadingTable(true);
    saveFilter(searchParams, setSearchParams, fetchData, setSearchParamsURL);
  };

  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const onChangeStatus = (value) => {
    setCheckedStatus(value);
  };
  const onChangeSettingGroup = (value) => {
    setCheckedSettingGroup(value);
  };

  useEffect(() => {
    fetchDataEffect(searchParams);
  }, []);

  const fetchBackData = () => {
    const params = new URLSearchParams(location.search);
    const paramFromURL = params.get("param");

    // Nếu filter thay đổi, cập nhật trạng thái của component
    if (paramDecode !== paramFromURL) {
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedSearchInput,
        "search",
        [],
        searchSetting,
        "",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedStatus,
        "status",
        [],
        [],
        "status",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedSettingGroup,
        "setting_group",
        settings,
        [],
        "data_group",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      // console.log(decodeParam(paramFromURL))
    } else {
    genDataStateParam(
      paramDecode,
      setCheckedSearchInput,
      "search",
      [],
      searchSetting
    );
      genDataStateParam(paramDecode, setCheckedStatus, "status");
      genDataStateParam(paramDecode, setCheckedSettingGroup, "setting_group");
    }
  };

  useEffect(() => {
    // Xử lý sự thay đổi trong URL
    fetchBackData();
  }, [location.search, paramDecode]);
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="setting"
        spin={loadingData}
        dashboardBody={
          // <div className="col-xl-12">
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    System Setting List
                  </h3>
                  <div className="row p-0 m-0  mb-4 align-items-center justify-content-between ">
                    <div className="col-lg-7 col-md-3 my-auto">
                      {/* <BaseSearch
                        className="col-lg-9 col-md-8 p-0 m-0"
                        placeholderInput="Search here..."
                        placeholderSelect="Search by"
                        options={searchSetting}
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
                                  <FilterSetting
                                    settings={settings}
                                    onFilter={onFilter}
                                    fetchData={fetchData}
                                    searchParams={searchParams}
                                    onReset={onReset}
                                    dataGroup={dataGroup}
                                    checkedStatus={checkedStatus}
                                    onChangeStatus={onChangeStatus}
                                    checkedSettingGroup={checkedSettingGroup}
                                    onChangeSettingGroup={onChangeSettingGroup}
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
                          options={searchSetting}
                          onSearch={onSearchAll}
                          checkedSearchInput={checkedSearchInput}
                          onResetSearchInput={onResetSearchInput}
                        />
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative d-flex align-items-center justify-content-end">
                      {/* <div
                          className=" align-items-center float-end "
                          style={{ marginRight: "10px" }}
                        > */}
                      {/* </div> */}
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
                      </div>
                      <NewSystemSetting
                        fetchData={fetchData}
                        searchParams={searchParams}
                        dataGroup={dataGroup}
                        settings={settings}
                      />
                    </div>
                  </div>
                </div>
                <Grid container className="m-0 flexGrow_1">
                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    className=" d-flex flex-column"
                  >
                    <SystemSettingTable
                      settings={settings}
                      dataGroup={dataGroup}
                      searchParams={searchParams}
                      onPageChange={onPageChange}
                      onPageSizeChange={onPageSizeChange}
                      fetchData={fetchData}
                      loadingTable={loadingTable}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Box>
          // </div>
        }
      />
    </>
  );
};

export default SystemSettingListPage;
