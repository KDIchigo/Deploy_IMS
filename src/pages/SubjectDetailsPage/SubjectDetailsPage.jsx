import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import { SubjectAssignment } from "./SubjectAssignment/SubjectAssignment";
import { SubjectGeneral } from "./SubjectGeneral/SubjectGeneral";
import { SubjectSetting } from "./SubjectSetting/SubjectSetting";
import { IssueSettings } from "src/components/IssueSetting/IssueSettings";
const onChange = (key) => {
  console.log(key);
};
export const SubjectDetailsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [subjectObj, setSubjectObj] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [spin, setSpin] = useState(false);
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
                        <SubjectAssignment
                          subjectObj={subjectObj}
                          subjectId={subjectId}
                        />
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
              //           {/* {loadingData && loadingSelect ? (
              //             <IssueSettings
              //               id={subjectId}
              //               option={subjectObj}
              //               typeIssue="subject"
              //             />
              //           ) : (
              //             // <SubjectSetting
              //             //   subjectId={subjectId}
              //             //   subjectObj={subjectObj}
              //             // />
              //             ""
              //           )} */}
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
