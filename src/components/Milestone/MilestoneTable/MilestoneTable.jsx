import { ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { MilestoneStatus } from "src/components/Status/MilestoneStatus";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { MilestoneAction } from "../MilestoneAction/MilestoneAction";
import "./MilestoneTable.scss";
import { ConditionEnum } from "src/enum/Enum";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const MilestoneTable = ({
  onPageChange,
  onPageSizeChange,
  milestones,
  fetchData,
  searchParams,
  id,
  typeMilestone,
  classMilestones,
  selectType,
  loadingTable,
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [disabledRows, setDisabledRows] = useState([0]);
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

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const checkDisable = (typeMilestone, milestone) => {
    if (typeMilestone === "project" && !milestone.is_editable) {
      return true;
    }
    return false;
  };
  const data = [];
  for (let index = 0; index < milestones.data.length; index++) {
    const milestone = milestones.data[index];
    let i = index + 1;

    const disable = checkDisable(typeMilestone, milestone);

    data.push({
      key: milestone.milestone_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      milestone_name: milestone.milestone_name,
      from_date: handleToDDMMYYYY(milestone.from_date),
      to_date: handleToDDMMYYYY(milestone.to_date),
      description: milestone.description,
      status: <MilestoneStatus status={milestone.status} />,
      action: (
        <MilestoneAction
          optionId={milestone.milestone_id}
          option={milestone}
          type="Milestone"
          fetchData={fetchData}
          searchParams={searchParams}
          code={milestone.milestone_name}
          milestones={milestones}
          id={id}
          selectType={selectType}
          typeMilestone={typeMilestone}
          classMilestones={classMilestones}
        />
      ),
      disable: disable,
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
      width: "10%",
      align: "center",
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
      width: "10%",
      align: "center",
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
  // const rowClassName = (record, index) => {
  //   if (disabledRows.includes(index)) {
  //     return "disable-row";
  //   }
  //   return "";
  // };
  const rowClassName = (record) => (record.disable ? "disable-row" : "");
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
          // rowSelection={rowSelection}
          style={{ height: "60vh", overflow: "hidden" }}
          columns={columns}
          loading={loadingTable}
          rowClassName={rowClassName}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1180,
            y: "60vh",
          }}
        />
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
