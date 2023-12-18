import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { SelectInputStatus } from "src/components/Base/BaseSelectInput/SelectInputStatus";
import { SelectInputSetting } from "src/components/Base/BaseSelectInput/SelectInputSetting";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";

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
export const FilterUser = ({
  roles,
  onFilter,
  fetchData,
  searchParams,
  onReset,
  loadingSettingApi,
  fetchDataSelect,
  checkedSetting,
  checkedStatus,
  onChangeSetting,
  onChangeStatus,
  handleSaveFilter,
  param,
}) => {
  return (
    <>
      <div className="d-flex row">
        <SelectInputStatus
          label="Status"
          id="status"
          classNameDiv="col-11 mx-auto p-0 "
          placeholder="Status"
          options={status}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedStatus}
          onChange={onChangeStatus}
        />
        <BaseSelectInput
          label="Role"
          type="setting"
          id="setting_id"
          classNameDiv="col-11 mx-auto p-0 mt-3"
          placeholder="Role"
          onClick={fetchDataSelect}
          loadingApi={loadingSettingApi}
          loading={loadingSettingApi}
          options={roles.filter((ele) => ele.status === StatusEnum.Active)}
          isFilter={true}
          onFilter={onFilter}
          checked={checkedSetting}
          onChange={onChangeSetting}
          param={param}
        />
        <div className="col-11 mx-auto p-0 mt-3">
          <BaseButton
            nameTitle="float-end my-0 ms-3 cardBtn"
            value="Save"
            color="success"
            onClick={() => {
              handleSaveFilter();
            }}
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
