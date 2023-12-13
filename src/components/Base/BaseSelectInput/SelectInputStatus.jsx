import { Select } from "antd";
import { ConditionEnum, FilterOperatorEnum, StatusEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputStatus = ({
  label,
  classNameDiv,
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
}) => {
  const filter = {
    field: "",
    value: "",
    condition: ConditionEnum.Equal,
  };
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
          defaultValue={defaultValue}
          value={checked}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(value, object) => {
            if (isFilter) {
              const newFilter = {
                ...filter,
                field: "status",
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
          {isFilter === true ? (
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
          {/* <Option key={StatusEnum.Active} value="Active">Active</Option>
          <Option key={StatusEnum.Inactive} value="Inactive">Inactive</Option>
          <Option key={StatusEnum.Pending} value="Pending">Pending</Option> */}
        </Select>
      </div>
    </>
  );
};
