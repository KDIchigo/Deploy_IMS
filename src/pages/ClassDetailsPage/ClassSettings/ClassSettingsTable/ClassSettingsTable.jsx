import { Button, ConfigProvider, Space, Switch, Table } from "antd";
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
    title: "Issue value",
    dataIndex: "issue_value",
    key: "issue_value",
    fixed: "left",
    width: "15%",
  },
  {
    title: "Subject Code",
    dataIndex: "subject_code",
    key: "subject_code",
    width: "10%",
  },
  {
    title: "Subject Name",
    dataIndex: "subject_name",
    key: "subject_name",
    width: "20%",
  },
  {
    title: "Class Code",
    dataIndex: "class_code",
    key: "class_code",
    width: "10%",
  },
  {
    title: "Class Name",
    dataIndex: "class_name",
    key: "class_name",
    width: "20%",
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
    fixed: "right",
    align: "center",
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
export const ClassSettingsTable = ({
  classSettings,
  searchParams,
  fetchData,
  classId,
  onSearch,
  handleReset,
  loading,
  isSearch,
}) => {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingInactive, setLoadingInactive] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);

  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const data = [
    {
      key: 1,
      issue_value: "Issue Type",
      fixed: "top",
      action: (
        <NewIssueSetting
          dataGroup={IssueSettingEnum.IssueType}
          classId={classId}
          searchParams={searchParams}
          fetchData={fetchData}
        />
      ),
      children: [],
    },
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
    {
      key: 3,
      issue_value: "Work Process",
      children: [],
      action: (
        <NewIssueSetting
          dataGroup={IssueSettingEnum.WorkProcess}
          classId={classId}
          searchParams={searchParams}
          fetchData={fetchData}
        />
      ),
      scroll: { y: 20 },
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

  const workProccess = classSettings.data.filter(
    (issueType) =>
      parseInt(issueType.issue_group) === IssueSettingEnum.WorkProcess
  );
  console.log(data[2].children);

  for (let index = 0; index < issueType.length; index++) {
    const iType = issueType[index];
    let i = index + 1;
    data[0].children.push({
      key: iType.issue_setting_id,
      // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      issue_value: iType.issue_value,
      subject_code: iType.subject_code,
      subject_name: iType.subject_name,
      class_code: iType.class_code,
      class_name: iType.class_name,
      status: <Status status={iType.status} />,
      action: (
        <ClassSettingsAction
          fetchData={fetchData}
          searchParams={searchParams}
          settingId={iType.issue_setting_id}
          status={iType.status}
          classSetting={iType}
        />
      ),
    });
  }

  for (let index = 0; index < issueStatus.length; index++) {
    const iStatus = issueStatus[index];
    let i = index + 1;
    data[1].children.push({
      key: iStatus.issue_setting_id,
      // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      issue_value: iStatus.issue_value,
      subject_code: iStatus.subject_code,
      subject_name: iStatus.subject_name,
      class_code: iStatus.class_code,
      class_name: iStatus.class_name,
      status: <Status status={iStatus.status} />,
      action: (
        <ClassSettingsAction
          fetchData={fetchData}
          searchParams={searchParams}
          settingId={iStatus.issue_setting_id}
          status={iStatus.status}
          classSetting={iStatus}
        />
      ),
    });
  }

  for (let index = 0; index < workProccess.length; index++) {
    const wProccess = workProccess[index];
    let i = index + 1;
    data[2].children.push({
      key: wProccess.issue_setting_id,
      // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      issue_value: wProccess.issue_value,
      subject_code: wProccess.subject_code,
      subject_name: wProccess.subject_name,
      class_code: wProccess.class_code,
      class_name: wProccess.class_name,
      status: <Status status={wProccess.status} />,
      action: (
        <ClassSettingsAction
          fetchData={fetchData}
          searchParams={searchParams}
          settingId={wProccess.issue_setting_id}
          status={wProccess.status}
          classSetting={wProccess}
        />
      ),
    });
  }

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
      <ConfigProvider
        theme={{
          components: {
            Table: {
              expandedRowClassName: "expand__issueSetting",
            },
          },
        }}
      >
        {console.log(isSearch)}
        <Table
          className="shadow"
          style={{
            minHeight: "250px",
          }}
          columns={columns}
          rowSelection={{
            ...rowSelection,
            checkStrictly,
          }}
          dataSource={data}
          pagination={false}
          defaultExpandAllRows={isSearch}
          rowClassName={expandedRowClassName}
          size="small"
          scroll={{
            x: 1130,
            y: 330,
          }}
          // scroll={{
          //   y: "150px",
          // }}
        />
      </ConfigProvider>
    </>
  );
};
