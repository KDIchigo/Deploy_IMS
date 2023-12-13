import { useNavigate, useParams } from "react-router";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import "./SubjectDetailsAssignment.scss";
import { SubjectAssignment } from "./SubjectAssignment/SubjectAssignment";
import { ToastContainer } from "react-toastify";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum } from "src/enum/Enum";
import { useSearchParams } from "react-router-dom";
// import qs from "qs";
import { decodeParam, genDataStateParam } from "src/utils/handleEnDecode";
const searchAssignment = [
  {
    id: "assignment_name",
    value: "Assignment Name",
  },
];
export const SubjectDetailsAssignment = () => {
  const { subjectId } = useParams();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  // const filterConditions =
  //   filterConditionsJson
  //     ? JSON.parse(filterConditionsJson)
  //     : [
  //         {
  //           field: "subject_id",
  //           value: subjectId,
  //           condition: ConditionEnum.Equal,
  //         },
  //       ];
  const filterSubjectAssignment = [
    {
      field: "subject_id",
      value: subjectId,
      condition: ConditionEnum.Equal,
    },
  ];
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState();
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [subjectObj, setSubjectObj] = useState({});
  const [assignments, setAssignments] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [searchParams, setSearchParams] = useState(
    decodeParam(param) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: filterSubjectAssignment,
        }
      : {
          pageNumber: decodeParam(param).pageNumber,
          pageSize: decodeParam(param).pageSize,
          sortString: decodeParam(param).sortString,
          filterConditions: decodeParam(param).filterConditions,
        }
  );

  const fetchData = async () => {
    const { data: subjectById } = await axiosClient.get(
      `/Subject/${subjectId}`
    );
    setSubjectObj(subjectById);
    genDataStateParam(
      param,
      setCheckedSearchInput,
      "search",
      [],
      searchAssignment
    );
    genDataStateParam(param, setCheckedStatus, "status");
    setLoadingData(true);
  };
  const fetchDataSelect = async (searchParams) => {
    const { data: assignmentArr } = await axiosClient.post(
      "Assignment/GetByPaging",
      searchParams
    );
    setAssignments(assignmentArr);
    setLoadingData(true);
    setLoadingSelect(true);
  };
  const onChange = (key) => {
    switch (key) {
      case "1":
        navigate(`/subject-details-general/${subjectId}`);
        break;
      case "2":
        navigate(`/subject-details-assignment/${subjectId}`);
        break;
      case "3":
        navigate(`/subject-details-setting/${subjectId}`);
        break;
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataSelect(searchParams);
  }, []);
  return (
    <>
      {/* {console.log(subjectObj)} */}
      <ToastContainer autoClose="2000" theme="colored" />

      <NavbarDashboard
        position="subject"
        spin={loadingData && loadingSelect}
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
                          <SubjectGeneral
                            users={users}
                            subjectObj={subjectObj}
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
                label: "Assignment",
                children: (
                  <div className="flex_height">
                    <div className="card custom-card mb-0 flex_height">
                      <div className="card-body flex_height">
                        {loadingData && loadingSelect ? (
                          <SubjectAssignment
                            subjectObj={subjectObj}
                            subjectId={subjectId}
                            searchAssignment={searchAssignment}
                            checkedStatus={checkedStatus}
                            setCheckedStatus={setCheckedStatus}
                            checkedSearchInput={checkedSearchInput}
                            setCheckedSearchInput={setCheckedSearchInput}
                            assignments={assignments}
                            setAssignments={setAssignments}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            setSearchParamsURL={setSearchParamsURL}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                ),
                key: "2",
              },
              // {
              //   label: "Settings",
              //   children: (
              //     <div className="flex_height">
              //       <div className="card custom-card mb-0 flex_height">
              //         <div className="card-body flex_height">
              //           {/* <SubjectSetting subjectId={subjectId} /> */}
              //         </div>
              //       </div>
              //     </div>
              //   ),
              //   key: "3",
              // },
            ]}
          />
        }
      />
    </>
  );
};
