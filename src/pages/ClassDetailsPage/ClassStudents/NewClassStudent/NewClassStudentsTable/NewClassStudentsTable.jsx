import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { filterUtils, searchUtils } from "src/utils/handleSearchFilter";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
const searchClassStudent = [
  {
    id: "fullname",
    value: "Student Name",
  },
  {
    id: "email",
    value: "Email",
  },
  {
    id: "phone_number",
    value: "Phone",
  },
];

export const NewClassStudentsTable = ({
  classId,
  students,
  searchParams,
  onPageChange,
  fetchData,
  onSearch,
  onReset,
  loading,
  loadingTable,
  checkedSearchSelect,
  checkedSearchInput,
  onResetSearchSelect,
  onResetSearchInput,
  handleNewClassStudentExist,
  onSearchAll,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

  const handleChangeStatus = async (userId, status) => {
    const { data, err } = await axiosClient.post(
      `/Class/UpdateStatus?status=${status}`,
      userId
    );
    if (err) {
      window.alert("Change fail!");
      return;
    } else {
      window.alert("Change Successful!");
      fetchData(searchParams);
    }
  };

  // const handleAdd = (value, status) => {
  //   setLoading(true);
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
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
  const handleAddMultiple = () => {
    handleNewClassStudentExist(selectedRowKeys);
    // console.log(selectedRowKeys)
  };
  const data = [];
  for (let index = 0; index < students.data.length; index++) {
    const student = students.data[index];
    let i = index + 1;
    data.push({
      key: student.user_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      fullname: student.fullname,
      email: student.email,
      phone_number: student.phone_number,
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
      dataIndex: "fullname",
      key: "fullname",
      width: "25%",
      ellipsis: true,
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
      width: "30%",
      ellipsis: true,
      sorter: (a, b) => a.email.length - b.email.length,
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.phone_number.length - b.phone_number.length,
      render: (phone_number) => (
        <Tooltip placement="topLeft" title={phone_number}>
          {phone_number}
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
        <Tooltip placement="topLeft" title={status}>
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
    <div>
      <div className="row d-flex flex-row mb-3">
        <div className="col-7 my-auto d-flex">
          {/* <BaseSearch
            className="col-lg-9 col-md-8 p-0 m-0"
            placeholderInput="Search here..."
            placeholderSelect="Search by"
            options={searchClassStudent}
            onSearch={onSearch}
            checkedSearchSelect={checkedSearchSelect}
            onResetSearchSelect={onResetSearchSelect}
            checkedSearchInput={checkedSearchInput}
            onResetSearchInput={onResetSearchInput}
          /> */}
          <BaseSearchAll
            className="col-lg-7 p-0 m-0"
            placeholderInput="Search here..."
            options={searchClassStudent}
            onSearch={onSearchAll}
            checkedSearchInput={checkedSearchInput}
            onResetSearchInput={onResetSearchInput}
          />
        </div>
        <div className="col-5 mt-sm-0 mt-2 d-flex flex-row-reverse bd-highlight">
          <BaseButton
            type="button"
            onClick={handleAddMultiple}
            disabled={!hasSelected || loadingTable}
            nameTitle="addNewBtn"
            style={{ borderRadius: "4px" }}
            value="Add"
            color="warning"
          />
          <Tooltip
            title="Reset"
            placement="topLeft"
            color="#845adf"
            size="large"
          >
            {loading ? (
              <LoadingOutlined
                className="filterIcon me-4 mx-4 float-end"
                disabled
              />
            ) : (
              <ReloadOutlined
                className="filterIcon me-4 mx-4 float-end"
                onClick={() => {
                  onReset();
                }}
              />
            )}
          </Tooltip>
          {/* <Button
            type="primary"
            onClick={handleAddMultiple}
            disabled={!hasSelected}
            className="addNewBtn"
            warning
          >
            Add
          </Button> */}
          <span className="me-2 my-auto">
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div>
      </div>
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
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={loadingTable}
          size="small"
          bordered
          scroll={{
            x: 766,
            y: 390,
          }}
        />
        <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber) => {
            // setSearchParams({ ...searchParams, pageNumber: pageIndex });
            // console.log(searchParams, pageIndex);
            onPageChange(pageNumber);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={students.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
