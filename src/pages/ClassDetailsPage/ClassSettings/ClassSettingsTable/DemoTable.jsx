import { Button, ConfigProvider, Space, Switch, Table, Tooltip } from "antd";
import { useState } from "react";
import { IssueSettingEnum } from "src/enum/Enum";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { ClassSettingsAction } from "../ClassSettingsAction/ClassSettingsAction";
import { AddIconBtn } from "./AddIconBtn/AddIconBtn";
import { NewIssueSetting } from "./NewIssueSetting/NewIssueSetting";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { searchUtils } from "src/utils/handleSearchFilter";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
const searchIssueSetting = [
  {
    id: "issue_value",
    value: "Issue Value",
  },
];

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
    title: "Issue Setting Value",
    dataIndex: "issue_value",
    key: "issue_value",
    width: "20%",
    sorter: (a, b) => a.issue_value.length - b.issue_value.length,
    render: (issue_value) => (
      <Tooltip placement="topLeft" title={issue_value}>
        {issue_value}
      </Tooltip>
    ),
  },
  {
    title: "Issue Group",
    dataIndex: "issue_group",
    key: "issue_group",
    width: "20%",
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
    width: "30%",
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

// rowSelection objects indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};
export const DemoTable = ({
  classSettings,
  searchParams,
  fetchData,
  classId,
  onSearch,
  handleReset,
  loading,
}) => {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingInactive, setLoadingInactive] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  // const handleReset = (clearFilters) => {
  //   clearFilters();
  //   setSearchText("");
  // };
  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const IssueType = [
    {
      key: 1,
      issue_value: "Issue Type",
      fixed: "top",
      children: [],
      action: (
        <NewIssueSetting
          dataGroup={IssueSettingEnum.IssueType}
          classId={classId}
          searchParams={searchParams}
          fetchData={fetchData}
        />
      ),
      expandedRowRender: <p style={{ height: "30px" }}>abcd</p>,
    },
  ];
  const IssueStatus = [
    {
      key: 2,
      issue_value: "Issue Status",
      children: [],
      action: (
        <NewIssueSetting
          dataGroup={IssueSettingEnum.IssueStatus}
          classId={classId}
          searchParams={searchParams}
          fetchData={fetchData}
        />
      ),
    },
  ];

  const WorkProcess = [
    {
      key: 3,
      issue_value: "Work Process",
      children: [],
      fixed: "top",
      action: (
        <NewIssueSetting
          dataGroup={IssueSettingEnum.WorkProcess}
          classId={classId}
          searchParams={searchParams}
          fetchData={fetchData}
        />
      ),
    },
  ];
  const issueType = classSettings.data.filter(
    (issueType) =>
      parseInt(issueType.issue_group) === IssueSettingEnum.IssueType
  );
  const issueStatus = classSettings.data.filter(
    (issueType) =>
      parseInt(issueType.issue_group) === IssueSettingEnum.IssueStatus
  );

  const workProcess = classSettings.data.filter(
    (issueType) =>
      parseInt(issueType.issue_group) === IssueSettingEnum.WorkProcess
  );

  // for (let index = 0; index < issueType.length; index++) {
  //   const iType = issueType[index];
  //   let i = index + 1;
  //   IssueType[0].children.push({
  //     key: iType.issue_setting_id,
  //     // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
  //     issue_value: iType.issue_value,
  //     subject_code: iType.subject_code,
  //     subject_name: iType.subject_name,
  //     class_code: iType.class_code,
  //     class_name: iType.class_name,
  //     status: <Status status={iType.status} />,
  //     action: (
  //       <ClassSettingsAction
  //         fetchData={fetchData}
  //         searchParams={searchParams}
  //         settingId={iType.issue_setting_id}
  //         status={iType.status}
  //       />
  //     ),
  //   });
  // }

  // for (let index = 0; index < issueStatus.length; index++) {
  //   const iStatus = issueStatus[index];
  //   let i = index + 1;
  //   IssueStatus[0].children.push({
  //     key: iStatus.issue_setting_id,
  //     // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
  //     issue_value: iStatus.issue_value,
  //     subject_code: iStatus.subject_code,
  //     subject_name: iStatus.subject_name,
  //     class_code: iStatus.class_code,
  //     class_name: iStatus.class_name,
  //     status: <Status status={iStatus.status} />,
  //     action: (
  //       <ClassSettingsAction
  //         fetchData={fetchData}
  //         searchParams={searchParams}
  //         settingId={iStatus.issue_setting_id}
  //         status={iStatus.status}
  //       />
  //     ),
  //   });
  // }

  // for (let index = 0; index < workProcess.length; index++) {
  //   const wProcess = workProcess[index];
  //   let i = index + 1;
  //   WorkProcess[0].children.push({
  //     key: wProcess.issue_setting_id,
  //     // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
  //     issue_value: wProcess.issue_value,
  //     subject_code: wProcess.subject_code,
  //     subject_name: wProcess.subject_name,
  //     class_code: wProcess.class_code,
  //     class_name: wProcess.class_name,
  //     status: <Status status={wProcess.status} />,
  //     action: (
  //       <ClassSettingsAction
  //         fetchData={fetchData}
  //         searchParams={searchParams}
  //         settingId={wProcess.issue_setting_id}
  //         status={wProcess.status}
  //       />
  //     ),
  //   });
  // }

  const handleChangeStatus = async (userId, status) => {
    // const { data, err } = await axiosClient.post(
    //   `/User/UpdateStatus?status=${status}`,
    //   userId
    // );
    // if (err) {
    //   window.alert("Change fail!");
    //   return;
    // } else {
    //   window.alert("Change Successful!");
    //   fetchData(searchParams);
    // }
  };

  const handleChange = (value, status) => {
    {
      status === 1 ? setLoadingActive(true) : setLoadingInactive(true);
    }
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      {
        status === 1 ? setLoadingActive(false) : setLoadingInactive(false);
      }
      handleChangeStatus(value, status);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const expandedRowClassName = (record, index, indent) => {
    // Add your condition here to determine which rows to style
    if (
      record.issue_value === "Issue Type" ||
      record.issue_value === "Issue Status" ||
      record.issue_value === "Work Process"
    ) {
      return "expanded-row"; // You should define this class in your CSS
    }
    return "";
  };

  const expandedRowRender = (record) => {
    let data = [];
    record.key === 3 ? (data = [...workProcess]) : (data = []);
    console.log(data);
    return (
      <div className="shadow flexGrow_1">
        <ConfigProvider
          theme={{
            components: {
              Table: {
                expandedRowClassName: "expand__issueSetting",
                borderRadius: 0,
                width: "100%"
              },
            },
          }}
        >
          <Table
            style={{ maxHeight: "170px" }}
            columns={columns}
            showHeader={false}
            rowSelection={{
              ...rowSelection,
              checkStrictly,
            }}
            dataSource={IssueType}
            pagination={false}
            rowClassName={expandedRowClassName}
            size="small"
            bordered
            scroll={{
              x: 1180,
              y: 150,
            }}
          />
        </ConfigProvider>
      </div>
    );
  };

  return (
    <>
      <div
        className="row"
        style={{
          marginBottom: 16,
        }}
      >
        {" "}
        <nav className="col-md-6 col-sm-12 d-flex align-items-center">
          <Space align="center">
            CheckStrictly:{" "}
            <Switch checked={checkStrictly} onChange={setCheckStrictly} />
          </Space>
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
          {loading ? (
            <LoadingOutlined className="filterIcon ms-4 float-end" disabled />
          ) : (
            <ReloadOutlined
              className="filterIcon ms-4 float-end"
              onClick={handleReset}
            />
          )}
        </nav>
        <BaseSearch
          className="col-md-6 col-sm-12 m-0 float-end d-flex align-items-center"
          placeholderInput="Search here..."
          placeholderSelect="Search by"
          options={searchIssueSetting}
          onSearch={onSearch}
          checkedSearchSelect={checkedSearchSelect}
          onResetSearchSelect={onResetSearchSelect}
          checkedSearchInput={checkedSearchInput}
          onResetSearchInput={onResetSearchInput}
        />
      </div>
      <div className="shadow flexGrow_1">
        <ConfigProvider
          theme={{
            components: {
              Table: {
                expandedRowClassName: "expand__issueSetting",
                borderRadius: 0,
              },
            },
          }}
        >
          <Table
            style={{ maxHeight: "170px" }}
            columns={columns}
            rowSelection={{
              ...rowSelection,
              checkStrictly,
            }}
            dataSource={IssueType}
            pagination={false}
            rowClassName={expandedRowClassName}
            expandable={{ expandedRowRender }}
            size="small"
            bordered
            scroll={{
              x: 1130,
              y: 335,
            }}
          />
          {/* <Table
            style={{ maxHeight: "150px" }}
            columns={columns}
            rowSelection={{
              ...rowSelection,
              checkStrictly,
            }}
            dataSource={IssueStatus}
            showHeader={false}
            pagination={false}
            rowClassName={expandedRowClassName}
            // expandable={{ expandedRowRender }}
            size="small"
            scroll={{
              x: 1180,
              y: 150,
            }}
          />
          <Table
            style={{ maxHeight: "150px" }}
            columns={columns}
            rowSelection={{
              ...rowSelection,
              checkStrictly,
            }}
            dataSource={WorkProcess}
            showHeader={false}
            pagination={false}
            rowClassName={expandedRowClassName}
            // expandable={{ expandedRowRender }}
            size="small"
            scroll={{
              x: 1180,
              y: 150,
            }}
          /> */}
        </ConfigProvider>
      </div>
    </>
  );
};
