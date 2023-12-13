import { ConfigProvider, Select } from "antd";
import { ConditionEnum } from "src/enum/Enum";
const { Option } = Select;

export const SelectInputSetting = ({
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
  isFilterBasic,
}) => {
  const className = `selectDesign ${disabled ? "disable" : ""}`;
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
          className={className}
          defaultValue={defaultValue}
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
            } else if (isFilterBasic) {
              console.log(object.key);
            } else {
              // formik.setFieldValue(`setting_id`, object.key);
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
            <Option
              className="optionSelect"
              key={option.setting_id}
              value={option.setting_value}
            >
              {option.setting_value}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};
