import { DatePicker } from "antd";
import { useState } from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
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

export const FilterAssignment = ({
  assignments,
  onFilter,
  fetchData,
  searchParams,
  onReset,
  checkedStatus,
  onChangeStatus,
  handleSaveFilter,
}) => {
  return (
    <>
      {/* {console.log(assignments)} */}
      <div className=" row">
        <SelectInputStatus
          label="Status"
          id="status"
          classNameDiv="col-11 mx-auto p-0"
          placeholder="Status"
          options={status}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedStatus}
          onChange={onChangeStatus}
        />

        <div className="col-11 mx-auto p-0 mt-3">
          <BaseButton
            nameTitle="float-end my-0 ms-3 cardBtn"
            value="Save"
            color="success"
            onClick={handleSaveFilter}
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
