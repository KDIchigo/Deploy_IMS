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
export const SearchFilterAll = ({
  issueSettings,
  issueRequirements,
  students,
  onFilter,
  fetchData,
  searchParams,
  onReset,
  checkedIssueStatus,
  onChangeIssueStatus,
  checkedIssueType,
  onChangeIssueType,
  checkedIssueWorkProcess,
  onChangeIssueWorkProcess,
  checkedAuthor,
  onChangeAuthor,
  checkedAssignee,
  onChangeAssignee,
  checkedRequirement,
  onChangeRequirement,
  handleSaveFilter,
}) => {
  return (
    <>
      <div className="d-flex row">
        <BaseSelectInput
          label="Issue Type"
          id="issue_type"
          type="issue_group"
          placeholder="Issue Type"
          classNameDiv="col-5 mx-auto p-0 mt-3"
          options={issueSettings.issue_types}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedIssueType}
          onChange={onChangeIssueType}
        />
        <BaseSelectInput
          label="Creator"
          id="created_by"
          type="class_student"
          placeholder="Creator"
          classNameDiv="col-5 mx-auto p-0 mt-3"
          options={students}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedAuthor}
          onChange={onChangeAuthor}
        />
        <BaseSelectInput
          label="Issue Status"
          id="issue_status"
          type="issue_group"
          placeholder="Issue Status"
          classNameDiv="col-5 mx-auto p-0 mt-3"
          options={issueSettings.issue_statuses}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedIssueStatus}
          onChange={onChangeIssueStatus}
        />
        <BaseSelectInput
          label="Work Process"
          id="work_process"
          type="issue_group"
          placeholder="Work Process"
          classNameDiv="col-5 mx-auto p-0 mt-3"
          options={issueSettings.work_process}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedIssueWorkProcess}
          onChange={onChangeIssueWorkProcess}
        />
        <BaseSelectInput
          label="Requirement"
          id="parent_id"
          type="issue"
          placeholder="Requirement"
          classNameDiv="col-5 mx-auto p-0 mt-3"
          options={issueRequirements}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedAssignee}
          onChange={onChangeAssignee}
        />
        <BaseSelectInput
          label="Assignee"
          id="assignee"
          type="class_student"
          placeholder="Assignee"
          classNameDiv="col-5 mx-auto p-0 mt-3"
          options={students}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedRequirement}
          onChange={onChangeRequirement}
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
