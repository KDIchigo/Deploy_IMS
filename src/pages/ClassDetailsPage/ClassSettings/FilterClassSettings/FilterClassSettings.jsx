import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { SelectInputStatus } from "src/components/Base/BaseSelectInput/SelectInputStatus";
import { SelectInputSetting } from "src/components/Base/BaseSelectInput/SelectInputSetting";
import { SelectInputSubject } from "src/components/Base/BaseSelectInput/SelectInputSubject";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { SelectInputIssueGroup } from "src/components/Base/BaseSelectInput/SelectInputIssueGroup";

const { RangePicker } = DatePicker;
const status = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 2,
    label: "Pending",
  },
  {
    value: 0,
    label: "Inactive",
  },
];
const issue_group = [
  {
    value: 1,
    label: "Issue Type",
  },
  {
    value: 2,
    label: "Issue Status",
  },
  {
    value: 3,
    label: "Work Process",
  },
];
export const FilterClassSettings = ({
  onFilter,
  fetchData,
  searchParams,
  onReset,
  checkedSetting,
  checkedStatus,
  onChangeSetting,
  onChangeStatus,
  issueGroup,
  classSettings,
}) => {
  // const getUnique = (arr, issue_group) => {
  //   const unique = arr
  //     .map((e) => e[issue_group])

  //     // store the keys of the unique objects
  //     .map((e, i, final) => final.indexOf(e) === i && i)

  //     // eliminate the dead keys & store unique objects
  //     .filter((e) => arr[e])
  //     .map((e) => arr[e]);

  //   return unique;
  // };
  return (
    <>
      <div className="d-flex row">
        <SelectInputStatus
          label="Status"
          type="status"
          id="status"
          classNameDiv="col-11 mx-auto p-0"
          placeholder="Status"
          options={status}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedStatus}
          onChange={onChangeStatus}
        />

        <SelectInputIssueGroup
          label="Setting Group"
          id="issue_group"
          classNameDiv="col-11 mx-auto p-0 mt-3"
          placeholder="Setting Group"
          options={issue_group}
          onFilter={onFilter}
          issueGroup={issueGroup}
          isFilter={true}
          checked={checkedSetting}
          onChange={onChangeSetting}
        />

        <div className="col-11 mx-auto p-0 mt-3">
          <BaseButton
            nameTitle="float-end my-0 ms-3 cardBtn"
            value="Save"
            color="success"
            onClick={() => fetchData(searchParams)}
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
