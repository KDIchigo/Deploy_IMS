import { ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BaseAction } from "src/components/Base/BaseAction/BaseAction";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import "./SystemSettingTable.scss";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const SystemSettingTable = ({
  settings,
  searchParams,
  onPageChange,
  onPageSizeChange,
  fetchData,
  dataGroup,
  loadingTable,
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // const handleChangeStatus = async (settingId, status) => {
  //   const settingIdArr = [];
  //   settingIdArr.push(settingId);
  //   swalWithBootstrapButtons
  //     .fire({
  //       title: "Are you sure?",
  //       text: "Are you sure to update setting status?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       reverseButtons: true,
  //       confirmButtonText: "Yes,update it!",
  //       cancelButtonText: "No, cancel!",
  //     })
  //     .then(async (result) => {
  //       // console.log(result);
  //       if (result.isConfirmed) {
  //         const { err } = await axiosClient.post(
  //           `/Setting/UpdateStatus?status=${status}`,
  //           settingIdArr
  //         );

  //         if (err) {
  //           toast.error("Change status fail!");
  //           return;
  //         } else {
  //           toast.success("Change status Successfully!");

  //           fetchData(searchParams);
  //         }
  //       }
  //     });
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
  for (let index = 0; index < settings.data.length; index++) {
    const setting = settings.data[index];
    let i = index + 1;
    data.push({
      key: setting.setting_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      setting_value: setting.setting_value,
      data_group: dataGroup(setting.data_group),
      display_order: setting.display_order,
      status: <Status status={setting.status} />,
      action: (
        <BaseAction
          optionId={setting.setting_id}
          option={setting}
          type="Setting"
          code={setting.setting_value}
          fetchData={fetchData}
          searchParams={searchParams}
          settings={settings}
          dataGroup={dataGroup}
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
      title: "Setting Value",
      dataIndex: "setting_value",
      key: "setting_value",
      width: "30%",
      ellipsis: true,
      sorter: (a, b) => a.setting_value.length - b.setting_value.length,
      render: (setting_value) => (
        <Tooltip placement="topLeft" title={setting_value}>
          {setting_value}
        </Tooltip>
      ),
    },
    {
      title: "Setting Group",
      dataIndex: "data_group",
      key: "data_group",
      width: "30%",
      ellipsis: true,
      sorter: (a, b) => a.data_group.length - b.data_group.length,
      render: (data_group) => (
        <Tooltip placement="topLeft" title={data_group}>
          {data_group}
        </Tooltip>
      ),
    },
    {
      title: "Display Order",
      dataIndex: "display_order",
      key: "display_order",
      width: "15%",
      align: "center",
      ellipsis: true,
      sorter: (a, b) => a.display_order - b.display_order,
      render: (display_order) => (
        <Tooltip placement="topLeft" title={display_order}>
          {display_order}
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
              controlItemBgActiveHover: "rgba(0, 0, 0, 0.05)",
              controlItemBgActive: "rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <Table
          className="flexGrow_1 "
          style={{ height: "60vh", overflow: "hidden" }}
          // rowSelection={rowSelection}
          loading={loadingTable}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: "60vh",
          }}
        />
        <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber, pageSize) => {
            // setSearchParams({ ...searchParams, pageNumber: pageIndex });
            // console.log(searchParams, pageIndex);
            onPageChange(pageNumber, pageSize);
          }}
          onPageSizeChange={(pageSize) => {
            onPageSizeChange(pageSize)
          }}
          pageSize={searchParams.pageSize}
          totalRecord={settings.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
