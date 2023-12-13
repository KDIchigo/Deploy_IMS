import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Tooltip } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
import "./BaseSearch.scss";
const { Option } = Select;

export const BaseSearchAll = ({
  className,
  placeholderInput,
  options,
  onSearch,
  onResetSearchInput,
  checkedSearchInput,
}) => {
  const [filter, setFilter] = useState({
    field: options[0].id,
    value: options[0].value,
    condition: ConditionEnum.Like,
  });
  let tootlip = "";
  options.map((ele, index) => {
    index === 0 && (tootlip += `${ele.value}`);
    index > 0 && index < options.length - 1 && (tootlip += `, ${ele.value}`);
    index === options.length - 1 &&
      index > 0 &&
      (tootlip += ` and ${ele.value}`);
  });
  const [inputValue, setInputValue] = useState(null);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(inputValue, options);
    }
  };

  return (
    <>
      <Tooltip
        title={tootlip}
        placement="top"
        className={className}
        //   color="#845adf"
        size="large"
      >
        <Space.Compact
          size="large"
          style={{
            margin: "4px",
          }}
        >
          <Input
            value={checkedSearchInput}
            className="demo"
            onKeyPress={handleKeyPress}
            placeholder={placeholderInput}
            onChange={(e) => {
              setInputValue(e.target.value);
              onResetSearchInput(e.target.value);
              // setFilter({ ...filter, value: e.target.value });
            }}
            addonAfter={
              <SearchOutlined
                onClick={() => {
                  onSearch(inputValue, options);
                }}
              />
            }
          />
        </Space.Compact>
      </Tooltip>
    </>
  );
};
