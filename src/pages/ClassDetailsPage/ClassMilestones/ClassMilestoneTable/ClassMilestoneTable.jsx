import { ConfigProvider, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { useNavigate } from "react-router";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { BaseAction } from "src/components/Base/BaseAction/BaseAction";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { ClassMilestoneAction } from "../ClassMilestoneAction/ClassMilestoneAction";
import { ClassStatus } from "src/components/Status/ClassStatus";
import { MilestoneStatus } from "src/components/Status/MilestoneStatus";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
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
export const ClassMilestoneTable = ({
  onPageChange,
  milestones,
  fetchData,
  searchParams,
  classId,
  loadingTable,
  onPageSizeChange,
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
  for (let index = 0; index < milestones.data.length; index++) {
    const milestone = milestones.data[index];
    let i = index + 1;
    data.push({
      key: milestone.milestone_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      milestone_name: milestone.milestone_name,
      from_date: handleToDDMMYYYY(milestone.from_date),
      to_date: handleToDDMMYYYY(milestone.to_date),
      description: milestone.description,
      status: <MilestoneStatus status={milestone.status} />,
      action: (
        <ClassMilestoneAction
          optionId={milestone.milestone_id}
          milestone={milestone}
          option={milestone}
          fetchData={fetchData}
          searchParams={searchParams}
          classId={classId}
          code={milestone.milestone_name}
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
      width: "13%",
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
      width: "13%",
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
      width: "33%",
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
      width: "12%",
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
    <div className="d-flex flex-column flexGrow_1">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "rgba(0, 0, 0, 0.1)",
              headerBorderRadius: "4px",
              headerBg: "#edececd1",
              controlItemBgActiveHover: "rgba(0, 0, 0, 0.05)",
              controlItemBgActive: "rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <Table
          className="flexGrow_1"
          style={{ height: "50vh", overflow: "hidden" }}
          columns={columns}
          dataSource={data}
          loading={loadingTable}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1180,
            y: 362,
          }}
        />
        {}
        <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber, pageSize) => {
            onPageChange(pageNumber, pageSize);
          }}
          onPageSizeChange={(pageSize) => {
            onPageSizeChange(pageSize);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={milestones.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
