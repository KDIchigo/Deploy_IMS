import { Spin } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { SelectInputAssignees } from "src/components/Base/BaseSelectInput/SelectInputAssignees";
import { SelectInputMilestone } from "src/components/Base/BaseSelectInput/SelectInputMilestone";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";

export const IssueGeneralCopy = ({
  fetchData,
  searchParams,
  students,
  issueObj,
  milestones,
  issueSettings,
}) => {
  const [assigneeValue, setAssigneeValue] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const handleAssigneeValue = (value) => {
    setAssigneeValue(value);
  };
  // console.log(issueObj);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      ...issueObj,
      modified_by: currentUser.email,
    },
    validationSchema: Yup.object({
      issue_title: Yup.string()
        .required("Issue Title is required")
        .max(1023, "Issue Title must be lower than 1023 characters"),
      issue_status: Yup.string()
        .required("Issue Status is required")
        .max(36, "Issue Status must be lower than 36 characters"),
      work_process: Yup.string()
        .required("Work Process is required")
        .max(36, "Work Process must be lower than 36 characters"),
      // assignee_id: Yup.string().required("Issue Manager is required"),
    }),
    onSubmit: async (values) => {
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "Are you sure to update issue?",
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: "Yes,update it!",
          cancelButtonText: "No, cancel!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            setLoadingData(true);
            const { err } = await axiosClient.put(
              `/Issue/${values.issue_id}`,
              values
            );

            if (err) {
              toast.error("Update issue fail!");
              setLoadingData(false);
            } else {
              toast.success("Update issue successfully!");
              setLoadingData(false);
              fetchData(searchParams);
            }
          }
        });

      console.log(values);
    },
  });
  // console.log(issueSettings);

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="flex_height d-flex flex-column flexGrow_1"
      >
        <div
          className="flexGrow_1 "
          style={loadingData ? { pointerEvents: "none" } : {}}
        >
          <div className="row">
            <div className="col-md-12 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="issue_title"
                name="issue_title"
                label="Issue Title "
                placeholder="Enter Issue Title"
                value={formik.values.issue_title}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.issue_title && formik.touched.issue_title
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.issue_title && formik.touched.issue_title ? (
                <p className="errorMsg"> {formik.errors.issue_title} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="issue_type_value"
                name="issue_type_value"
                label="Issue Type "
                placeholder="Enter Issue Type"
                value={formik.values.issue_type_value}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.issue_type_value &&
                  formik.touched.issue_type_value
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
                readOnly={true}
              />
              {formik.errors.issue_type_value &&
              formik.touched.issue_type_value ? (
                <p className="errorMsg"> {formik.errors.issue_type_value} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Issue Status"
                id="issue_status_value"
                type="issue_group"
                defaultValue={
                  formik.values.issue_status_value === ""
                    ? undefined
                    : formik.values.issue_status_value
                }
                options={issueSettings.issue_statuses}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Issue Status"
                status={
                  formik.errors.issue_id && formik.touched.issue_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.issue_id && formik.touched.issue_id ? (
                <p className="errorMsg"> {formik.errors.issue_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Work Process"
                id="work_process_value"
                type="issue_group"
                defaultValue={
                  formik.values.work_process_value === ""
                    ? undefined
                    : formik.values.work_process_value
                }
                options={issueSettings.work_process}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Work Process"
                status={
                  formik.errors.issue_id && formik.touched.issue_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.issue_id && formik.touched.issue_id ? (
                <p className="errorMsg"> {formik.errors.issue_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <SelectInputMilestone
                label="Project Milestone"
                id="milestone_id"
                defaultValue={formik.values.milestone_name}
                options={milestones}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Project Milestone"
                status={
                  formik.errors.milestone_id && formik.touched.milestone_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.milestone_id && formik.touched.milestone_id ? (
                <p className="errorMsg"> {formik.errors.milestone_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            {/* {console.log(students)} */}
            {/* <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Assignee"
                id="assignee_name"
                type="class_student"
                defaultValue={formik.values.assignee_name}
                options={students}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Assignee"
                status={
                  formik.errors.assignee && formik.touched.assignee
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.assignee && formik.touched.assignee ? (
                <p className="errorMsg"> {formik.errors.assignee} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div> */}
            <div className="col-md-6 col-sm-12 px-3">
              <SelectInputAssignees
                id="assignee"
                name="assignee"
                label="Assignee"
                important="true"
                placeholder="Enter Assignee"
                defaultValue={
                  formik.values.assignee === ""
                    ? undefined
                    : formik.values.assignee
                }
                students={students}
                onChange={formik.handleChange}
                handleAssigneeValue={handleAssigneeValue}
                formik={formik}
                checked={
                  formik.values.student_name === ""
                    ? undefined
                    : formik.values.student_name
                }
                isFilter={false}
                status={
                  formik.errors.assignee && formik.touched.assignee
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
            </div>
            {/* {console.log(formik.values.due_date)} */}
            <div className="col-md-6 col-sm-12 px-3">
              <BaseDatePicker
                id="due_date"
                label="Due Date"
                name="due_date"
                className="w-100 px-2 datePicker"
                valueDueDate={formik.values.due_date}
                value={formik.values.due_date}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.due_date && formik.touched.due_date
                    ? "is-invalid"
                    : ""
                }
                important="true"
                formik={formik}
                onBlur={formik.handleBlur}
              />
              {formik.errors.due_date && formik.touched.due_date ? (
                <p className="errorMsg"> {formik.errors.due_date} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-12 col-sm-12 mt-0 px-3">
              <BaseTextArea
                formik={formik}
                label="Description"
                placeholder="Description"
                important="false"
                row={4}
              />
            </div>
            {/* <div className="col-md-6 col-sm-12 mt-1 px-3">
              <BaseRadio formik={formik} type="status" />
            </div> */}
          </div>
          <div className="row">
            <div className="col-12 px-3">
              {loadingData ? (
                <Spin size="large" width="50px" height="50px" />
              ) : (
                <BaseButton
                  nameTitle="float-start mt-4"
                  type="submit"
                  value="Update"
                  color="secondary"
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
