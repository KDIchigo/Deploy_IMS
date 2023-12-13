import React from "react";
import { useNavigate } from "react-router";
import { BaseIssueSettingCard } from "src/components/Base/BaseIssueSettingCard/BaseIssueSettingCard";
import { IssueAssigneesGroup } from "src/pages/IssueListPage/IssueAssigneesGroup/IssueAssigneesGroup";
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
export const IssueChild = ({ subIssues, handleSubIssueDetails }) => {
  const navigate = useNavigate();
  return (
    <>
      {subIssues.length !== 0 &&
        subIssues.map((ele) => (
          <div key={ele.issue_id} className="issue-type__item">
            <div className="d-flex flex-row">
              <div className="flexGrow_1">
                <p className="m-0">
                  <a
                    className="issue__value"
                    onClick={() =>
                      handleSubIssueDetails(ele)
                    }
                  >
                    <strong>{ele.issue_title}</strong>
                  </a>
                </p>
                <p className="m-0">
                  {" "}
                  {ele.created_by}-{handleToDDMMYYYY(ele.due_date)}
                </p>
                <p className="m-0"></p>
                <div className="d-flex">
                  {ele.issue_type !== null && (
                    <BaseIssueSettingCard
                      issueGroup="Type"
                      issueValue={ele.issue_type_value}
                      issueColor={JSON.parse(ele.issue_type_style).color}
                      issueTextColor={
                        JSON.parse(ele.issue_type_style).text_color
                      }
                    />
                  )}
                  {ele.work_process !== null && (
                    <BaseIssueSettingCard
                      issueGroup="Status"
                      issueValue={ele.issue_status_value}
                      issueColor={JSON.parse(ele.issue_status_style).color}
                      issueTextColor={
                        JSON.parse(ele.issue_status_style).text_color
                      }
                    />
                  )}
                  {ele.issue_status !== null && (
                    <BaseIssueSettingCard
                      issueGroup="Process"
                      issueValue={ele.work_process_value}
                      issueColor={JSON.parse(ele.work_process_style).color}
                      issueTextColor={
                        JSON.parse(ele.work_process_style).text_color
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex-end">
                <IssueAssigneesGroup assignee={ele.assignee} />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
