import { Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum } from "src/enum/Enum";
import { ClassGeneral } from "./ClassGeneral/ClassGeneral";
export const Demo = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classObj, setClassObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [spin, setSpin] = useState(false);
  const fetchData = async () => {
    const { data: classById } = await axiosClient.get(`/Class/${classId}`);
    setClassObj(classById);
    setLoading(true);
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
      ]
    );
    setTeachers(userArr);
    console.log(userArr);

    setLoading(true);
  };
  useEffect(() => {
    fetchData();
    fetchDataSelect();
    console.log("a");
    setSpin(true);
  }, []);
  const initialItems = [
    {
      label: "Generals",
      children: (
        <div className="flex_height">
          <div className="card custom-card mb-0 flex_height">
            <div className="card-body flex_height">
              {spin ? (
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
      closable: false,
    },
    {
      label: "Q&A",
      children: (
        <div className="flex_height">
          <div className="card custom-card mb-0 flex_height">
            <div className="card-body">2</div>
          </div>
        </div>
      ),
      key: "2",
      closable: false,
    },
    {
      label: "Tasks",
      children: (
        <div className="flex_height">
          <div className="card custom-card mb-0 flex_height">
            <div className="card-body flex_height">3</div>
          </div>
        </div>
      ),
      key: "3",
      closable: false,
    },
    {
      label: "Defects",
      children: (
        <div className="flex_height">
          <div className="card custom-card mb-0 flex_height">
            <div className="card-body flex_height">4</div>
          </div>
        </div>
      ),
      key: "4",
      closable: false,
    },
    {
      label: "Issue",
      children: (
        <div className="flex_height">
          <div className="card custom-card mb-0 flex_height">
            <div className="card-body flex_height">5</div>
          </div>
        </div>
      ),
      key: "5",
      closable: false,
    },
  ];

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);
  const onChange = (newActiveKey) => {
    setActiveKey(newActiveKey);
  };
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />

      <NavbarDashboard
        position="class"
        spin={spin}
        dashboardBody={
          <Tabs
            type="card"
            className="flex_height tabScreen"
            onChange={onChange}
            activeKey={activeKey}
            items={items}
          />
        }
      />
    </>
  );
};
