import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import { ClassGeneral } from "./ClassGeneral/ClassGeneral";

export const ClassDetailsGeneral = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classObj, setClassObj] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
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
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setTeachers(userArr);
    setLoadingData(true);
    setLoadingSelect(true);
  };

  const fetchSystemSetting = async () => {
    const { data: systemSettingArr } = await axiosClient.post(
      `/Setting/GetFilterData?sortString=display_order ASC`,
      [
        {
          field: "data_group",
          value: "2",
          condition: ConditionEnum.Equal,
        },
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setSemesters(systemSettingArr);
  };
  const fetchSubject = async () => {
    const { data: subjectArr } = await axiosClient.post(
      "/Subject/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setSubjects(subjectArr);
  };
  const fetchTeacher = async () => {
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
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setTeachers(userArr);
  };
  const fetchDataAndSelect = async () => {
    await Promise.all([
      fetchData(),
      fetchSystemSetting(),
      fetchSubject(),
      fetchTeacher(),
    ]);
    setLoadingData(true);
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
  useEffect(() => {
    fetchDataAndSelect();
  }, []);
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />

      <NavbarDashboard
        position="class"
        spin={loadingData}
        dashboardBody={
          <Tabs
            defaultActiveKey="1"
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
                        {loadingData ? (
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
