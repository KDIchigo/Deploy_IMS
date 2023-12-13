import React, { useState } from "react";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
import { SelectInputStatus } from "src/components/Base/BaseSelectInput/SelectInputStatus";
const status = [
  {
    value: 1,
    label: "In Progress",
  },
  {
    value: 0,
    label: "Closed",
  },
  {
    value: 2,
    label: "Pending",
  },
];
export const FilterProjectMilestone = ({
  projectId,
  onFilter,
  onDateFilter,
  fetchData,
  searchParams,
  onReset,
  checkedFromDate,
  checkedToDate,
  checkedStatus,
  onChangeFromDate,
  onChangeToDate,
  onChangeStatus,
  disabledFromDate,
  disabledToDate,
  handleSaveFilter,
}) => {
  return (
    <>
      <div className="row">
        <div className="col-md-5 col-sm-5 mx-auto p-0">
          <BaseDatePicker
            id="from_date"
            label="From Date"
            value=""
            isFilter={true}
            onFilter={onDateFilter}
            className="w-100 px-2 datePicker"
            checked={checkedFromDate}
            onChange={onChangeFromDate}
            disabledDate={disabledFromDate}
          />
        </div>
        <div className="col-md-5 col-sm-5 mx-auto p-0">
          <BaseDatePicker
            id="to_date"
            isFilter={true}
            value=""
            onFilter={onDateFilter}
            label="To Date"
            className="w-100 px-2 datePicker"
            checked={checkedToDate}
            onChange={onChangeToDate}
            disabledDate={disabledToDate}
          />
        </div>
        <SelectInputStatus
          label="Status"
          id="status"
          classNameDiv="col-11 mx-auto p-0 mt-3"
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
      </div>
    </>
  );
};
