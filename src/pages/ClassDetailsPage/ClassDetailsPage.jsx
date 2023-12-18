import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum } from "src/enum/Enum";
import { Milestone } from "src/components/Milestone/Milestone";
import { ClassGeneral } from "./ClassGeneral/ClassGeneral";
import { ClassSettings } from "./ClassSettings/ClassSettings";
import { ClassStudents } from "./ClassStudents/ClassStudents";
import { ClassMilestones } from "./ClassMilestones/ClassMilestones";
import { IssueSettings } from "src/components/IssueSetting/IssueSettings";
const onChange = (key) => {
  console.log(key);
};
export const ClassDetailsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classObj, setClassObj] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [spin, setSpin] = useState(false);

  const fetchData = async () => {
    const { data: classById } = await axiosClient.get(`/Class/${classId}`);
    setClassObj(classById);
    setLoadingData(true);
  };
  const fetchDataSelect = async () => {
    const { data: systemSettingArr } = await axiosClient.post(
      `/Setting/GetFilterData?sortString=display_order ASC`,
      [
        {
          field: "data_group",
          value: "2",
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setSemesters(systemSettingArr);

    const { data: subjectArr } = await axiosClient.post(
      "/Subject/GetFilterData?sortString=created_date ASC",
      []
    );
    setSubjects(subjectArr);
    const { data: assignmentArr } = await axiosClient.post(
      "/Assignment/GetFilterData?sortString=created_date ASC",
      []
    );
    setAssignments(assignmentArr);

    const { data: roleList } = await axiosClient.post(
      `/Setting/GetFilterData?sortString=created_date ASC`,
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
      ]
    );
    setTeachers(userArr);
    console.log(userArr);

    setLoadingData(true);
    setLoadingSelect(true);
  };
  useEffect(() => {
    fetchData();
    fetchDataSelect();
    // console.log("a");
  }, []);
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="class"
        spin={loadingData && loadingSelect}
        dashboardBody={
          <Tabs
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
                        {loadingData && loadingSelect ? (
                          <ClassGeneral
                            classObj={classObj}
                            semesters={semesters}
                            teachers={teachers}
                            subjects={subjects}
                            fetchData={fetchData}
                          />
                        ) : (
                          ""
                        )}
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
                        <ClassStudents classId={classId} />
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
                        {loadingData ? (
                          <ClassMilestones
                            classId={classId}
                            classObj={classObj}
                            assignments={assignments}
                          />
                        ) : (
                          ""
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
                        {loadingData ? (
                          // <ClassSettings
                          //   classId={classId}
                          //   classObj={classObj}
                          // />
                          <IssueSettings
                            id={classId}
                            option={classObj}
                            typeIssue="class"
                          />
                        ) : (
                          ""
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
