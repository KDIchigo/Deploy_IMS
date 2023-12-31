import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, FilterOperatorEnum, StatusEnum } from "src/enum/Enum";
import { Role } from "src/enum/Role";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import "./ClassListPage.scss";
import { ClassTable } from "./components/ClassTable/ClassTable";
import { FilterClass } from "./components/FilterClass/FilterClass";
import { NewClass } from "./components/NewClass/NewClass";
import { filterUtils, searchUtils } from "/src/utils/handleSearchFilter";
import { HandleAuth } from "src/utils/handleAuth";
import {
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
} from "src/utils/handleSearchFilter";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  backDataStateParam,
  decodeParam,
  encodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";
const searchClass = [
  {
    id: "class_code",
    value: "Class Code",
  },
  // {
  //   id: "class_name",
  //   value: "Class Name",
  // },
  // {
  //   id: "subject_code",
  //   value: "Subject Code",
  // },
  // {
  //   id: "subject_name",
  //   value: "Subject Name",
  // },
];
export const ClassListPage = () => {
  const location = useLocation();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  const [paramDecode, setParamDecode] = useState(param);

  const { currentUser, IsTeacher, IsManager } = HandleAuth();
  const [classes, setClasses] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });

  const [loadingSemesterApi, setLoadingSemesterApi] = useState(false);
  const [isCallSemesters, setIsCallSemesters] = useState(false);
  const [loadingSubjectApi, setLoadingSubjectApi] = useState(false);
  const [isCallSubjects, setIsCallSubjects] = useState(false);
  const [loadingTeacherApi, setLoadingTeacherApi] = useState(false);
  const [isCallTeachers, setIsCallTeachers] = useState(false);

  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [checkedSetting, setCheckedSetting] = useState();
  const [checkedStatus, setCheckedStatus] = useState();
  const [checkedSubject, setCheckedSubject] = useState();
  const [checkedTeacher, setCheckedTeacher] = useState();
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [spin, setSpin] = useState(false);
  let filterClassCondition = [];
  IsTeacher() &&
    (filterClassCondition = [
      {
        field: "teacher_id",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
      },
    ]);
  // IsManager() &&
  //   (filterClassCondition = [
  //     {
  //       field: "created_by",
  //       value: currentUser.email,
  //       condition: ConditionEnum.Equal,
  //       operator: FilterOperatorEnum.OR
  //     },
  //   ]);
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "",
  //   filterConditions: filterClassCondition,
  // });
  const [searchParams, setSearchParams] = useState(
    decodeParam(paramDecode) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: filterClassCondition,
        }
      : {
          pageNumber: decodeParam(paramDecode).pageNumber,
          pageSize: decodeParam(paramDecode).pageSize,
          sortString: decodeParam(paramDecode).sortString,
          filterConditions: decodeParam(paramDecode).filterConditions,
        }
  );

  const [semesterParams, setSemesterParams] = useState([
    {
      field: "data_group",
      value: "2",
      condition: ConditionEnum.Equal,
    },
    // {
    //   field: "status",
    //   value: StatusEnum.Active,
    //   condition: ConditionEnum.Equal,
    // },
  ]);

  const [teacherParams, setTeacherParams] = useState({
    field: "data_group",
    value: "2",
    condition: ConditionEnum.Equal,
  });

  const fetchData = async (searchParams) => {
    let newFilterConditions = searchParams.filterConditions;
    if (IsManager()) {
      // newSearchParams = { ...searchParams };
      const { data: subjectArr } = await axiosClient.post(
        "/Subject/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "assignee_id",
            value: currentUser.user_id,
            condition: ConditionEnum.Equal,
          },
        ]
      );

      if (subjectArr.length !== 0) {
        subjectArr.map((ele, index) => {
          if (index === 0) {
            if (subjectArr.length === 1) {
              newFilterConditions.push({
                field: "subject_id",
                value: ele.subject_id,
                condition: ConditionEnum.Equal,
              });
            } else {
              newFilterConditions.push({
                field: "subject_id",
                value: ele.subject_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
                parenthesis: FilterOperatorEnum.OpenParenthesis,
              });
            }
          }
          if (index !== 0) {
            if (index !== subjectArr.length - 1) {
              newFilterConditions.push({
                field: "subject_id",
                value: ele.subject_id,
                condition: ConditionEnum.Equal,
                operator: FilterOperatorEnum.OR,
              });
            } else {
              newFilterConditions.push({
                field: "subject_id",
                value: ele.subject_id,
                condition: ConditionEnum.Equal,
                parenthesis: FilterOperatorEnum.CloseParenthesis,
              });
            }
          }
        });
      }
    }
    const newSearchClassParams = {
      ...searchParams,
      filterConditions: newFilterConditions,
    };
    const { data: classList } = await axiosClient.post(
      "/Class/GetByPaging",
      newSearchClassParams
    );
    setClasses(classList);
    setLoading(false);
    setLoadingData(true);
    setLoadingTable(false);
  };

  if ([].length !== 0) {
    console.log([].filter((ele) => ele.project_id));
  } else {
    console.log("[]");
  }

  const fetchDataSelect = async () => {
    const { data: systemSettingArr } = await axiosClient.post(
      "/Setting/GetFilterData?sortString=display_order ASC",
      semesterParams
    );
    setSemesters(systemSettingArr);

    const { data: subjectArr } = await axiosClient.post(
      "/Subject/GetFilterData?sortString=created_date ASC",
      IsManager()
        ? [
            {
              field: "assignee_id",
              value: currentUser.user_id,
              condition: ConditionEnum.Equal,
            },
            // {
            //   field: "status",
            //   value: StatusEnum.Active,
            //   condition: ConditionEnum.Equal,
            // },
          ]
        : [
            // {
            //   field: "status",
            //   value: StatusEnum.Active,
            //   condition: ConditionEnum.Equal,
            // },
          ]
    );
    setSubjects(subjectArr);

    const { data: roleList } = await axiosClient.post(
      "/Setting/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "setting_value",
          value: "Teacher",
          condition: ConditionEnum.Equal,
        },
      ]
    );

    const { data: userArr } = await axiosClient.post(
      "/User/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "setting_id",
          value: roleList[0].setting_id,
          condition: ConditionEnum.Equal,
        },
        // {
        //   field: "status",
        //   value: StatusEnum.Active,
        //   condition: ConditionEnum.Equal,
        // },
      ]
    );
    setTeachers(userArr);
    genDataStateParam(paramDecode, setCheckedStatus, "status_started", []);
    genDataStateParam(
      paramDecode,
      setCheckedSearchInput,
      "search",
      [],
      searchClass
    );
    genDataStateParam(paramDecode, setCheckedSubject, "subject", subjectArr);
    genDataStateParam(
      paramDecode,
      setCheckedSetting,
      "semester",
      systemSettingArr
    );
    genDataStateParam(paramDecode, setCheckedTeacher, "teacher", userArr);
    // setSearchParamsURL({ param: encodeParam(searchParams) });
    setIsCallSemesters(true);
    setIsCallSubjects(true);
    setIsCallTeachers(true);
    setLoadingSelect(true);
  };

  const fetchSystemSetting = async () => {
    if (!isCallSemesters) {
      setLoadingSemesterApi(true);
      const { data: systemSettingArr } = await axiosClient.post(
        "/Setting/GetFilterData?sortString=display_order ASC",
        semesterParams
      );
      setSemesters(systemSettingArr);
      genDataStateParam(param, setCheckedSetting, "semester", systemSettingArr);
      setIsCallSemesters(true);
      setLoadingSemesterApi(false);
    }
    // console.log(systemSettingArr);
    // return systemSettingArr;
  };

  const fetchSubject = async () => {
    if (!isCallSubjects) {
      setLoadingSubjectApi(true);
      const { data: subjectArr } = await axiosClient.post(
        "/Subject/GetFilterData?sortString=created_date ASC",
        IsManager()
          ? [
              {
                field: "assignee_id",
                value: currentUser.user_id,
                condition: ConditionEnum.Equal,
              },
              // {
              //   field: "status",
              //   value: StatusEnum.Active,
              //   condition: ConditionEnum.Equal,
              // },
            ]
          : [
              // {
              //   field: "status",
              //   value: StatusEnum.Active,
              //   condition: ConditionEnum.Equal,
              // },
            ]
      );
      setSubjects(subjectArr);
      genDataStateParam(param, setCheckedSubject, "subject", subjectArr);
      setIsCallSubjects(true);
      setLoadingSubjectApi(false);
    }
  };
  const fetchTeacher = async () => {
    if (!isCallTeachers) {
      setLoadingTeacherApi(true);
      const { data: roleList } = await axiosClient.post(
        "/Setting/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "setting_value",
            value: "Teacher",
            condition: ConditionEnum.Equal,
          },
        ]
      );

      const { data: userArr } = await axiosClient.post(
        "/User/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "setting_id",
            value: roleList[0].setting_id,
            condition: ConditionEnum.Equal,
          },
          // {
          //   field: "status",
          //   value: StatusEnum.Active,
          //   condition: ConditionEnum.Equal,
          // },
        ]
      );
      setTeachers(userArr);
      genDataStateParam(paramDecode, setCheckedTeacher, "teacher", userArr);
      setIsCallTeachers(true);
      setLoadingTeacherApi(false);
    }
  };

  const fetchDataAndSelect = async () => {
    await Promise.all([
      fetchData(searchParams),
      fetchSystemSetting(),
      fetchSubject(),
      fetchTeacher(),
    ]);
    setLoadingSelect(true);
  };
  // console.log(decodeParam(param));

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
      classes,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
    // setLoadingTable(true);
    // let pageNumber = searchParams.pageNumber;
    // if (searchParams.pageNumber * pageSize > classes.totalRecord) {
    //   pageNumber = 1;
    // }
    // const newSearchParams = {
    //   ...searchParams,
    //   pageNumber: pageNumber,
    //   pageSize: pageSize,
    // };
    // setSearchParams(newSearchParams);
    // fetchData(newSearchParams);
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

  const onReset = () => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      filterConditions: IsTeacher()
        ? [
            {
              field: "teacher_id",
              value: currentUser.user_id,
              condition: 1,
            },
          ]
        : [],
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(undefined);
    setCheckedSetting(undefined);
    setCheckedStatus(undefined);
    setCheckedSubject(undefined);
    setCheckedTeacher(undefined);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  const onChangeSetting = (value) => {
    setCheckedSetting(value);
  };
  const onChangeSubject = (value) => {
    setCheckedSubject(value);
  };
  const onChangeStatus = (value) => {
    setCheckedStatus(value);
  };
  const onChangeTeacher = (value) => {
    setCheckedTeacher(value);
  };
  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
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
        searchClass,
        "",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedStatus,
        "status_started",
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
        setCheckedSetting,
        "semester",
        semesters,
        [],
        "semester_id",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedSubject,
        "subject",
        subjects,
        [],
        "subject_id",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedTeacher,
        "teacher",
        teachers,
        [],
        "teacher_id",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      // console.log(decodeParam(paramFromURL))
    } else {
      fetchDataSelect();
    }
  };

  useEffect(() => {
    // Xử lý sự thay đổi trong URL
    fetchBackData();
  }, [location.search, paramDecode]);
  useEffect(() => {
    // fetchDataAndSelect();
    fetchData(searchParams);
    // fetchDataSelect();
  }, []);

  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="class"
        spin={loadingData}
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    Class List
                  </h3>
                  <div className="row p-0 m-0 mb-2 align-items-center justify-content-between ">
                    <div className="col-lg-7 col-md-3 my-auto">
                      {/* <BaseSearch
                        className="col-lg-9 col-md-8 p-0 m-0"
                        placeholderInput="Search here..."
                        placeholderSelect="Search by"
                        options={searchClass}
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
                              <div className="card custom-card mb-0 ">
                                <div className="card-body filterCard">
                                  <FilterClass
                                    teachers={teachers}
                                    subjects={subjects}
                                    semesters={semesters}
                                    onFilter={onFilter}
                                    fetchData={fetchData}
                                    searchParams={searchParams}
                                    onReset={onReset}
                                    checkedStatus={checkedStatus}
                                    onChangeStatus={onChangeStatus}
                                    checkedSetting={checkedSetting}
                                    onChangeSetting={onChangeSetting}
                                    onChangeSubject={onChangeSubject}
                                    checkedSubject={checkedSubject}
                                    checkedTeacher={checkedTeacher}
                                    onChangeTeacher={onChangeTeacher}
                                    loadingSemesterApi={loadingSemesterApi}
                                    fetchSystemSetting={fetchSystemSetting}
                                    loadingSubjectApi={loadingSubjectApi}
                                    fetchSubject={fetchSubject}
                                    loadingTeacherApi={loadingTeacherApi}
                                    fetchTeacher={fetchTeacher}
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
                          options={searchClass}
                          onSearch={onSearchAll}
                          checkedSearchSelect={checkedSearchSelect}
                          onResetSearchSelect={onResetSearchSelect}
                          checkedSearchInput={checkedSearchInput}
                          onResetSearchInput={onResetSearchInput}
                        />
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative d-flex align-items-center justify-content-end">
                      <div className="col-lg-7 float-end me-1 d-flex h-100 justify-content-end">
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
                          <NewClass
                            semesters={semesters}
                            subjects={subjects}
                            teachers={teachers}
                            fetchData={fetchData}
                            searchParams={searchParams}
                            loadingSemesterApi={loadingSemesterApi}
                            fetchSystemSetting={fetchSystemSetting}
                            loadingSubjectApi={loadingSubjectApi}
                            fetchSubject={fetchSubject}
                            loadingTeacherApi={loadingTeacherApi}
                            fetchTeacher={fetchTeacher}
                          />
                        }
                        listRole={[Role.Manager, Role.Admin]}
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
                    className="d-flex flex-column"
                  >
                    <ClassTable
                      classes={classes}
                      semesters={semesters.data}
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
        }
      />
    </>
  );
};
