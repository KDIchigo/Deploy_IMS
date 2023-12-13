import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Switch, Table, Tooltip } from "antd";
const items = [
  {
    key: "1",
    label: "Action 1",
  },
  {
    key: "2",
    label: "Action 2",
  },
];
export const DemoTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkStrictly, setCheckStrictly] = useState(false);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const expandedRowRender = () => {
    const columns = [
      {
        title: "#",
        dataIndex: "order",
        key: "order",
        fixed: "left",
        align: "center",
        sorter: (a, b) => a.order - b.order,
      },
      {
        title: "Fullname",
        dataIndex: "fullname",
        key: "fullname",
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
        align: "center",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        align: "center",
        fixed: "right",
        borderColor: "black",
      },
    ];
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        name: "Screen",
        platform: "iOS",
        version: "10.3.4.5654",
        upgradeNum: 500,
        creator: "Jack",
        createdAt: "2014-12-24 23:12:00",
      });
    }
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={rowSelection}
        size="small"
        showHeader={false}
        bordered
        scroll={{
          x: 1130,
          y: 100,
        }}
      />
    );
  };
  const columns = [
    {
      title: "#",
      dataIndex: "order",
      key: "order",
      align: "center",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
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
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      borderColor: "black",
    },
  ];
  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i.toString(),
      name: "Screen",
      platform: "iOS",
      version: "10.3.4.5654",
      upgradeNum: 500,
      creator: "Jack",
      createdAt: "2014-12-24 23:12:00",
    });
  }
  return (
    <>
      <Space align="center">
        CheckStrictly:{" "}
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Table
        columns={columns}
        rowSelection={{
          ...rowSelection,
          checkStrictly,
        }}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={data}
        size="small"
        bordered
        scroll={{
          x: 1130,
          y: 400,
        }}
      />
    </>
  );
};
