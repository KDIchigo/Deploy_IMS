import React from "react";
import { BaseBadge } from "../BaseBadge/BaseBadge";
import "./BaseIssueSettingCard.scss";

// Hàm chuyển đổi màu lên 1 tông
const lightenColor = (hexColor, percent) => {
  // Kiểm tra xem chuỗi màu có đúng định dạng không
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(hexColor);

  if (!isValidHex) {
    // console.error('Invalid hex color format');
    return hexColor; // Trả về màu không đổi nếu không phải là chuỗi màu hợp lệ
  }

  // Chuyển đổi chuỗi màu thành giá trị RGB
  const hex = hexColor.slice(1);
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Tính toán giá trị mới của mỗi thành phần màu
  const newR = Math.round(r + (255 - r) * (percent / 100));
  const newG = Math.round(g + (255 - g) * (percent / 100));
  const newB = Math.round(b + (255 - b) * (percent / 100));

  // Chuyển đổi giá trị mới thành chuỗi hex
  const newHex = `#${((1 << 24) | (newR << 16) | (newG << 8) | newB)
    .toString(16)
    .slice(1)}`;

  return newHex;
};

// Sử dụng hàm
const originalColor = "#ffffff";
const lightenedColor = lightenColor(originalColor, 20); // Thay đổi màu lên 20%

// console.log(`Original Color: ${originalColor}`);
// console.log(`Lightened Color: ${lightenedColor}`);

export const BaseIssueSettingCard = ({
  issueGroup,
  issueValue,
  issueValueObj,
}) => {
  if (issueValueObj === undefined || issueValueObj === null) {
    return null;
  }
  let newIssueStyle = JSON.parse(
    issueValueObj
      .replace(/\\\\/g, "")
      .replace(/\\r\\n/g, "")
      .replace(/\\r/g, "")
      .replace(/\\n/g, "")
      .replace(/\\/g, "")
      .replace(/^"|"$/g, "")
      .replace(/\s/g, "")
      .replace(/\r\n/g, "")
  );
  // console.log(JSON.parse(JSON.parse(newIssueStyle)))
  // console.log(newIssueStyle)

  let issueGroupColor = `${newIssueStyle.color}`;
  let issueGroupBorder = `1px solid ${newIssueStyle.color}`;
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
            backgroundColor: newIssueStyle.color,
            border: issueGroupBorder,
            borderRight: `1px solid ${lightenColor(newIssueStyle.color, 20)}`,
          }}
          roundedPill="rounded-pill badge_issue_group"
        />
        <BaseBadge
          bageName={issueValue}
          style={{
            backgroundColor: newIssueStyle.color,
            border: issueGroupBorder,
            color:
              newIssueStyle.text_color === undefined
                ? "#ffffff"
                : newIssueStyle.text_color,
          }}
          roundedPill="me-1 rounded-pill badge_issue_value"
        />
      </div>
    </>
  );
};
