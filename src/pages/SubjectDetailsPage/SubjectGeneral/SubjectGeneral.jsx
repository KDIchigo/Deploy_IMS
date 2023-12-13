import { Spin } from "antd";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { SelectInputUser } from "src/components/Base/BaseSelectInput/SelectInputUser";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import * as Yup from "yup";
import "./SubjectGeneral.scss";
import { HandleAuth } from "src/utils/handleAuth";
import { CloudSyncOutlined, LoadingOutlined } from "@ant-design/icons";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const SubjectGeneral = ({ users, subjectObj, fetchData, code }) => {
  const navigate = useNavigate();
  const { currentUser } = HandleAuth();
  const [isView, setIsView] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: {
      ...subjectObj,
      modified_by: currentUser.email,
    },
    validationSchema: Yup.object({
      subject_name: Yup.string()
        .required("Subject Name is required")
        .max(255, "Subject Name must be lower than 255 characters"),
      subject_code: Yup.string()
        .required("Subject Code is required")
        .max(100, "Subject Code must be lower than 100 characters"),
      assignee_id: Yup.string().required("Subject Manager is required"),
    }),
    onSubmit: async (values) => {
      isView
        ? setIsView(false)
        : swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: `Are you sure to update the subject named ${subjectObj.subject_code}?`,
              icon: "warning",
              showCancelButton: true,
              reverseButtons: true,
              confirmButtonText: "Yes,update it!",
              cancelButtonText: "No, cancel!",
            })
            .then(async (result) => {
              // console.log(result);
              const { assignee_name, ...value } = values;
              if (result.isConfirmed) {
                setLoadingData(true);
                const { data, err } = await axiosClient.put(
                  `/Subject/${value.subject_id}`,
                  value
                );
                if (err) {
                  // toast.error(`The subject named ${code} was updated fail!`);
                  showErrorMessage(err);
                  setLoadingData(false);
                } else {
                  toast.success(
                    `The subject named ${subjectObj.subject_code} was updated successfully!`
                  );
                  setLoadingData(false);
                  setIsView(true);
                  fetchData();
                }
              }
            });
      // console.log(values);
    },
  });
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className=" d-flex flex-column flexGrow_1"
      >
        <h3 className="fw-bold m-0" style={{ paddingBottom: 30 }}>
          {subjectObj.subject_name} Details
        </h3>

        <div
          className="flexGrow_1 "
          style={loadingData ? { pointerEvents: "none" } : {}}
        >
          <div className="row">
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="subject_code"
                name="subject_code"
                label="Subject Code"
                placeholder="Enter Subject Code"
                value={formik.values.subject_code}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.subject_code && formik.touched.subject_code
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.subject_code && formik.touched.subject_code ? (
                <p className="errorMsg"> {formik.errors.subject_code} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="subject_name"
                name="subject_name"
                label="Subject Name"
                placeholder="Enter Subject Name"
                value={formik.values.subject_name}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.subject_name && formik.touched.subject_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.subject_name && formik.touched.subject_name ? (
                <p className="errorMsg"> {formik.errors.subject_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <SelectInputUser
                label="Subject Manager"
                id="assignee_id"
                defaultValue={formik.values.assignee_name}
                options={users}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                isFilter={false}
                disabled={isView}
                placeholder="Subject Manager"
                status={
                  formik.errors.assignee_id && formik.touched.assignee_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.assignee_id && formik.touched.assignee_id ? (
                <p className="errorMsg"> {formik.errors.assignee_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mt-3 px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
                disabled={isView}
              />
            </div>
            {/* <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="access_token"
                name="access_token"
                label="Access Token"
                placeholder="Enter Access Token"
                value={formik.values.access_token}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.access_token && formik.touched.access_token
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.access_token && formik.touched.access_token ? (
                <p className="errorMsg"> {formik.errors.access_token} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="gitlab_id"
                name="gitlab_id"
                label="Gitlab project(groups) id"
                placeholder="Gitlab project(groups) id"
                value={formik.values.gitlab_id}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.gitlab_id && formik.touched.gitlab_id
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.gitlab_id && formik.touched.gitlab_id ? (
                <p className="errorMsg"> {formik.errors.gitlab_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div> */}
            <div className="col-md-12 col-sm-12 mt-0 px-3">
              <BaseTextArea
                formik={formik}
                disabled={isView}
                label="Description"
                placeholder="Description"
                important="false"
                row={5}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mt-4 px-3">
            {loadingData ? (
              <BaseButton
                nameTitle="float-start mt-4 btnLoadingSubject "
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true} // Tắt khả năng click khi đang loading
              />
            ) : (
              <BaseButton
                nameTitle="float-start mt-4 btnUpdate"
                type="submit"
                value="Update"
                color="secondary"
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
};
