import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IssueTypeTable } from "../IssueTypeTable/IssueTypeTable";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum } from "src/enum/Enum";
import "./IssueTypeItem.scss";
import { BaseIssueSettingCard } from "src/components/Base/BaseIssueSettingCard/BaseIssueSettingCard";
import { useNavigate } from "react-router";
const CheckboxGroup = Checkbox.Group;
import { Checkbox } from "antd";
import { IssueAssigneesGroup } from "../IssueAssigneesGroup/IssueAssigneesGroup";
function handleToDDMMYYYY(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: Months are zero-based
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

  return formattedDate;
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

export const IssueTypeItem = ({
  onPageChange,
  onSelectChange,
  issue,
  searchParams,
  fetchData,
  order,
  projectId,
  openBatchUpdate,
  selectedRowKeys,
}) => {
  const navigate = useNavigate();
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [spin, setSpin] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [issues, setIssues] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  // const onSelectChange = (newSelectedRowKeys) => {
  //   console.log("selectedRowKeys changed: ", newSelectedRowKeys);
  //   setSelectedRowKeys(...selectedRowKeys, newSelectedRowKeys);
  // };

  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "",
  //   filterConditions: [
  //     {
  //       field: "issue_type",
  //       value: issueType.issue_setting_id,
  //       condition: ConditionEnum.Equal,
  //     },
  //   ],
  // });
  const fetchAssigneeData = async () => {};

  useEffect(() => {
    // fetchData(searchParams);
  }, []);

  return (
    <>
      {/* {console.log(JSON.parse(issue.issue_type_style).color)} */}
      <div className="issue-type__item">
        <div className="d-flex flex-row">
          {openBatchUpdate ? (
            <div className="me-2">
              <Checkbox.Group>
                <Checkbox
                  key={issue.issue_id}
                  value={JSON.stringify(issue)}
                  onChange={onSelectChange}
                  checked={selectedRowKeys.includes(issue.issue_id)}
                />
              </Checkbox.Group>
            </div>
          ) : (
            ""
          )}
          <div className="flexGrow_1">
            <p className="m-0">
              <a
                className="issue__value"
                onClick={() =>
                  navigate(`/issue-details/${issue.issue_id}/${projectId}`)
                }
              >
                <strong>{issue.issue_title}</strong>
              </a>
            </p>
            <p className="m-0">
              {" "}
              #{order}-{issue.created_by}-{handleToDDMMYYYY(issue.due_date)}
            </p>
            {/* <p className="m-0">
              {issue.work_process_value}-{issue.issue_status_value}
            </p> */}
            <div className="d-flex">
                <BaseIssueSettingCard
                  issueGroup="Type"
                  issueValue={issue.issue_type_value}
                  issueValueObj={issue.issue_type_style}
                />
                <BaseIssueSettingCard
                  issueGroup="Status"
                  issueValue={issue.issue_status_value}
                  issueValueObj={issue.issue_status_style}
                />
                <BaseIssueSettingCard
                  issueGroup="Process"
                  issueValue={issue.work_process_value}
                  issueValueObj={issue.work_process_style}
                />
            </div>
          </div>
          <div className="flex-end">
            <IssueAssigneesGroup issue={issue} />
          </div>
        </div>
      </div>
    </>
  );
};
