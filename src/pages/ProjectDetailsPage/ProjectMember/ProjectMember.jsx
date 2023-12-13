import { ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import "./ProjectMember.scss";
import ProjectMemberAction from "./ProjectMemberAction/ProjectMemberAction";
import { ConditionEnum } from "src/enum/Enum";
import { HandleAuth } from "src/utils/handleAuth";
import { StarFilled } from "@ant-design/icons";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const ProjectMember = ({
  project,
  fetchData,
  students,
  loadingTable,
  handleSetLeader,
  handleProjectStudentDelete,
  loadingLeader,
  loadingRemove,
  classId,
  actionId,
  classObj,
}) => {
  const navigate = useNavigate();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const data = [];
  for (let index = 0; index < students.length; index++) {
    const student = students[index];
    data.push({
      order: index + 1,
      key: student.student_id,
      fullname: (
        <span>
          {student.student_name}{" "}
          {project.leader_id === student.student_id ? (
            <StarFilled style={{ color: "orange" }} />
          ) : (
            ""
          )}
        </span>
      ),
      email: student.student_email,
      phone_number: student.student_phone,
      note: student.note,
      status: <Status status={student.status} />,
      action: (
        <ProjectMemberAction
          student={student}
          project={project}
          actionId={actionId}
          loadingLeader={loadingLeader}
          loadingRemove={loadingRemove}
          isLeader={project.leader_id === student.student_id}
          handleSetLeader={handleSetLeader}
          handleProjectStudentDelete={handleProjectStudentDelete}
        />
      ),
    });
  }
  const columns = [
    {
      title: "#",
      dataIndex: "order",
      key: "order",
      width: "5%",
      fixed: "left",
      align: "center",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      width: "20%",
      sorter: (a, b) => a.fullname.length - b.fullname.length,
      render: (fullname) => (
        <Tooltip placement="topLeft" title={fullname}>
          {fullname}
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      align: "center",
      sorter: (a, b) => a.email.length - b.email.length,
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      ),
    },
    // {
    //   title: "Phone",
    //   dataIndex: "phone_number",
    //   key: "phone_number",
    //   width: "15%",
    //   align: "center",
    //   sorter: (a, b) => a.phone_number.length - b.phone_number.length,
    //   render: (phone_number) => (
    //     <Tooltip placement="topLeft" title={phone_number}>
    //       {phone_number}
    //     </Tooltip>
    //   ),
    // },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "30%",
      align: "center",
      sorter: (a, b) => a.note.length - b.note.length,
      render: (note) => (
        <Tooltip placement="topLeft" title={note}>
          {note}
        </Tooltip>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "10%",
      align: "center",
      fixed: "right",
      borderColor: "black",
    },
  ];
  // const rowClassName = (record) => (record.disable ? "disable-row" : "");
  return (
    <div className="d-flex flex-column flexGrow_1">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "rgba(0, 0, 0, 0.1)",
              headerBorderRadius: "4px",
              controlItemBgActiveHover: "rgba(0, 0, 0, 0.05)",
              controlItemBgActive: "rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <Table
          className="flexGrow_1"
          //   rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={loadingTable}
          // rowClassName={rowClassName}
          size="small"
          bordered
          scroll={{
            x: 1180,
            y: 330,
          }}
        />
      </ConfigProvider>
    </div>
  );
};
