import React from "react";
import { Collapse, Space, Typography } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Text } = Typography;

const YourComponent = () => {
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <Panel header="Column 1" key="1">
        {/* Content for Column 1 */}
        <Space direction="vertical">
          <Text>Row 1</Text>
          <Text>Row 2</Text>
          {/* ... */}
        </Space>
      </Panel>
      <Panel header="Column 2" key="2">
        {/* Content for Column 2 */}
        <Space direction="vertical">
          <Text>Row 1</Text>
          <Text>Row 2</Text>
          {/* ... */}
        </Space>
      </Panel>
      {/* Add more Panel components for additional columns */}
    </Collapse>
  );
};

export default YourComponent;
