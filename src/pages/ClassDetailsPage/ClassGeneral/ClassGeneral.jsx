import { CloudSyncOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { SelectInputSetting } from "src/components/Base/BaseSelectInput/SelectInputSetting";
import { SelectInputSubject } from "src/components/Base/BaseSelectInput/SelectInputSubject";
import { SelectInputUser } from "src/components/Base/BaseSelectInput/SelectInputUser";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
import "./ClassGeneral.scss";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";

export const ClassGeneral = ({
  classObj,
  semesters,
  teachers,
  subjects,
  fetchData,
  loadingSemesterApi,
  fetchSystemSetting,
  loadingSubjectApi,
  fetchSubject,
  loadingTeacherApi,
  fetchTeacher,
}) => {
  // console.log(classObj, semesters, teachers, subjects);
  const navigate = useNavigate();
  //   const [classById, setClassById] = useState({});
  //   const fetchClassData = async () => {
  //     const { data: classById } = await axiosClient.get(
  //       `/Class/${classObj.class_id}`
  //     );
  //     setClassById(classById);
  //   };
  //   fetchClassData()
  const [loadingData, setLoadingData] = useState(false);
  const [isView, setIsView] = useState(true);
  const { currentUser, IsTeacher } = HandleAuth();
  const formik = useFormik({
    initialValues: { ...classObj, modified_by: currentUser.email },
    validationSchema: Yup.object({
      class_code: Yup.string()
        .required("Class Code is required")
        .max(100, "Class Code must be lower than 100 characters"),
      subject_id: Yup.string().required("Subject Code is required"),
      semester_id: Yup.string().required("Setting Value is required"),
      teacher_id: Yup.string().required("Teacher is required"),
    }),
    onSubmit: async (values) => {
      // window.alert("Form submitted");
      isView
        ? setIsView(false)
        : swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: `Are you sure to update the class named ${classObj.class_code}?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, update it!",
              cancelButtonText: "No, cancel!",
              reverseButtons: true,
            })
            .then(async (result) => {
              if (result.isConfirmed) {
                setLoadingData(true);
                const { data, err } = await axiosClient.put(
                  `/Class/${values.class_id}`,
                  values
                );
                if (err) {
                  // toast.error(`${classObj.class_code} class was updated fail!`);
                  showErrorMessage(err);
                  setLoadingData(false);
                  return;
                } else {
                  toast.success(
                    `${classObj.class_code} class was updated successfully!`
                  );
                  setIsView(true);
                  setLoadingData(false);
                  fetchData();
                }
              }
            });
    },
  });
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="d-flex flex-column flexGrow_1"
      >
        <h3 className="fw-bold m-0" style={{ paddingBottom: 30 }}>
          Class Details for {classObj.class_code}
        </h3>

        <div
          className="flexGrow_1 "
          style={loadingData ? { pointerEvents: "none" } : {}}
        >
          <div className="row">
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="class_code"
                name="class_code"
                label="Class Code"
                placeholder="Enter Class Code"
                value={formik.values.class_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly={isView}
                classNameInput={
                  formik.errors.class_code && formik.touched.class_code
                    ? "is-invalid"
                    : ""
                }
                important="true"
              />
              {formik.errors.class_code && formik.touched.class_code ? (
                <p className="errorMsg"> {formik.errors.class_code} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Subject Code"
                type="subject"
                id="subject_id"
                placeholder="Subject Code"
                defaultValue={formik.values.subject_code}
                options={subjects}
                loading={loadingSubjectApi}
                loadingApi={loadingSubjectApi}
                onClick={fetchSubject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                status={
                  formik.errors.subject_id && formik.touched.subject_id
                    ? "error"
                    : ""
                }
                disabled={isView}
                important="true"
                formik={formik}
              />
              {formik.errors.subject_id && formik.touched.subject_id ? (
                <p className="errorMsg"> {formik.errors.subject_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Semester"
                type="setting"
                id="semester_id"
                placeholder="Semester"
                defaultValue={formik.values.semester_name}
                loading={loadingSemesterApi}
                loadingApi={loadingSemesterApi}
                onClick={fetchSystemSetting}
                options={semesters}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isView}
                status={
                  formik.errors.semester_id && formik.touched.semester_id
                    ? "error"
                    : ""
                }
                important="true"
                formik={formik}
              />
              {formik.errors.semester_id && formik.touched.semester_id ? (
                <p className="errorMsg"> {formik.errors.semester_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Teacher"
                type="user"
                id="teacher_id"
                placeholder="Teacher"
                defaultValue={formik.values.teacher_name}
                options={teachers}
                loading={loadingTeacherApi}
                loadingApi={loadingTeacherApi}
                onClick={fetchTeacher}
                disabled={isView}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                status={
                  formik.errors.teacher_id && formik.touched.teacher_id
                    ? "error"
                    : ""
                }
                important="true"
                isFilter={false}
                formik={formik}
              />
              {formik.errors.teacher_id && formik.touched.teacher_id ? (
                <p className="errorMsg"> {formik.errors.teacher_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="class_convert_token"
                name="class_convert_token"
                label="Access Token"
                placeholder="Enter Access Token"
                value={formik.values.class_convert_token}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.class_convert_token &&
                  formik.touched.class_convert_token
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.class_convert_token &&
              formik.touched.class_convert_token ? (
                <p className="errorMsg">
                  {" "}
                  {formik.errors.class_convert_token}{" "}
                </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="number"
                id="class_convert_id"
                name="class_convert_id"
                label="Gitlab Class(groups) ID"
                placeholder="Gitlab Class(groups) ID"
                value={formik.values.class_convert_id}
                readOnly={isView}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.class_convert_id &&
                  formik.touched.class_convert_id
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.class_convert_id &&
              formik.touched.class_convert_id ? (
                <p className="errorMsg"> {formik.errors.class_convert_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseDatePicker
                id="modified_date"
                label="Last Update"
                name="modified_date"
                className="w-100 px-2 datePicker"
                defaultValue={formik.values.modified_date}
                placeholder="It hasn't been updated"
                value={formik.values.modified_date}
                onChange={formik.handleChange}
                disabled={true}
                classNameInput={
                  formik.errors.modified_date && formik.touched.modified_date
                    ? "is-invalid"
                    : ""
                }
                status={
                  formik.errors.modified_date && formik.touched.modified_date
                    ? "error"
                    : ""
                }
                formik={formik}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-1 px-3">
              {/* <BaseRadio label="Status" important="true" formik={formik} type="status"/> */}
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                feature="class"
                isLabel={true}
                disabled={isView || IsTeacher()}
                label="Status"
                important="true"
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-3 px-3">
              <BaseTextArea
                formik={formik}
                disabled={isView}
                label="Description"
                placeholder="Description"
                important="false"
                row="5"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 px-3 mt-5">
            {loadingData ? (
              isView ? (
                <BaseButton
                  nameTitle="float-start btnLoading1Class"
                  type="submit"
                  value="Update"
                  color="info"
                />
              ) : (
                <BaseButton
                  nameTitle="float-start btnLoading1Class"
                  type="submit"
                  color="secondary"
                  icon={<LoadingOutlined />}
                  disabled={true}
                />
              )
            ) : (
              <>
                {isView ? (
                  <BaseButton
                    nameTitle="float-start btnLoading1Class"
                    type="submit"
                    value="Update"
                    color="info"
                  />
                ) : (
                  <BaseButton
                    nameTitle="float-start btnLoading1Class"
                    type="submit"
                    value="Update"
                    color="secondary"
                  />
                )}
              </>
            )}
            {/* <BaseButton
              nameTitle="float-start ms-2"
              type="button"
              value="Synchronize"
              color="purple"
              isIconLeft={true}
              icon={<CloudSyncOutlined size={20} />}
              onClick={() =>
                handleClassSynchronize(
                  project.project_convert_id,
                  project.project_convert_token,
                  project.project_id
                )
              }
              disabled={!isView}
            /> */}
          </div>
        </div>
      </form>
    </>
  );
};
