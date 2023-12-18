import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { IssueSettings } from "src/components/IssueSetting/IssueSettings";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";

export const SubjectDetailsSetting = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
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
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        position="subject"
        spin={loadingData && loadingSelect}
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
              //           {loadingData && loadingSelect ? (
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
              //           )}
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
