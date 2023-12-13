import { ConfigProvider, Table, Tooltip } from "antd";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";

export const ImportProjectStudentTable = ({
  importData,
  handleInsertImport,
  current,
  isView,
  prev,
}) => {
  const data = [];
  for (let index = 0; index < importData.demoData.length; index++) {
    const student = importData.demoData[index];
    let i = index + 1;
    data.push({
      key: student.user_id,
      order: i,
      student_name: student.student_name,
      student_email: student.student_email,
      student_phone: student.student_phone,
      excel_erros: student.excel_erros,
      status: <Status status={student.status} />,
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
        <Tooltip placement="top" title={student_name}>
          {student_name}
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "student_email",
      key: "student_email",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.student_email.length - b.student_email.length,
      render: (student_email) => (
        <Tooltip placement="top" title={student_email}>
          {student_email}
        </Tooltip>
      ),
    },
    {
      title: "Phone",
      dataIndex: "student_phone",
      key: "student_phone",
      width: "15%",
      ellipsis: true,
      sorter: (a, b) => a.student_phone.length - b.student_phone.length,
      render: (student_phone) => (
        <Tooltip placement="top" title={student_phone}>
          {student_phone}
        </Tooltip>
      ),
    },
    {
      title: "Error",
      dataIndex: "excel_erros",
      key: "excel_erros",
      width: "15%",
      ellipsis: true,
      sorter: (a, b) => a.excel_erros.length - b.excel_erros.length,
      render: (excel_erros) => (
        <Tooltip placement="top" title={excel_erros}>
          {excel_erros}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "15%",
      ellipsis: true,
      sorter: (a, b) => a.status.length - b.status.length,
      render: (status) => (
        <Tooltip placement="top" title={status}>
          {status}
        </Tooltip>
      ),
    },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   width: "10%",
    //   align: "center",
    //   // sorter: (a, b) => a.status - b.status,
    // },
  ];

  return (
    <>
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
          //   rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 766,
            y: 390,
          }}
        />
        {current > 0 && (
          <BaseButton
            nameTitle="w-25 float-start flexGrow_1 mt-3"
            type="button"
            value="Previous"
            color="light"
            onClick={() => prev()}
          />
        )}
        <BaseButton
          nameTitle="w-25 float-end flexGrow_1 mt-3"
          type="button"
          value="Import"
          color="secondary"
          disabled={isView}
          onClick={() => handleInsertImport(importData.successData)}
        />
        {/* <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber) => {
            onPageChange(pageNumber);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={students.totalRecord}
        /> */}
      </ConfigProvider>
    </>
  );
};
