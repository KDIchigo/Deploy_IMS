import { ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";

import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { SubjectAssignmentAction } from "../SubjectAssignmentAction/SubjectAssignmentAction";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const SubjectAssignmentTable = ({
  assignments,
  searchParams,
  onPageChange,
  onPageSizeChange,
  fetchData,
  subjectId,
  loadingTable,
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // const handleChange = (value, status) => {
  //   {
  //     status === 1 ? setLoadingActive(true) : setLoadingInactive(true);
  //   }
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     {
  //       status === 1 ? setLoadingActive(false) : setLoadingInactive(false);
  //     }
  //     handleChangeStatus(value, status);
  //   }, 1000);
  // };

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
  for (let index = 0; index < assignments.data.length; index++) {
    const assignment = assignments.data[index];
    let i = index + 1;
    data.push({
      key: assignment.assignment_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      assignment_name: assignment.assignment_name,
      description: assignment.description,
      status: <Status status={assignment.status} />,
      action: (
        <SubjectAssignmentAction
          optionId={assignment.assignment_id}
          option={assignment}
          code={assignment.assignment_name}
          fetchData={fetchData}
          searchParams={searchParams}
          assignments={assignments}
          subjectId={subjectId}
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
      title: "Assignment Name",
      dataIndex: "assignment_name",
      key: "assignment_name",
      width: "30%",
      ellipsis: true,
      sorter: (a, b) => a.assignment_name.length - b.assignment_name.length,
      render: (assignment_name) => (
        <Tooltip placement="topLeft" title={assignment_name}>
          {assignment_name}
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "45%",
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
    <div className="d-flex flex-column flexGrow_1">
      {/* <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            handleChange(selectedRowKeys, 1);
          }}
          disabled={!hasSelected}
          loading={loadingActive}
        >
          Active
        </Button>
        <Button
          type="primary"
          onClick={() => {
            handleChange(selectedRowKeys, 0);
          }}
          disabled={!hasSelected}
          loading={loadingInactive}
          danger
        >
          Inactive
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div> */}
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
          // rowSelection={rowSelection}
          loading={loadingTable}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: 362,
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
          totalRecord={assignments.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
