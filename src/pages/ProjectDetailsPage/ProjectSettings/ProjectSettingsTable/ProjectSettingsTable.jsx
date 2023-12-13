import { ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { ProjectSettingsAction } from "../ProjectSettingsAction/ProjectSettigsAction";
import "./ProjectSettingsTable.scss";
import { InheritedEnum } from "src/enum/Enum";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const ProjectSettingsTable = ({
  projectSettings,
  searchParams,
  fetchData,
  projectId,
  onSearch,
  handleReset,
  loading,
  onPageChange,
  issueGroup,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // const handleChangeStatus = async (userId, status) => {
  //   const { data, err } = await axiosClient.post(
  //     `/User/UpdateStatus?status=${status}`,
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

  const data = [];
  for (let index = 0; index < projectSettings.data.length; index++) {
    const issue_setting = projectSettings.data[index];
    let i = index + 1;
    data.push({
      key: issue_setting.issue_setting_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      issue_value: issue_setting.issue_value,
      issue_group: issueGroup(issue_setting.issue_group),
      description: issue_setting.description,
      status: <Status status={issue_setting.status} />,
      action: (
        <ProjectSettingsAction
          fetchData={fetchData}
          searchParams={searchParams}
          settingId={issue_setting.issue_setting_id}
          status={issue_setting.status}
          projectSetting={issue_setting}
          projectId={projectId}
          issueGroup={issueGroup}
        />
      ),
      enable:
        issue_setting.inherited_from === InheritedEnum.Subject &&
        issue_setting.inherited_from === InheritedEnum.Class
          ? false
          : issue_setting.enable || false,
    });
  }
  const rowClassName = (record) => {
    if (record.inherited_from) {
      return "ant-table-row-inherited";
    } else {
      return "";
    }
  };
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
      title: " Setting Value",
      dataIndex: "issue_value",
      key: "issue_value",
      width: "15%",
      sorter: (a, b) => a.issue_value.length - b.issue_value.length,
      render: (issue_value) => (
        <Tooltip placement="topLeft" title={issue_value}>
          {issue_value}
        </Tooltip>
      ),
    },
    {
      title: "Setting Group",
      dataIndex: "issue_group",
      key: "issue_group",
      width: "15%",
      sorter: (a, b) => a.issue_group - b.issue_group,
      render: (issue_group) => (
        <Tooltip placement="topLeft" title={issue_group}>
          {issue_group}
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
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
              controlItemBgActiveHover: "rgba(0, 0, 0, 0.05)",
              controlItemBgActive: "rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <Table
          className="flexGrow_1"
          style={{ paddingTop: 20 }}
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={rowClassName}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: 336,
          }}
        />
        <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber) => {
            onPageChange(pageNumber);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={projectSettings.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
