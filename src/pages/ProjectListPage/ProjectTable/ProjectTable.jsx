import { Button, ConfigProvider, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const ProjectTable = ({ projects, searchParams, fetchData }) => {
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

  //   const handleChangeStatus = async (userId, status) => {
  //     const { data, err } = await axiosClient.post(
  //       `/User/UpdateStatus?status=${status}`,
  //       userId
  //     );
  //     if (err) {
  //       window.alert("Change fail!");
  //       return;
  //     } else {
  //       window.alert("Change Successful!");
  //       fetchData(searchParams);
  //     }
  //   };

  //   const handleChange = (value, status) => {
  //     {
  //       status === 1 ? setLoadingActive(true) : setLoadingInactive(true);
  //     }
  //     // ajax request after empty completing
  //     setTimeout(() => {
  //       setSelectedRowKeys([]);
  //       {
  //         status === 1 ? setLoadingActive(false) : setLoadingInactive(false);
  //       }
  //       handleChangeStatus(value, status);
  //     }, 1000);
  //   };

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

  const data = [];
  //   for (let index = 0; index < users.data.length; index++) {
  //     const user = users.data[index];
  //     let i = index + 1;
  //     data.push({
  //       key: user.user_id,
  //       order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
  //       user_name: (
  //         <Tooltip placement="topLeft" title="ccc">
  //           user.user_name
  //         </Tooltip>
  //       ),
  //       fullname: user.fullname,
  //       email: user.email,
  //       phone_number: user.phone_number,
  //       setting_value: user.setting_value,
  //       status: (
  //         <Status status={user.status} />
  //         // <BaseBadge
  //         //   bageName={user.status === 1 ? <Status/> : "Inactive"}
  //         //   color={user.status === 1 ? "success" : "danger"}
  //         // />
  //       ),
  //       // status: user.status === 1 ? "Active" : "Inactive",
  //       action: (
  //         // <ActionUser
  //         //   userId={user.user_id}
  //         //   roles={roles}
  //         //   user={user}
  //         //   fetchData={fetchData}
  //         //   searchParams={searchParams}
  //         // />
  //         // <ActionUser
  //         //   userId={user.user_id}
  //         //   roles={roles}
  //         //   user={user}
  //         //   fetchData={fetchData}
  //         //   searchParams={searchParams}
  //         // />
  //         <BaseAction
  //           optionId={user.user_id}
  //           option={user}
  //           roles={roles}
  //           type="User"
  //           fetchData={fetchData}
  //           searchParams={searchParams}
  //         />
  //       ),
  //     });
  //   }
  const columns = [
    {
      title: "#",
      dataIndex: "order",
      key: "order",
      width: "5%",
      fixed: "left",
      align: "center",
      ellipsis: true,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      width: "20%",
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
      width: "22%",
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
      sorter: (a, b) => a.phone_number - b.phone_number,
      render: (phone_number) => (
        <Tooltip placement="topLeft" title={phone_number}>
          {phone_number}
        </Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "setting_value",
      key: "setting_value",
      width: "10%",
      ellipsis: true,
      sorter: (a, b) => a.setting_value.length - b.setting_value.length,
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
          //   onClick={() => {
          //     handleChange(selectedRowKeys, 1);
          //   }}
          disabled={!hasSelected}
          loading={loadingActive}
        >
          Active
        </Button>
        <Button
          type="primary"
          //   onClick={() => {
          //     handleChange(selectedRowKeys, 0);
          //   }}
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
              controlItemBgActiveHover: "rgba(0, 0, 0, 0.05)",
              controlItemBgActive: "rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <Table
          className="flexGrow_1"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: 330,
          }}
        />
        {/* <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber) => {
            // setSearchParams({ ...searchParams, pageNumber: pageIndex });
            // console.log(searchParams, pageIndex);
            onPageChange(pageNumber);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={users.totalRecord}
        /> */}
      </ConfigProvider>
    </div>
  );
};
