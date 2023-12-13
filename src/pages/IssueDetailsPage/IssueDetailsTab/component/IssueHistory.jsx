import React from "react";
import { IssueHistoryDataType } from "src/enum/Enum";

export const IssueHistory = ({ fetchData, issueHistory }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <>
      {issueHistory.map((historyItem) => {
        const newUsers = JSON.parse(historyItem.new_value);
        const oldUsers = JSON.parse(historyItem.old_value);
        console.log(newUsers);
        let actionText = "";
        {
          /* const actionText =
          historyItem.action === 2
            ? "updated"
            : historyItem.action === 1
            ? "added"
            : "changed"; */
        }
        console.log(newUsers, oldUsers);
        if (oldUsers === null) {
          actionText = "added";
        } else if (newUsers === null) {
          actionText = "deleted";
        } else {
          actionText = "updated";
        }

        let old_value = "";
        let new_value = "";
        switch (historyItem.data_group) {
          case IssueHistoryDataType.due_date:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.due_date);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.due_date);
            break;
          case IssueHistoryDataType.issue_type:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.issue_type);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.issue_type);
            break;
          case IssueHistoryDataType.issue_status:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.issue_status);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.issue_status);
            break;
          case IssueHistoryDataType.work_process:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.work_process);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.work_process);
            break;
          case IssueHistoryDataType.issue_title:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.issue_title);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.issue_title);
            break;
          case IssueHistoryDataType.description:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.description);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.description);
            break;
          case IssueHistoryDataType.milestone_id:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.milestone_name);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.milestone_name);
            break;
          case IssueHistoryDataType.assignee:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.assignee);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.assignee);
            break;
          case IssueHistoryDataType.estimate_time:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.estimate_time);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.estimate_time);
            break;
          case IssueHistoryDataType.actual_time:
            (actionText === "deleted" || actionText === "updated") &&
              (old_value = oldUsers.actual_time);
            (actionText === "added" || actionText === "updated") &&
              (new_value = newUsers.actual_time);
            break;
        }

        let value_change = "";
        switch (actionText) {
          case "added":
            value_change = `${old_value}`;
            break;
          case "updated":
            value_change = `from ${old_value} to ${new_value}`;
            break;
          case "deleted":
            value_change = `${new_value}`;
            break;
        }
        console.log(value_change)

        let dataGroupInfo = "";

        switch (historyItem.data_group) {
          case IssueHistoryDataType.due_date:
            dataGroupInfo = `due date ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.issue_type:
            dataGroupInfo = `issue type ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.issue_status:
            dataGroupInfo = `issue status ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.work_process:
            dataGroupInfo = `work process ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.issue_title:
            dataGroupInfo = `issue title ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.description:
            dataGroupInfo = `description ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.milestone_id:
            dataGroupInfo = `milestone name ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.assignee:
            dataGroupInfo = `assignee to ${
              newUsers.length > 0
                ? newUsers.map((newUser) => `${newUser.fullname}`).join(", ")
                : "Unknown User"
            } on ${formatDate(historyItem.changed_date)} `;
            break;
          case IssueHistoryDataType.estimate_time:
            dataGroupInfo = `Estimate Time ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          case IssueHistoryDataType.actual_time:
            dataGroupInfo = `Actual Time ${value_change} to ${formatDate(
              historyItem.changed_date
            )}`;
            break;
          default:
            dataGroupInfo = "unknown";
            break;
        }

        return (
          <li
            key={historyItem.issue_history_id}
            className="crm-recent-activity-content"
          >
            <div className="d-flex align-items-top">
              <div className="me-3">
                <span className="">
                  <i
                    className="bi bi-circle-fill fs-8 "
                    style={{ color: "#ec8550" }}
                  ></i>
                </span>
              </div>
              <div className="crm-timeline-content">
                <span className="fw-semibold">
                  <strong>{historyItem.changed_by}</strong>{" "}
                  {!IssueHistoryDataType.assignee ? "" : actionText}{" "}
                  {dataGroupInfo}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
};
