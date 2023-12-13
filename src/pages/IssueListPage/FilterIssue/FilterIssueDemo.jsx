import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space } from "antd";
import { useState } from "react";
import { ConditionEnum } from "src/enum/Enum";
import './FilterIssue.scss'
const { Option } = Select;

export const FilterIssueDemo = () => {
  const [filter, setFilter] = useState({
    field: "",
    value: "",
    condition: ConditionEnum.Like,
  });

  const [select, setSelect] = useState(null);
  const [inputValue, setInputValue] = useState(null);

  const SearchBy = [
    {
      label: "Assignee",
      value: "assignee",
    },
  ];
  const SearchCondition = [
    {
      label: "Equal",
      value: ConditionEnum.Equal,
    },
    {
      label: "NotEqual",
      value: ConditionEnum.NotEqual,
    },
  ];
  const SearchValue = [
    {
      label: "student_id1",
      value: "Dung",
    },
    {
      label: "student_id2",
      value: "Thao",
    },
  ];
  const [options, setOptions] = useState(SearchBy);
  return (
    <>
      <Space.Compact
        size="large"
        style={{
          margin: "4px",
        }}
      >
        <Input
          addonBefore={
            <>
              <Select placeholder="Search By..." className="border__none">
                {SearchBy.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select placeholder="Search By..." className="border__none">
                {SearchCondition.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select placeholder="Search By..." className="border__none">
                {SearchValue.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </>
          }
          className="filterIssue"
          placeholder="{placeholderInput}"
          style={{width: 0, padding: "0px !important"}}
          addonAfter={<SearchOutlined />}
        />
        {/* {console.log(filter)} */}
      </Space.Compact>
    </>
  );
};
