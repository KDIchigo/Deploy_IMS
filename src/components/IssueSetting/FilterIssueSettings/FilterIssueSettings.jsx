import { DatePicker } from "antd";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { SelectInputIssueGroup } from "src/components/Base/BaseSelectInput/SelectInputIssueGroup";
import { SelectInputStatus } from "src/components/Base/BaseSelectInput/SelectInputStatus";
import { IssueSettingEnum } from "src/enum/Enum";

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
const issue_group = [
  {
    value: IssueSettingEnum.IssueType,
    label: "Issue Type",
  },
  {
    value: IssueSettingEnum.IssueStatus,
    label: "Issue Status",
  },
  {
    value: IssueSettingEnum.WorkProcess,
    label: "Work Process",
  },
  {
    value: IssueSettingEnum.Others,
    label: "Others",
  },
];
export const FilterIssueSettings = ({
  onFilter,
  fetchData,
  searchParams,
  onReset,
  checkedSetting,
  checkedStatus,
  onChangeSetting,
  onChangeStatus,
  issueGroup,
  issueSettings,
  id,
  typeIssue,
  selectTypeIssue,
  handleSaveFilter,
}) => {
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
          isFilter={true}
          issueGroup={issueGroup}
          checked={checkedSetting}
          onChange={onChangeSetting}
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
