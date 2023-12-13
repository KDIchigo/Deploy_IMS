import { Tabs } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { SelectInputSetting } from "src/components/Base/BaseSelectInput/SelectInputSetting";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { GeneratePassword } from "src/pages/UserListPage/components/GeneratePassword/GeneratePassword";
import * as Yup from "yup";
import { NewClassStudentsTable } from "./NewClassStudentsTable/NewClassStudentsTable";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import {
  filterUtils,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import { toast } from "react-toastify";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const NewClassStudentExist = ({
  modal,
  setModalStudentExist,
  classId,
  fetchData,
  searchParams,
  settingStudent,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [students, setStudents] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [studentsParams, setStudentsParams] = useState({
    pageNumber: 1,
    pageSize: 8,
    sortString: "",
    filterConditions: [
      {
        field: "class_id",
        value: classId,
        condition: ConditionEnum.NotIn,
      },
      {
        field: "status",
        value: StatusEnum.Active,
        condition: ConditionEnum.Equal,
      },
      {
        field: "setting_id",
        value: settingStudent.setting_id,
        condition: ConditionEnum.Equal,
      },
    ],
  });
  const toggle = () => {
    setModalStudentExist(!modal);
    onReset();
  };
  const fetchStudentData = async (studentsParams) => {
    const { data: studentArr } = await axiosClient.post(
      "/ClassStudent/GetStudents",
      studentsParams
    );
    setStudents(studentArr);

    // for (let student of studentArr.data) {
    //   const { data: studentArray } = await axiosClient.get(
    //     `/User/${student.student_id}`
    //   );
    //   setUsers(users.push(studentArray));
    // }
    // console.log(students, studentArr);
    setLoadingData(true);
    setLoadingTable(false);
    setLoading(false);
  };
  const onPageChange = (pageNumber) => {
    const newSearchParams = { ...studentsParams, pageNumber: pageNumber };
    setStudentsParams(newSearchParams);
    fetchStudentData(newSearchParams);
    // console.log(pageNumber);
  };

  const onReset = () => {
    setLoadingTable(true);
    setLoading(true);
    const newStudentsParams = {
      ...studentsParams,
      filterConditions: [
        {
          field: "class_id",
          value: classId,
          condition: ConditionEnum.NotIn,
        },
        {
          field: "status",
          value: StatusEnum.Active,
          condition: ConditionEnum.Equal,
        },
        {
          field: "setting_id",
          value: settingStudent.setting_id,
          condition: ConditionEnum.Equal,
        },
      ],
    };
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setStudentsParams(newStudentsParams);
    fetchStudentData(newStudentsParams);
  };
  const onSearch = (filter) => {
    setLoadingTable(true);
    searchUtils(filter, studentsParams, setStudentsParams, fetchStudentData);
  };
  const onSearchAll = (filter, options) => {
    setLoadingTable(true);
    searchAllUtils(
      filter,
      options,
      studentsParams,
      setStudentsParams,
      fetchStudentData
    );
  };
  const onFilter = (filter) => {
    filterUtils(filter, studentsParams, setStudentsParams, fetchStudentData);
  };

  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const handleNewClassStudentExist = async (selectedRowKeys) => {
    const value = [];
    for (let select of selectedRowKeys) {
      value.push({ student_id: select, class_id: classId, status: 1 });
      // console.log("value", value);
    }
    setLoadingTable(true);
    const { data, err } = await axiosClient.post(
      "/ClassStudent/InsertMultiple",
      value
    );
    if (err) {
      // toast.error("Add fail!");
      showErrorMessage(err);
      setLoadingTable(false);
      return;
    } else {
      toast.success("Add Successful!");
      setLoadingTable(false);
      fetchData(searchParams);
      fetchStudentData(studentsParams);
      toggle();
    }
  };
  useEffect(() => {
    fetchStudentData(studentsParams);
  }, []);

  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggle} size="xl" centered>
          {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} className="px-3"/> */}
          <form autoComplete="off">
            <ModalHeader toggle={toggle}>New Existing Student</ModalHeader>
            <ModalBody style={{ pointerEvents: loading ? "none" : "auto" }}>
              <div className="row">
                {loadingData && (
                  <NewClassStudentsTable
                    classId={classId}
                    students={students}
                    onPageChange={onPageChange}
                    searchParams={studentsParams}
                    fetchData={fetchStudentData}
                    onSearch={onSearch}
                    onSearchAll={onSearchAll}
                    onReset={onReset}
                    loading={loading}
                    loadingTable={loadingTable}
                    checkedSearchSelect={checkedSearchSelect}
                    onResetSearchSelect={onResetSearchSelect}
                    checkedSearchInput={checkedSearchInput}
                    onResetSearchInput={onResetSearchInput}
                    handleNewClassStudentExist={handleNewClassStudentExist}
                  />
                )}
              </div>
            </ModalBody>
            {/* <ModalFooter>
              <BaseButton type="reset" value="Reset" color="dark" />
              <BaseButton
                nameTitle="ms-3"
                type="submit"
                value="Add New"
                color="secondary"
              />
            </ModalFooter> */}
          </form>
        </Modal>
      </div>
    </>
  );
};
