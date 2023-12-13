import { Tabs, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import { SubjectGeneral } from "./SubjectGeneral/SubjectGeneral";
import { Box } from "@mui/material";

export const SubjectDetailsGeneral = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [subjectObj, setSubjectObj] = useState({});
  const fetchData = async () => {
    const { data: subjectById } = await axiosClient.get(
      `/Subject/${subjectId}`
    );
    setSubjectObj(subjectById);
    setLoadingData(true);
  };
  const fetchDataSelect = async () => {
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
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setUsers(userArr);
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
    fetchDataSelect();
  }, []);
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />

      <NavbarDashboard
        position="subject"
        spin={loadingData && loadingSelect}
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
                        {loadingData && loadingSelect ? (
                          <SubjectGeneral
                            users={users}
                            subjectObj={subjectObj}
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
                label: "Assignment",
                children: (
                  <div className="flex_height">
                    <div className="card custom-card mb-0 flex_height">
                      <div className="card-body flex_height">
                        {/* <SubjectAssignment subjectId={subjectId} /> */}
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
