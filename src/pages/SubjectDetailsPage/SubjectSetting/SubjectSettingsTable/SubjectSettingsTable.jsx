import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Space, Switch, Table } from "antd";
import { useState } from "react";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { IssueSettingEnum } from "src/enum/Enum";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { NewSubjectIssueSetting } from "./NewSubjectIssueSetting/NewSubjectIssueSetting";
import { ActionSubjectSetting } from "../ActionSubjectSetting/ActionSubjectSetting";

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
    width: "20%",
  },
  {
    title: "Subject Code",
    dataIndex: "subject_code",
    key: "subject_code",
    width: "20%",
  },
  {
    title: "Subject Name",
    dataIndex: "subject_name",
    key: "subject_name",
    width: "30%",
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
export const SubjectSettingsTable = ({
  subjectSettings,
  searchParams,
  fetchData,
  subjectId,
  onSearch,
  handleReset,
  classes,
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
  const data = [
    {
      key: 1,
      issue_value: "Issue Type",
      fixed: "top",
      action: (
        <NewSubjectIssueSetting
          dataGroup={IssueSettingEnum.IssueType}
          subjectId={subjectId}
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
        <NewSubjectIssueSetting
          dataGroup={IssueSettingEnum.IssueStatus}
          subjectId={subjectId}
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
        <NewSubjectIssueSetting
          dataGroup={IssueSettingEnum.WorkProcess}
          subjectId={subjectId}
          searchParams={searchParams}
          fetchData={fetchData}
        />
      ),
    },
  ];

  const issueType = subjectSettings.data.filter(
    (issueType) =>
      parseInt(issueType.issue_group) === IssueSettingEnum.IssueType
  );
  const issueStatus = subjectSettings.data.filter(
    (issueType) =>
      parseInt(issueType.issue_group) === IssueSettingEnum.IssueStatus
  );

  const workProccess = subjectSettings.data.filter(
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
        <ActionSubjectSetting
          subjectSetting={iType}
          fetchData={fetchData}
          searchParams={searchParams}
          subjectId={iType.issue_setting_id}
          status={iType.status}
        />
      ),
    });
  }

  for (let index = 0; index < issueStatus.length; index++) {
    const iType = issueStatus[index];
    let i = index + 1;
    data[1].children.push({
      key: iType.issue_setting_id,
      // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      issue_value: iType.issue_value,
      subject_code: iType.subject_code,
      subject_name: iType.subject_name,
      class_code: iType.class_code,
      class_name: iType.class_name,
      status: <Status status={iType.status} />,
      action: (
        <ActionSubjectSetting
          subjectSetting={iType}
          fetchData={fetchData}
          searchParams={searchParams}
          subjectId={iType.issue_setting_id}
          status={iType.status}
        />
      ),
    });
  }

  for (let index = 0; index < workProccess.length; index++) {
    const iType = workProccess[index];
    let i = index + 1;
    data[2].children.push({
      key: iType.issue_setting_id,
      // order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      issue_value: iType.issue_value,
      subject_code: iType.subject_code,
      subject_name: iType.subject_name,
      class_code: iType.class_code,
      class_name: iType.class_name,
      status: <Status status={iType.status} />,
      action: (
        <ActionSubjectSetting
          subjectSetting={iType}
          fetchData={fetchData}
          searchParams={searchParams}
          subjectId={iType.issue_setting_id}
          status={iType.status}
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
        <Table
          className="shadow"
          style={{
            minHeight: "460px",
          }}
          columns={columns}
          rowSelection={{
            ...rowSelection,
            checkStrictly,
          }}
          dataSource={data}
          pagination={false}
          rowClassName={expandedRowClassName}
          size="small"
          scroll={{
            y: "450px",
          }}
        />
      </ConfigProvider>
    </>
  );
};
