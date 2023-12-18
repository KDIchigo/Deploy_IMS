import { Tabs, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ClassStudents } from "./ClassStudents/ClassStudents";
import { axiosClient } from "src/axios/AxiosClient";
import { ToastContainer } from "react-toastify";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import {
  filterUtils,
  handlePageSizeChange,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import {
  backDataStateParam,
  decodeParam,
  encodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";
const searchClassStudent = [
  {
    id: "student_name",
    value: "Student Name",
  },
  {
    id: "student_email",
    value: "Email",
  },
  {
    id: "student_phone",
    value: "Phone",
  },
];
export const ClassDetailsStudents = () => {
  const location = useLocation();

  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  const [paramDecode, setParamDecode] = useState(param);

  const { classId } = useParams();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [settingStudent, setSettingStudent] = useState(false);
  const [students, setStudents] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [classObj, setClassObj] = useState({});
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);

  const [loadingOther, setLoadingOther] = useState(false);
  const [loadingOtherTable, setLoadingOtherTable] = useState(false);
  const [loadingOtherData, setLoadingOtherData] = useState(false);
  const [checkedSearchSelectOther, setCheckedSearchSelectOther] =
    useState(undefined);
  const [checkedSearchInputOther, setCheckedSearchInputOther] = useState(null);
  const [existStudents, setExistStudents] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [studentsParams, setStudentsParams] = useState({
    pageNumber: 1,
    pageSize: 8,
    sortString: "",
    filterConditions: [
      {
        field: "class_id",
        value: classId,
        condition: ConditionEnum.NotIn,
      },
      {
        field: "status",
        value: StatusEnum.Active,
        condition: ConditionEnum.Equal,
      },
      {
        field: "setting_id",
        value: settingStudent.setting_id,
        condition: ConditionEnum.Equal,
      },
    ],
  });
  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const filterStudentCondition = [
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
    },
  ];

  const [searchParams, setSearchParams] = useState(
    decodeParam(paramDecode) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: filterStudentCondition,
        }
      : {
          pageNumber: decodeParam(paramDecode).pageNumber,
          pageSize: decodeParam(paramDecode).pageSize,
          sortString: decodeParam(paramDecode).sortString,
          filterConditions: decodeParam(paramDecode).filterConditions,
        }
  );
  const fetchData = async (searchParams) => {
    const { data: studentArr } = await axiosClient.post(
      "/ClassStudent/GetByPaging",
      searchParams
    );
    setStudents(studentArr);
    // console.log(studentArr.data);
    setLoading(false);
    setLoadingData(true);
    setLoadingTable(false);
  };

  const fetchStudentData = async (param) => {
    const { data: classById } = await axiosClient.get(`/Class/${classId}`);
    setClassObj(classById);
    const { data: studentArr } = await axiosClient.post(
      "/Setting/GetFilterData?sortString=display_order ASC",
      [
        {
          field: "setting_value",
          value: "Student",
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setSettingStudent(studentArr[0]);

    const newStudentsParams = {
      ...studentsParams,
      filterConditions: [
        {
          field: "class_id",
          value: classId,
          condition: ConditionEnum.NotIn,
        },
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
        {
          field: "setting_id",
          value: studentArr[0].setting_id,
          condition: ConditionEnum.Equal,
        },
      ],
    };
    const { data: studentsArr } = await axiosClient.post(
      "/ClassStudent/GetStudents",
      newStudentsParams
    );
    setExistStudents(studentsArr);
    setStudentsParams(newStudentsParams)
    // for (let student of studentArr.data) {
    //   const { data: studentArray } = await axiosClient.get(
    //     `/User/${student.student_id}`
    //   );
    //   setUsers(users.push(studentArray));
    // }
    // console.log(students, studentArr);
    setLoadingOtherData(true);
    setLoadingOtherTable(false);
    setLoadingOther(false);

    genDataStateParam(
      param,
      setCheckedSearchInput,
      "search",
      [],
      searchClassStudent
    );
    // console.log(studentArr.data);
    setLoadingData(true);
  };
  // console.log(decodeParam(param))
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
    setLoading(true);
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
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
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
      students,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };
  const onChange = (key) => {
    switch (key) {
      case "1":
        navigate(`/class-details-general/${classId}`);
        break;
      case "2":
        navigate(`/class-details-students/${classId}`);
        break;
      case "3":
        navigate(`/class-details-milestones/${classId}`);
        break;
      case "4":
        navigate(`/class-details-settings/${classId}`);
        break;
    }
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
        searchClassStudent,
        "",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      // console.log(decodeParam(paramFromURL));
    } else {
      fetchStudentData(paramDecode);
    }
  };
  useEffect(() => {
    // Xử lý sự thay đổi trong URL
    fetchBackData();
  }, [location.search, paramDecode]);

  useEffect(() => {
    fetchData(searchParams);
    fetchStudentData(param);
  }, []);
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="class"
        spin={loadingData}
        dashboardBody={
          <Tabs
            defaultActiveKey="2"
            onChange={onChange}
            type="card"
            className="flex_height tabScreen"
            items={[
              {
                label: "Generals",
                children: (
                  <div className="flex_height">
                    <div className="card custom-card mb-0 flex_height">
                      <div className="card-body flex_height">
                        {/* {loadingData && loadingSelect ? (
                        <ClassGeneral
                          classObj={classObj}
                          semesters={semesters}
                          teachers={teachers}
                          subjects={subjects}
                          fetchData={fetchData}
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
                label: "Students",
                children: (
                  <div className="flex_height">
                    <div className="card custom-card mb-0 flex_height">
                      <div className="card-body flex_height">
                        <ClassStudents
                          classId={classId}
                          classObj={classObj}
                          fetchData={fetchData}
                          students={students}
                          searchParams={searchParams}
                          onSearch={onSearch}
                          onSearchAll={onSearchAll}
                          onFilter={onFilter}
                          onPageChange={onPageChange}
                          onPageSizeChange={onPageSizeChange}
                          settingStudent={settingStudent}
                          loadingTable={loadingTable}
                          loading={loading}
                          onReset={onReset}
                          searchClassStudent={searchClassStudent}
                          checkedSearchInput={checkedSearchInput}
                          setCheckedSearchInput={setCheckedSearchInput}
                          setCheckedSearchSelect={setCheckedSearchSelect}
                          checkedSearchSelect={checkedSearchSelect}
                          setSearchParamsURL={setSearchParamsURL}
                          existStudents={existStudents}
                          setExistStudents={setExistStudents}
                          studentsParams={studentsParams}
                          setStudentsParams={setStudentsParams}
                          loadingOther={loadingOther}
                          loadingOtherData={loadingOtherData}
                          loadingOtherTable={loadingOtherTable}
                          setLoadingOther={setLoadingOther}
                          setLoadingOtherData={setLoadingOtherData}
                          setLoadingOtherTable={setLoadingOtherTable}
                          checkedSearchInputOther={checkedSearchInputOther}
                          setCheckedSearchInputOther={setCheckedSearchInputOther}
                          checkedSearchSelectOther={checkedSearchSelectOther}
                          setCheckedSearchSelectOther={setCheckedSearchSelectOther}
                        />
                      </div>
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
                        {/* {loadingData ? (
                        <Milestone
                          id={classId}
                          classObj={classObj}
                          typeMilestone="class"
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
                        {/* {loadingData ? <ClassSettings classId={classId} /> : ""} */}
                      </div>
                    </div>
                  </div>
                ),
                key: "4",
              },
            ]}
          />
        }
      />
    </>
  );
};
