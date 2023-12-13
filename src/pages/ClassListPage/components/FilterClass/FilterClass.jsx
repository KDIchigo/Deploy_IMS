import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { SelectInputStatus } from "src/components/Base/BaseSelectInput/SelectInputStatus";
import { SelectInputSetting } from "src/components/Base/BaseSelectInput/SelectInputSetting";
import { SelectInputSubject } from "src/components/Base/BaseSelectInput/SelectInputSubject";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { SelectInputUser } from "src/components/Base/BaseSelectInput/SelectInputUser";

const { RangePicker } = DatePicker;
const status = [
  {
    value: 1,
    label: "Started",
  },
  {
    value: 2,
    label: "Pending",
  },
  {
    value: 0,
    label: "Cancelled",
  },
];
export const FilterClass = ({
  teachers,
  subjects,
  semesters,
  onFilter,
  fetchData,
  searchParams,
  onReset,
  checkedSetting,
  checkedStatus,
  onChangeSetting,
  onChangeStatus,
  checkedSubject,
  onChangeSubject,
  onChangeTeacher,
  checkedTeacher,
  handleSaveFilter,
}) => {
  return (
    <>
      <div className="d-flex row">
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
        <BaseSelectInput
          label="Semester"
          id="semester_id"
          type="setting"
          classNameDiv="col-11 mx-auto p-0 mt-3"
          placeholder="Semester"
          options={semesters}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedSetting}
          onChange={onChangeSetting}
        />
        <SelectInputSubject
          label="Subject Code"
          id="subject_id"
          classNameDiv="col-11 mx-auto p-0 mt-3"
          type="subject"
          placeholder="Subject Code"
          options={subjects}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedSubject}
          onChange={onChangeSubject}
        />
        <SelectInputUser
          label="Teacher Name"
          id="teacher_id"
          classNameDiv="col-11 mx-auto p-0 mt-3"
          type="teacher"
          placeholder="Teacher Name"
          options={teachers}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedTeacher}
          onChange={onChangeTeacher}
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
