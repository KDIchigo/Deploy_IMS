import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";

export const AddIconBtn = () => {
  return (
    <Tooltip
      title="Add New"
      placement="top"
      color="rgb(38, 191, 148)"
      size="large"
    >
      <div>
        <BaseButton
          icon={<PlusOutlined />}
          variant="outline"
          nameTitle="px-2 py-1"
          color="success"
        />
      </div>
    </Tooltip>
  );
};
