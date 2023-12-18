import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { Milestone } from "src/components/Milestone/Milestone";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ClassMilestones } from "./ClassMilestones/ClassMilestones";
import { ConditionEnum } from "src/enum/Enum";
import { useSearchParams } from "react-router-dom";
import {
  backDataStateParam,
  decodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";
const searchClassMilestones = [
  {
    id: "milestone_name",
    value: "Milestone Name",
  },
];
export const ClassDetailsMilestone = () => {
  const location = useLocation();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  const [paramDecode, setParamDecode] = useState(param);

  const { classId } = useParams();
  const navigate = useNavigate();
  const [classObj, setClassObj] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingMilestone, setLoadingMilestone] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  const [checkedSearchInput, setCheckedSearchInput] = useState(undefined);
  const [checkedFromDate, setCheckedFromDate] = useState(undefined);
  const [checkedToDate, setCheckedToDate] = useState(undefined);
  const [checkedStatus, setCheckedStatus] = useState(undefined);
  const [milestones, setMilestones] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [spin, setSpin] = useState(false);

  const classFilter = [
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
    },
    {
      field: "project_id",
      value: "",
      condition: ConditionEnum.IsNull,
    },
  ];

  const [searchParams, setSearchParams] = useState(
    decodeParam(paramDecode) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: classFilter,
        }
      : {
          pageNumber: decodeParam(paramDecode).pageNumber,
          pageSize: decodeParam(paramDecode).pageSize,
          sortString: decodeParam(paramDecode).sortString,
          filterConditions: decodeParam(paramDecode).filterConditions,
        }
  );
  const fetchData = async () => {
    const { data: classById } = await axiosClient.get(`/Class/${classId}`);
    setClassObj(classById);
    setLoadingData(true);
    const { data: milestoneArr } = await axiosClient.post(
      "/Milestone/GetClassMilestone?sortString=created_date ASC",
      searchParams
    );
    setMilestones(milestoneArr);
    genDataStateParam(
      param,
      setCheckedSearchInput,
      "search",
      [],
      searchClassMilestones
    );
    genDataStateParam(param, setCheckedFromDate, "from_date");
    genDataStateParam(param, setCheckedToDate, "to_date");
    genDataStateParam(param, setCheckedStatus, "status_inProgress");
    setLoadingMilestone(true);
  };
  // console.log(checkedFromDate)

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
        searchClassMilestones,
        "",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedStatus,
        "status_inProgress",
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
        setCheckedFromDate,
        "from_date",
        [],
        [],
        "from_date",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      backDataStateParam(
        paramDecode,
        paramFromURL,
        setCheckedToDate,
        "to_date",
        [],
        [],
        "to_date",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      // genDataStateParam(param, setCheckedToDate, "to_date");

      // console.log(decodeParam(paramFromURL))
    } else {
      // const { data: classById } = await axiosClient.get(`/Class/${classId}`);
      // setClassObj(classById);
      // setLoadingData(true);
      // const { data: milestoneArr } = await axiosClient.post(
      //   "/Milestone/GetClassMilestone?sortString=created_date ASC",
      //   searchParams
      // );
      // setMilestones(milestoneArr);
      genDataStateParam(
        paramDecode,
        setCheckedSearchInput,
        "search",
        [],
        searchClassMilestones
      );
      genDataStateParam(paramDecode, setCheckedFromDate, "from_date");
      genDataStateParam(paramDecode, setCheckedToDate, "to_date");
      genDataStateParam(paramDecode, setCheckedStatus, "status_inProgress");
      setLoadingMilestone(true);
    }
  };

  useEffect(() => {
    // Xử lý sự thay đổi trong URL
    fetchBackData();
  }, [location.search, paramDecode]);

  // console.log(decodeParam(param))
  useEffect(() => {
    fetchData();
    // console.log("a");
  }, []);
  return (
    <>
      <NavbarDashboard
        position="class"
        spin={loadingData && loadingMilestone}
        dashboardBody={
          <Tabs
            defaultActiveKey="3"
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
                        {/* <ClassStudents classId={classId} /> */}
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
                        {loadingData && loadingMilestone && (
                          <ClassMilestones
                            classId={classId}
                            classObj={classObj}
                            milestones={milestones}
                            setMilestones={setMilestones}
                            setSearchParamsURL={setSearchParamsURL}
                            searchClassMilestones={searchClassMilestones}
                            checkedSearchInput={checkedSearchInput}
                            setCheckedSearchInput={setCheckedSearchInput}
                            checkedSearchSelect={checkedSearchSelect}
                            setCheckedSearchSelect={setCheckedSearchSelect}
                            checkedFromDate={checkedFromDate}
                            setCheckedFromDate={setCheckedFromDate}
                            checkedToDate={checkedToDate}
                            setCheckedToDate={setCheckedToDate}
                            checkedStatus={checkedStatus}
                            setCheckedStatus={setCheckedStatus}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            fetchData={fetchData}
                          />
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
                      <div className="card-body flex_height">
                        {/* <ClassSettings classId={classId} /> */}
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
