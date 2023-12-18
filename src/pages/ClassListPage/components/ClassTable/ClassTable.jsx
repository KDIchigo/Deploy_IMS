import { Button, ConfigProvider, Input, Space, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { SearchOutlined } from "@ant-design/icons";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { ActionClass } from "./ActionClass/ActionClass";
import { BaseAction } from "src/components/Base/BaseAction/BaseAction";
import { useNavigate } from "react-router";
import { ClassAction } from "src/components/Base/BaseAction/ClassAction";
import { ClassStatus } from "src/components/Status/ClassStatus";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const ClassTable = ({
  classes,
  searchParams,
  onPageChange,
  onPageSizeChange,
  fetchData,
  loadingTable,
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingInactive, setLoadingInactive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const [userPage, setUserPage] = useState({
    totalRecord: 0,
    data: [],
  });

  // const handleChangeStatus = async (userId, status) => {
  //   const { data, err } = await axiosClient.post(
  //     `/Class/UpdateStatus?status=${status}`,
  //     userId
  //   );
  //   if (err) {
  //     window.alert("Change fail!");
  //     return;
  //   } else {
  //     window.alert("Change Successful!");
  //     fetchData(searchParams);
  //   }
  // };

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

  // const start = () => {
  //   setLoading(true);
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
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
  const handleDoubleClick = (classId) => {
    navigate(`/class-details-general/${classId}`);
  };
  const data = [];
  if (classes.data.length !== 0) {
    for (let index = 0; index < classes.data.length; index++) {
      const classObj = classes.data[index];
      let i = index + 1;
      data.push({
        key: classObj.class_id,
        order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
        class_code: classObj.class_code,
        subject_code: classObj.subject_code,
        subject_name: classObj.subject_name,
        teacher_name: classObj.teacher_name,
        setting_value: classObj.semester_name,
        status: <ClassStatus status={classObj.status} />,
        // status: user.status === 1 ? "Active" : "Inactive",
        action: (
          // <ActionClass
          //   classId={classObj.class_id}
          //   fetchData={fetchData}
          //   classObj={classObj}
          //   searchParams={searchParams}
          // />
          <ClassAction
            optionId={classObj.class_id}
            option={classObj}
            type="Class"
            code={classObj.class_code}
            fetchData={fetchData}
            searchParams={searchParams}
            onClick={() =>
              navigate(`/class-details-general/${classObj.class_id}`)
            }
          />
        ),
      });
    }
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
      title: "Class Code",
      dataIndex: "class_code",
      key: "class_code",
      width: "10%",
      ellipsis: true,
      sorter: (a, b) => a.class_code.length - b.class_code.length,
      render: (class_code) => (
        <Tooltip placement="topLeft" title={class_code}>
          {class_code}
        </Tooltip>
      ),
    },
    {
      title: "Subject Code",
      dataIndex: "subject_code",
      key: "subject_code",
      width: "14%",
      ellipsis: true,
      sorter: (a, b) => a.subject_code.length - b.subject_code.length,
      render: (subject_code) => (
        <Tooltip placement="topLeft" title={subject_code}>
          {subject_code}
        </Tooltip>
      ),
    },
    {
      title: "Subject Name",
      dataIndex: "subject_name",
      key: "subject_name",
      width: "25%",
      ellipsis: true,
      sorter: (a, b) => a.subject_name.length - b.subject_name.length,
      render: (subject_name) => (
        <Tooltip placement="topLeft" title={subject_name}>
          {subject_name}
        </Tooltip>
      ),
    },
    {
      title: "Teacher Name",
      dataIndex: "teacher_name",
      key: "teacher_name",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.teacher_name.length - b.teacher_name.length,
      render: (teacher_name) => (
        <Tooltip placement="topLeft" title={teacher_name}>
          {teacher_name}
        </Tooltip>
      ),
    },
    {
      title: "Semester",
      dataIndex: "setting_value",
      key: "setting_value",
      width: "10%",
      ellipsis: true,
      sorter: (a, b) => a.setting_value - b.setting_value,
      render: (setting_value) => (
        <Tooltip placement="topLeft" title={setting_value}>
          {setting_value}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "12%",
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
    <div
      style={{
        flexGrow: 1,
      }}
      className="d-flex flex-column"
    >
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
          style={{ paddingTop: 20, height: "50vh", overflow: "hidden" }}
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
            // y: "50vh",
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleDoubleClick(record.key),
          })}
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
          totalRecord={classes.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
