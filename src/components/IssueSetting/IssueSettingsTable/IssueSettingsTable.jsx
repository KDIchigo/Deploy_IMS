import { ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseAction } from "src/components/Base/BaseAction/BaseAction";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import "./IssueSettingTable.scss";
import { IssueSettingsAction } from "../IssueSettingsAction/IssueSettingsAction";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const IssueSettingsTable = ({
  searchParams,
  fetchData,
  onSearch,
  handleReset,
  loading,
  onPageChange,
  onPageSizeChange,
  issueGroup,
  issueSettings,
  id,
  typeIssue,
  selectTypeIssue,
  loadingTable,
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
  for (let index = 0; index < issueSettings.data.length; index++) {
    const issue_setting = issueSettings.data[index];
    let i = index + 1;
    data.push({
      key: issue_setting.issue_setting_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      issue_value: issue_setting.issue_value,
      issue_group: issueGroup(issue_setting.issue_group),
      description: issue_setting.description,
      status: <Status status={issue_setting.status} />,
      action: (
        <IssueSettingsAction
          fetchData={fetchData}
          option={issue_setting}
          code={issue_setting.issue_value}
          searchParams={searchParams}
          optionId={issue_setting.issue_setting_id}
          id={id}
          typeIssue={typeIssue}
          selectTypeIssue={selectTypeIssue}
          issueGroup={issueGroup}
        />
      ),
      rowClassName:
        typeIssue === "project" &&
        (issue_setting.inherited_from === 1 ||
          issue_setting.inherited_from === 2 ||
          issue_setting.class_id ||
          issue_setting.project_id === null)
          ? "custom-row-with-background"
          : "",
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
          loading={loadingTable}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={(record) => record.rowClassName}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: 310,
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
          totalRecord={issueSettings.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
