import { Table, Tooltip } from "antd";
import React, { useState } from "react";
import { MilestoneAction } from "src/components/Milestone/MilestoneAction/MilestoneAction";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { ProjectMilestoneAction } from "../ProjectMilestoneAction/ProjectMilestoneAction";
import { MilestoneStatus } from "src/components/Status/MilestoneStatus";
const selectType = (typeMilestone) => {
  let field = "";
  switch (typeMilestone) {
    case "class":
      field = "class_id";
      break;
    case "project":
      field = "project_id";
      break;
    default:
      field = undefined;
      break;
  }
  return field;
};
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
export const ProjectMilestoneItem = ({
  milestone,
  projectId,
  classMilestones,
  handleMilestoneChangeStatus,
  handleMilestoneDelete,
  handleMilestoneUpdate,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const dataSource = [];

  milestone.milestones.length !== 0 &&
    milestone.milestones.map((milestoneItem, index) => {
      dataSource.push({
        key: milestoneItem.milestone_id,
        order: index + 1,
        milestone_name: milestoneItem.milestone_name,
        from_date: handleToDDMMYYYY(milestoneItem.from_date),
        to_date: handleToDDMMYYYY(milestoneItem.to_date),
        description: milestoneItem.description,
        status: <MilestoneStatus status={milestoneItem.status} />,
        action: (
          <ProjectMilestoneAction
            optionId={milestoneItem.milestone_id}
            option={milestoneItem}
            type="Milestone"
            // fetchData={fetchData}
            // searchParams={searchParams}
            code={milestoneItem.milestone_name}
            milestones={milestone.milestones}
            classMilestone={milestone}
            id={projectId}
            selectType={selectType}
            typeMilestone="project"
            classMilestones={classMilestones}
            handleMilestoneChangeStatus={handleMilestoneChangeStatus}
            handleMilestoneDelete={handleMilestoneDelete}
            handleMilestoneUpdate={handleMilestoneUpdate}
          />
        ),
      });
    });

  let columns = [
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
      title: "Milestone Name",
      dataIndex: "milestone_name",
      key: "milestone_name",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.milestone_name.length - b.milestone_name.length,
      render: (milestone_name) => (
        <Tooltip placement="topLeft" title={milestone_name}>
          {milestone_name}
        </Tooltip>
      ),
    },
    {
      title: "From Date",
      dataIndex: "from_date",
      key: "from_date",
      width: "15%",
      align: "center",
      ellipsis: true,
      sorter: (a, b) => a.from_date.length - b.from_date.length,
      render: (from_date) => (
        <Tooltip placement="topLeft" title={from_date}>
          {from_date}
        </Tooltip>
      ),
    },
    {
      title: "To Date",
      dataIndex: "to_date",
      key: "to_date",
      width: "15%",
      align: "center",
      ellipsis: true,
      sorter: (a, b) => a.to_date.length - b.to_date.length,
      render: (to_date) => (
        <Tooltip placement="topLeft" title={to_date}>
          {to_date}
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
      sorter: (a, b) => a.description.length - b.description.length,
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
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
  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        // rowSelection={rowSelection}
        showHeader={false}
        pagination={false}
        size="small"
      />
    </>
  );
};
