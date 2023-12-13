import React from "react";
import { BaseBadge } from "../BaseBadge/BaseBadge";
import "./BaseIssueSettingCard.scss";

export const BaseIssueSettingCard = ({
  issueGroup,
  issueValue,
  issueValueObj,
}) => {
  if(issueValueObj === undefined || issueValueObj === null) {
    return null;
  }
  let issueGroupColor = `${issueValueObj.color}`;
  let issueGroupBorder = `1px solid ${issueValueObj.color}`;
  // switch (issueGroup) {
  //   case "Process":
  //     issueGroupColor = "#6699cc";
  //     issueGroupBorder = "1px solid #6699cc";
  //     break;
  //   case "Status":
  //     issueGroupColor = "#009966";
  //     issueGroupBorder = "1px solid #009966";
  //     break;
  //   case "Type":
  //     issueGroupColor = "#8fbc8f";
  //     issueGroupBorder = "1px solid #8fbc8f";
  //     break;
  //   default:
  //     issueGroupColor = undefined;
  //     issueGroupBorder = undefined;
  //     break;
  // }
  return (
    <>
      <div>
        <BaseBadge
          bageName={issueGroup}
          style={{
            backgroundColor: issueValueObj.color,
            border: issueGroupBorder,
          }}
          roundedPill="rounded-pill badge_issue_group"
        />
        <BaseBadge
          bageName={issueValue}
          style={{
            backgroundColor: "#ffffff",
            border: issueGroupBorder,
            color: issueValueObj.text_color === undefined ? "black" : issueValueObj.text_color,
          }}
          roundedPill="me-1 rounded-pill badge_issue_value"
        />
      </div>
    </>
  );
};
