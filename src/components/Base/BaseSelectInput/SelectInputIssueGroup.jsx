import { ConfigProvider, Select } from "antd";
import { ConditionEnum, FilterOperatorEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputIssueGroup = ({
  label,
  important,
  defaultValue,
  options,
  onChange,
  placeholder,
  disabled,
  id,
  isFilter,
  formik,
  onFilter,
  checked,
  status,
  onBlur,
  classNameDiv,
  issueGroup,
}) => {
  // const roleArr = [];
  // for (let index = 0; index < options.length; index++) {
  //   const element = options[index];
  //   roleArr.push({
  //     value: type === "role" ? element.setting_id : element.value,
  //     label: type === "role" ? element.setting_value : element.label,
  //   });
  // }
  const filter = {
    field: "",
    value: "",
    condition: ConditionEnum.Equal,
  };
  let valueDefault = "";
  switch (defaultValue) {
    case "1":
      valueDefault = "Issue Type";
      break;
    case "2":
      valueDefault = "Issue Status";
      break;
    case "3":
      valueDefault = "Work Process";
      break;
    default:
      valueDefault = undefined;
      break;
  }

  return (
    <>
      <div className={classNameDiv}>
        <label htmlFor="input-placeholder" className="form-label ">
          {label}
          {important === "true" ? (
            <span className="ms-1" style={{ color: "red" }}>
              *
            </span>
          ) : (
            ""
          )}
        </label>
        <Select
          showSearch
          className="selectDesign"
          defaultValue={issueGroup(defaultValue)}
          value={checked}
          id={id}
          onBlur={onBlur}
          status={status}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(value, object) => {
            if (isFilter) {
              const newFilter = {
                ...filter,
                field: id,
                value: object.key,
              };
              onFilter(newFilter);
              onChange(value);
            } else {
              formik.setFieldValue(`${id}`, object.key);
            }
            // console.log(filter);
          }}
        >
          {isFilter ? (
            <Option key="all" value="all">
              All
            </Option>
          ) : (
            ""
          )}
          {options.map((option) => (
            <Option key={option.value} value={option.label}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};
