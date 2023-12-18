import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { IssueSettings } from "src/components/IssueSetting/IssueSettings";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { IssueSettingEnum } from "src/enum/Enum";
import {
  backDataStateParam,
  decodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";
import { HandleIssueSettings } from "src/utils/handleIssueSettings";
const searchIssueSetting = [
  {
    id: "issue_value",
    value: "Setting Value",
  },
];

const issue_group = [
  {
    value: IssueSettingEnum.IssueType,
    label: "Issue Type",
  },
  {
    value: IssueSettingEnum.IssueStatus,
    label: "Issue Status",
  },
  {
    value: IssueSettingEnum.WorkProcess,
    label: "Work Process",
  }
];
export const ClassDetailsSettings = () => {
  const location = useLocation();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  const [paramDecode, setParamDecode] = useState(param);

  const { classId } = useParams();
  const navigate = useNavigate();
  const [classObj, setClassObj] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(undefined);
  const [checkedSetting, setCheckedSetting] = useState(undefined);
  const [checkedStatus, setCheckedStatus] = useState(undefined);
  const [issueSettings, setIssueSettings] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const {
    // handleSubjectIssueSetting,
    handleClassIssueSetting,
  } = HandleIssueSettings();
  // if (typeIssue === "subject") {
  //   filterConditions = handleSubjectIssueSetting(id);
  // }

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
  const fetchData = async (param) => {
    const { data: classById } = await axiosClient.get(`/Class/${classId}`);
    setClassObj(classById);

    let filterConditions = handleClassIssueSetting(classId, classById);
    // console.log(filterConditions)
    let newSearchParams = {
      ...searchParams,
      filterConditions: filterConditions.filterConditions,
    };
    const { data: issueSettingArr } = await axiosClient.post(
      "/IssueSetting/GetByPaging",
      newSearchParams
    );

    setSearchParams(newSearchParams);
    setIssueSettings(issueSettingArr);
    genDataStateParam(
      param,
      setCheckedSearchInput,
      "search",
      [],
      searchIssueSetting
    );
    genDataStateParam(param, setCheckedStatus, "status");
    genDataStateParam(param, setCheckedSetting, "issue_setting", issue_group);
    setLoadingData(true);
  };
  // console.log(decodeParam(param))

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
        searchIssueSetting,
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
        setCheckedSetting,
        "issue_setting",
        [],
        [],
        "issue_group",
        setParamDecode,
        setSearchParams,
        fetchData
      );
      // genDataStateParam(param, setCheckedToDate, "to_date");

      // console.log(decodeParam(paramFromURL))
    } else {
      genDataStateParam(
        paramDecode,
        setCheckedSearchInput,
        "search",
        [],
        searchIssueSetting
      );
      genDataStateParam(paramDecode, setCheckedStatus, "status");
      genDataStateParam(
        paramDecode,
        setCheckedSetting,
        "issue_setting",
        issue_group
      );
    }
  };

  // useEffect(() => {
  //   // Xử lý sự thay đổi trong URL
  //   fetchBackData();
  // }, [location.search, paramDecode]);

  useEffect(() => {
    fetchData(param);
  }, []);
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="class"
        spin={loadingData}
        dashboardBody={
          <Tabs
            defaultActiveKey="4"
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
                        {loadingData && (
                          // <ClassSettings
                          //   classId={classId}
                          //   classObj={classObj}
                          // />
                          <IssueSettings
                            id={classId}
                            option={classObj}
                            typeIssue="class"
                            issueSettings={issueSettings}
                            setIssueSettings={setIssueSettings}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            checkedSearchSelect={checkedSearchSelect}
                            setCheckedSearchSelect={setCheckedSearchSelect}
                            checkedSearchInput={checkedSearchInput}
                            setCheckedSearchInput={setCheckedSearchInput}
                            checkedSetting={checkedSetting}
                            setCheckedSetting={setCheckedSetting}
                            checkedStatus={checkedStatus}
                            setCheckedStatus={setCheckedStatus}
                            searchIssueSetting={searchIssueSetting}
                            setSearchParamsURL={setSearchParamsURL}
                          />
                        )}
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
