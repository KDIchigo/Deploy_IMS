import { Select } from "antd";
import {
  CloseCircleOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ConditionEnum } from "src/enum/Enum";
import { useState } from "react";
import "./FilterIssue.scss";
const { Option } = Select;

export const FilterIssue = () => {
  const [value, setValue] = useState([]);
  const [index, setIndex] = useState(1);
  const [selectedValues, setSelectedValues] = useState([]);
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
  const handleChange = (values) => {
    // console.log("Selected values:", values);

    index === 1 ? handleSearchCondition(values) : "";
    index === 2 ? handleSearchValue(values) : "";
    index === 3 ? handleSearchBy(values) : "";
    // console.log(index);
  };
  const handleSearchBy = (obj) => {
    setOptions(SearchBy);
    setSelectedValues(obj)
    // console.log(obj);
    setIndex(1);
  };
  const handleSearchCondition = (obj) => {
    setOptions(SearchCondition);
    setSelectedValues(obj)
    // console.log(obj);
    setIndex(2);
  };
  const handleSearchValue = (obj) => {
    setOptions(SearchValue);
    setSelectedValues(obj)
    // console.log(obj);
    setIndex(3);
  };
  const handleTagRender = (props) => {
    const { label, closable, onClose } = props;
    const handleClose = (e) => {
      onClose(e);
    };
    return (
      <div className="filter__item px-1">
        <span>{label}</span>
        {/* {console.log(selectedValues)} */}
        {/* {closable && selectedValues.length === 3 && (
          <span onClick={(e) => handleClose(e)} style={{ marginLeft: 8 }}>
            <CloseOutlined />
          </span>
        )} */}
      </div>
    );
  };
  const handleTagRenderValue = (props) => {
    const { label, closable, onClose } = props;
    const handleClose = (e) => {
      onClose(e);
    };
    return (
      <div className="filter__item px-1">
        <span>{label}</span>
        {/* {console.log(selectedValues)} */}
        {closable && (
          <span onClick={(e) => handleClose(e)} style={{ marginLeft: 8 }}>
            <CloseOutlined />
          </span>
        )}
      </div>
    );
  };
  const handleBlurClear = () => {
    // Clear all selected values
    if(index !== 1) {
      setSelectedValues([])
      setOptions(SearchBy);
      setIndex(1);
    }
    // console.log(index)
  };

  return (
    <Select
      mode="multiple"
      placeholder="Select projects"
      allowClear
      onChange={handleChange}
      tokenSeparators={[","]}
      value={selectedValues}
      tagRender={handleTagRender}
      style={{ width: "100%" }}
      onBlur={handleBlurClear}
      onClear={() => console.log("onClear")}
    >
      {/* Your options */}
      {options.map((option) => (
        <Option key={option.value} value={option.label}>
          {option.label}
        </Option>
      ))}

      {/* Add more options as needed */}
    </Select>
  );
};
