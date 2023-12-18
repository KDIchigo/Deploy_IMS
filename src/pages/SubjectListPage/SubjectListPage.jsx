import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import { Role } from "src/enum/Role";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import "./SubjectListPage.scss";
import { FilterSubject } from "./components/FilterSubject/FilterSubject";
import { NewSubject } from "./components/NewSubject/NewSubject";
import { SubjectTable } from "./components/SubjectTable/SubjectTable";
import { HandleAuth } from "src/utils/handleAuth";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  backDataStateParam,
  decodeParam,
  encodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";

const searchSubject = [
  {
    id: "subject_code",
    value: "Subject Code",
  },
  {
    id: "subject_name",
    value: "Subject Name",
  },
];
const filter = {
  field: "",
  value: "",
  condition: ConditionEnum.Equal,
};
export const SubjectListPage = () => {
  const location = useLocation();

  const { currentUser, IsManager } = HandleAuth();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  const [paramDecode, setParamDecode] = useState(param);

  const [subjects, setSubjects] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });

  const [users, setUsers] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelectData, setLoadingSelectData] = useState(false);
  const [loadingManagerApi, setLoadingManagerApi] = useState(false);
  const [isCallManagers, setIsCallManagers] = useState(false);
  const [checkedAssignee, setCheckedAssignee] = useState();
  const [checkedStatus, setCheckedStatus] = useState();
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  let filterSubjectCondition = IsManager()
    ? [
        {
          field: "assignee_id",
          value: currentUser.user_id,
          condition: 1,
        },
      ]
    : [];
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: pageNumberURL === null ? 1 : pageNumberURL,
  //   pageSize: pageSizeURL === null ? 10 : pageSizeURL,
  //   sortString: sortStringURL === null ? "created_date ASC" : sortStringURL,
  //   filterConditions: filterSubjectCondition,
  // });
  const [searchParams, setSearchParams] = useState(
    decodeParam(paramDecode) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: filterSubjectCondition,
        }
      : {
          pageNumber: decodeParam(paramDecode).pageNumber,
          pageSize: decodeParam(paramDecode).pageSize,
          sortString: decodeParam(paramDecode).sortString,
          filterConditions: decodeParam(paramDecode).filterConditions,
        }
  );
  const fetchData = async (searchParams) => {
    const { data: subjectList } = await axiosClient.post(
      "/Subject/GetByPaging",
      searchParams
    );
    setSubjects(subjectList);
    // console.log(subjectList);

    setLoading(false);
    setLoadingData(true);
    setLoadingTable(false);
  };
  const fetchSelectData = async (param) => {
    if (!isCallManagers) {
      setLoadingManagerApi(true);
      const { data: roleArr } = await axiosClient.post(
        "/Setting/GetFilterData?sortString=display_order ASC",
        [
          {
            field: "setting_value",
            value: "Manager",
            condition: ConditionEnum.Equal,
          },
        ]
      );

      const { data: userArr } = await axiosClient.post(
        "/User/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "setting_id",
            value: roleArr[0].setting_id,
            condition: ConditionEnum.Equal,
          },
          // {
          //   field: "status",
          //   value: StatusEnum.Active,
          //   condition: ConditionEnum.Equal,
          // },
        ]
      );
      setUsers(userArr);
      // console.log(userArr);
      genDataStateParam(
        param,
        setCheckedSearchInput,
        "search",
        [],
        searchSubject
      );
      genDataStateParam(param, setCheckedStatus, "status");
      genDataStateParam(param, setCheckedAssignee, "assignee", userArr);
      setIsCallManagers(true);
      setLoadingManagerApi(false);
      // setLoadingSelectData(true);
    }
  };

  const fetchDataAndSelect = async () => {
    await Promise.all([fetchData(searchParams), fetchSelectData(param)]);
    setLoadingSelectData(true);
  };
  // console.log(users);
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
      subjects,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };
  const handleSaveFilter = () => {
    setLoadingTable(true);
    saveFilter(searchParams, setSearchParams, fetchData, setSearchParamsURL);
  };
  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
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
  const onSearch = (filter) => {
    setLoadingTable(true);
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const onReset = () => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      filterConditions: IsManager()
        ? [
            {
              field: "assignee_id",
              value: currentUser.user_id,
              condition: 1,
            },
          ]
        : [],
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setCheckedAssignee(null);
    setCheckedStatus(null);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const onChangeAssignee = (value) => {
    setCheckedAssignee(value);
  };
  const onChangeStatus = (value) => {
    setCheckedStatus(value);
  };

  const fetchBackData = async () => {
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
        searchSubject,
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
        setCheckedAssignee,
        "assignee",
        users,
        [],
        "assignee_id",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      // console.log(decodeParam(paramFromURL))
    } else {
      fetchSelectData(paramDecode);
    }
  };

  useEffect(() => {
    // Xử lý sự thay đổi trong URL
    fetchBackData();
  }, [location.search, paramDecode]);

  useEffect(() => {
    // fetchDataAndSelect();
    fetchData(searchParams);
  }, []);

  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="subject"
        spin={loadingData}
        dashboardBody={
          // <div className="col-xl-12">
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="  card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    Subject List
                  </h3>
                  <div className="row p-0 m-0 mb-4 align-items-center justify-content-between ">
                    <div className="col-lg-7 col-md-3 my-auto">
                      {/* <BaseSearch
                        className="col-lg-9 col-md-8 p-0 m-0"
                        placeholderInput="Search here..."
                        placeholderSelect="Search by"
                        options={searchSubject}
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
                                  <FilterSubject
                                    // subjects={subjects.data}
                                    users={users}
                                    onFilter={onFilter}
                                    fetchData={fetchData}
                                    searchParams={searchParams}
                                    onReset={onReset}
                                    checkedAssignee={checkedAssignee}
                                    checkedStatus={checkedStatus}
                                    onChangeAssignee={onChangeAssignee}
                                    onChangeStatus={onChangeStatus}
                                    handleSaveFilter={handleSaveFilter}
                                    fetchSelectData={fetchSelectData}
                                    loadingManagerApi={loadingManagerApi}
                                    param={param}
                                  />
                                </div>
                              </div>
                            </div>
                          }
                        />
                        <BaseSearchAll
                          className="col-lg-7 p-0 m-0"
                          placeholderInput="Search here..."
                          options={searchSubject}
                          onSearch={onSearchAll}
                          checkedSearchSelect={checkedSearchSelect}
                          onResetSearchSelect={onResetSearchSelect}
                          checkedSearchInput={checkedSearchInput}
                          onResetSearchInput={onResetSearchInput}
                        />
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative  d-flex align-items-center justify-content-end">
                      {/* <div
                          className=" align-items-center float-end "
                          style={{ marginRight: "10px" }}
                        > */}
                      <div className="col-lg-7 float-end d-flex h-100 justify-content-end">
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
                      </div>
                      <AuthoComponentRoutes
                        element={
                          <NewSubject
                            users={users}
                            fetchData={fetchData}
                            searchParams={searchParams}
                            fetchSelectData={fetchSelectData}
                            loadingManagerApi={loadingManagerApi}
                            param={param}
                          />
                        }
                        listRole={[Role.Admin]}
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
                    <SubjectTable
                      users={users}
                      subjects={subjects}
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
