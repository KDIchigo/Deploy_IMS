import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { SelectInputStatus } from "src/components/Base/BaseSelectInput/SelectInputStatus";
import { SelectInputSubject } from "src/components/Base/BaseSelectInput/SelectInputSubject";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { SelectInputUser } from "src/components/Base/BaseSelectInput/SelectInputUser";

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

export const FilterSubject = ({
  users,
  // subjects,
  onFilter,
  fetchData,
  searchParams,
  onReset,
  fetchSelectData,
  loadingManagerApi,
  param,
  checkedAssignee,
  checkedStatus,
  onChangeAssignee,
  onChangeStatus,
  handleSaveFilter,
}) => {
  return (
    <>
      {/* {console.log(users)} */}
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
        <SelectInputUser
          label="Subject Manager"
          id="assignee_id"
          classNameDiv="col-11 mx-auto mt-3 p-0"
          placeholder="Subject Manager"
          options={users}
          // important="true"
          loadingApi={loadingManagerApi}
          loading={loadingManagerApi}
          onClick={() => fetchSelectData(param)}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedAssignee}
          onChange={onChangeAssignee}
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
