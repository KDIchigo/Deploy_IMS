import { Button, ConfigProvider, Input, Space, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { DeleteFilled, SearchOutlined } from "@ant-design/icons";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { toast } from "react-toastify";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { StudentAction } from "src/components/Base/BaseAction/StudentAction";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const ClassStudentsTable = ({
  students,
  searchParams,
  fetchData,
  onPageChange,
  onPageSizeChange,
  classId,
  loadingTable,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userPage, setUserPage] = useState({
    totalRecord: 0,
    data: [],
  });

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
  for (let index = 0; index < students.data.length; index++) {
    const student = students.data[index];
    let i = index + 1;
    data.push({
      key: student.class_student_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      student_name: student.student_name,
      student_email: student.student_email,
      student_phone: student.student_phone,
      status: <Status status={student.status} />,
      // status: user.status === 1 ? "Active" : "Inactive",
      action: (
        // <BaseButton
        //   color="danger"
        //   variant="outline"
        //   nameTitle="px-3 py-1"
        //   onClick={() => handleDelete(student.class_student_id)}
        //   icon={<DeleteFilled />}
        // />
        <StudentAction
          optionId={student.class_student_id}
          option={student}
          student={student}
          code={student.student_name}
          fetchData={fetchData}
          searchParams={searchParams}
          classId={classId}
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
      title: "Student Name",
      dataIndex: "student_name",
      key: "student_name",
      width: "25%",
      ellipsis: true,
      sorter: (a, b) => a.student_name.length - b.student_name.length,
      render: (student_name) => (
        <Tooltip placement="topLeft" title={student_name}>
          {student_name}
        </Tooltip>
      ),
    },
    {
      title: "Student Email",
      dataIndex: "student_email",
      key: "student_email",
      width: "25%",
      ellipsis: true,
      sorter: (a, b) => a.student_email.length - b.student_email.length,
      render: (student_email) => (
        <Tooltip placement="topLeft" title={student_email}>
          {student_email}
        </Tooltip>
      ),
    },
    {
      title: "Student Phone",
      dataIndex: "student_phone",
      key: "student_phone",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.student_phone.length - b.student_phone.length,
      render: (student_phone) => (
        <Tooltip placement="topLeft" title={student_phone}>
          {student_phone}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      align: "center",
      // sorter: (a, b) => a.status - b.status,
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
          // onClick={() => {
          //   handleChange(selectedRowKeys, 1);
          // }}
          disabled={!hasSelected}
          loading={loadingActive}
        >
          Active
        </Button>
        <Button
          type="primary"
          // onClick={() => {
          //   handleChange(selectedRowKeys, 0);
          // }}
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
          style={{ paddingTop: 20, height: "40vh", overflow: "hidden" }}
          // rowSelection={rowSelection}
          loading={loadingTable}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: 332,
          }}
        />
        <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber, pageSize) => {
            onPageChange(pageNumber, pageSize);
          }}
          onPageSizeChange={(pageSize) => {
            onPageSizeChange(pageSize)
          }}
          pageSize={searchParams.pageSize}
          totalRecord={students.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
