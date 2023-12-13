import { DatePicker } from "antd";
import { useState } from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { SelectInputSetting } from "src/components/Base/BaseSelectInput/SelectInputSetting";
import { SelectInputSettingGroup } from "src/components/Base/BaseSelectInput/SelectInputSettingGroup";
import { SelectInputStatus } from "src/components/Base/BaseSelectInput/SelectInputStatus";

const { RangePicker } = DatePicker;
const status = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 0,
    label: "Inactive",
  },
];
const data_group = [
  {
    value: 1,
    label: "Role",
  },
  {
    value: 2,
    label: "Semester",
  },
  {
    value: 3,
    label: "Email Domain",
  },
];
export const FilterSetting = ({
  settings,
  onFilter,
  fetchData,
  searchParams,
  onReset,
  dataGroup,
  checkedSettingGroup,
  checkedStatus,
  onChangeSettingGroup,
  onChangeStatus,
  handleSaveFilter,
}) => {
  return (
    <>
      {console.log(data_group)}
      <div className=" row">
        <SelectInputStatus
          label="Status"
          id="status"
          classNameDiv="col-11 mx-auto p-0"
          placeholder="Status"
          options={status}
          // important="true"
          isFilter={true}
          onFilter={onFilter}
          checked={checkedStatus}
          onChange={onChangeStatus}
        />
        <SelectInputSettingGroup
          label="Setting Group"
          id="data_group"
          classNameDiv="col-11 mx-auto mt-3 p-0"
          placeholder="Setting Group"
          options={data_group}
          // important="true"
          isFilter={true}
          onFilter={onFilter}
          checked={checkedSettingGroup}
          onChange={onChangeSettingGroup}
          dataGroup={dataGroup}
        />

        <div className="col-11 mx-auto p-0 mt-3">
          <BaseButton
            nameTitle="float-end my-0 ms-3 cardBtn"
            value="Save"
            color="success"
            onClick={() => handleSaveFilter()}
          />
          <BaseButton
            nameTitle="float-end my-0 cardBtn"
            type="button"
            value="Reset"
            color="dark"
            onClick={() => {
              onReset();
            }}
          />
        </div>
        {/* <RangePicker
          showTime
          defaultValue={dayjs("2023-10-01 21:57:00", "2023-10-03 21:57:00")}
          className="col-11 mx-auto mt-3 py-2"
          onChange={(e) => {
            console.log(e.target.value);
          }}
        /> */}
      </div>
    </>
  );
};
