import { Dropdown, Spin, Tabs, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router";
import { IssueHistory } from "./component/IssueHistory";
import { IssueChild } from "./component/IssueChild";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import "./IssueDetaisTab.scss";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { NewSubIssue } from "./component/NewSubIssue/NewSubIssue";

export const IssueDetailsTab = ({
  issueHistory,
  fetchSubIssueData,
  fetchIssueHistoryData,
  loadingSubIssueData,
  loadingIssueHistoryData,
  loadingSubIssueAction,
  issueObj,
  subIssues,
  projectId,
  issueSettings,
  students,
  milestones,
  handleNewSubIssue,
  handleSubIssueDetails,
}) => {
  const navigate = useNavigate();
  // const [issueHistory, setIssueHistory] = useState({});
  const [modalIssue, setModalIssue] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const toggleIssue = () => setModalIssue(!modalIssue);

  // const fetchData = async () => {
  //   const { data: issueHistoryArr } = await axiosClient.post(
  //     "/IssueHistory/GetFilterData?sortString=data_group ASC",
  //     [
  //       {
  //         field: "issue_id",
  //         value: issueObj.issue_id,
  //         condition: 1,
  //       },
  //     ]
  //   );
  //   setIssueHistory(issueHistoryArr);
  //   // console.log(issueHistoryArr);
  //   setLoadingData(true);
  // };

  const items = [
    {
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={toggleIssue}>
          Add New Issue
        </a>
      ),
      key: "1",
      // icon: <UserOutlined />,
    },
    {
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          // onClick={handleAddnewStudentExist}
        >
          Add Existing Issue
        </a>
      ),
      key: "2",
      // icon: <UserOutlined />,
    },
  ];
  const menuProps = {
    items,
  };

  const onChange = (key) => {
    switch (key) {
      case "1":
        // navigate(`/class-details-general/${issueObj}`);
        break;
      case "2":
        // navigate(`/class-details-students/${issueObj}`);
        break;
    }
  };
  // useEffect(() => {
  //   fetchData();

  //   // console.log("a");
  // }, []);
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        onChange={onChange}
        type="card"
        className="flex_height tabScreen"
        items={[
          {
            label: "History",
            children: (
              <div
                className="flex_height"
                style={{ border: "1px solid #d9d9d9" }}
              >
                <div className="card custom-card mb-0 flex_height issueTab">
                  <div className="card-body flex_height">
                    {/* {loadingData ? ( */}
                    <IssueHistory
                      issueHistory={issueHistory}
                      fetchData={fetchIssueHistoryData}
                    />
                    {/* ) : (
                      ""
                    )} */}
                  </div>
                </div>
              </div>
            ),
            key: "1",
          },
          {
            label: "Links",
            children: (
              <div
                className="flex_height"
                style={{ border: "1px solid #d9d9d9" }}
              >
                <div className="card custom-card mb-0 flex_height issueTab">
                  <div className="card-body flex_height">
                    <Dropdown.Button
                      type="primary"
                      className="flexGrow_1 d-flex flex-row justify-content-end mb-3 addNewIssueChild"
                      menu={menuProps}
                      icon={<DownOutlined />}
                    >
                      Add New
                    </Dropdown.Button>
                    <NewSubIssue
                      modal={modalIssue}
                      setModalIssue={setModalIssue}
                      toggle={toggleIssue}
                      loadingSubIssueAction={loadingSubIssueAction}
                      fetchData={fetchSubIssueData}
                      projectId={projectId}
                      issueSettings={issueSettings}
                      students={students}
                      milestones={milestones}
                      issueObj={issueObj}
                      handleNewSubIssue={handleNewSubIssue}
                    />
                    {loadingSubIssueAction ? (
                      <IssueChild subIssues={subIssues} handleSubIssueDetails={handleSubIssueDetails}/>
                    ) : (
                      <Spin tip="Loading" size="large">
                        <IssueChild subIssues={subIssues} handleSubIssueDetails={handleSubIssueDetails}/>
                      </Spin>
                    )}
                  </div>
                </div>
              </div>
            ),
            key: "2",
          },
        ]}
      />
    </>
  );
};
