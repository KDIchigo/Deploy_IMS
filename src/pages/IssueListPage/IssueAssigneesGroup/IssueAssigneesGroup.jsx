import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
export const IssueAssigneesGroup = ({ issue }) => {
  if (issue.assignee === null) {
    return null;
  }
  // console.log(issue);
  // const assignees = JSON.parse(assignee);
  return (
    <>
      {/* <Avatar.Group className="mt-1">
        {assignees.length !== 0 &&
          assignees.map((ass) => (
            <Tooltip key={ass.user_id} placement="top" title={ass.fullname}>
              <Avatar shape="circle" size="small" icon={<UserOutlined />} />
            </Tooltip>
          ))}
      </Avatar.Group> */}
      <Avatar.Group className="mt-1 me-2">
        <Tooltip placement="top" title={issue.assignee_name}>
          <Avatar
            shape="circle"
            size="small"
            icon={<UserOutlined />}
            src={issue?.assignee_avatar}
          />
        </Tooltip>
      </Avatar.Group>
    </>
  );
};
