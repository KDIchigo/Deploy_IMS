import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
import './BaseSearch.scss'
const { Option } = Select;

export const BaseSearch = ({
  className,
  placeholderInput,
  placeholderSelect,
  options,
  onSearch,
  onResetSearchSelect,
  checkedSearchSelect,
  onResetSearchInput,
  checkedSearchInput,
}) => {
  const [filter, setFilter] = useState({
    field: options[0].id,
    value: options[0].value,
    condition: ConditionEnum.Like
  });

  const [select, setSelect] = useState(null);
  const [inputValue, setInputValue] = useState(null);

  return (
    <>
      <Space.Compact
        size="large"
        className={className}
        style={{
          margin: "4px",
        }}
      >
        <Input
          addonBefore={
            <Select
              placeholder={placeholderSelect}
              defaultValue={options[0].id}
              className="border__none"
              value={checkedSearchSelect}
              onChange={(e) => {
                if (e === null) {
                  setFilter({ ...filter, field: "null" });
                } else {
                  setSelect(e);
                  setFilter({ ...filter, field: e });
                }
                onResetSearchSelect(e)
              }}
            >
            {options.map(option => (
              <Option key={option.id} value={option.id}>{option.value}</Option>
            ))}
            </Select>
          }
          value={checkedSearchInput}
          className="demo"
          placeholder={placeholderInput}
          onChange={(e) => {
            setInputValue(e.target.value);
            onResetSearchInput(e.target.value);
            setFilter({ ...filter, value: e.target.value });
          }}
          addonAfter={
            <SearchOutlined
              onClick={() => {
                // setFilter({ ...filter, field: select, value: inputValue });
                onSearch(filter);
                // setSearchParams({...searchParams, filterConditions: })
              }}
            />
          }
        />
        {/* {console.log(filter)} */}
      </Space.Compact>
    </>
  );
};
