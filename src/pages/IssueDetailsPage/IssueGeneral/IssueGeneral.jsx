import { LoadingOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { SelectInputMilestone } from "src/components/Base/BaseSelectInput/SelectInputMilestone";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
import "./IssueGeneral.scss";
import { SelectInputAssignee } from "src/components/Base/BaseSelectInput/SelectInputAssignee";

export const IssueGeneral = ({
  students,
  issueRequirements,
  issueObj,
  milestones,
  issueSettings,
  handleUpdateIssue,
  issues,
  fetchIssueRequirement,
  loadingIssueRequirementApi,
  fetchIssueSetting,
  loadingIssueSettingApi,
  fetchMilestone,
  loadingMilestoneApi,
  fetchAssignee,
  loadingAssigneeApi,
}) => {
  const navigate = useNavigate();
  const [assigneeValue, setAssigneeValue] = useState([]);
  const [isView, setIsView] = useState(true);
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
      milestone_id: Yup.string().required("Project Milestone is required"),
      // due_date: Yup.string().required("Due Date is required"),
      // issue_type: Yup.string()
      //   .required("Issue Type is required")
      //   .max(36, "Issue Type must be lower than 36 characters"),
      // issue_status: Yup.string()
      //   .required("Issue Status is required")
      //   .max(36, "Issue Status must be lower than 36 characters"),
      // work_process: Yup.string()
      //   .required("Work Process is required")
      //   .max(36, "Work Process must be lower than 36 characters"),
      // assignee_id: Yup.string().required("Issue Manager is required"),
    }),
    validate: (values) => {
      const errors = {};
      if (!isView) {
        if (values.due_date === null) {
          errors.due_date = "Due Date is required";
        }
        if (values.issue_type === null) {
          errors.issue_type = "Issue Type is required";
        }
        if (values.issue_status === null) {
          errors.issue_status = "Issue Status is required";
        }
        if (values.work_process === null) {
          errors.work_process = "Work Process is required";
        }
      }
      return errors;
    },
    onSubmit: async (values) => {
      isView
        ? setIsView(false)
        : swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: `Are you sure to update the issue named ${issueObj.issue_title}?`,
              icon: "warning",
              showCancelButton: true,
              reverseButtons: true,
              confirmButtonText: "Yes,update it!",
              cancelButtonText: "No, cancel!",
            })
            .then(async (result) => {
              if (result.isConfirmed) {
                handleUpdateIssue(values, setLoadingData, setIsView);
              }
            });

      // console.log(values);
    },
  });
  // console.log(issueSettings);
  // console.log(isView)
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
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="issue_title"
                name="issue_title"
                label="Issue Title "
                placeholder="Enter Issue Title"
                value={formik.values.issue_title}
                onChange={formik.handleChange}
                readOnly={isView}
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
                id="created_by"
                name="created_by"
                label="Created"
                placeholder="Enter Created"
                value={formik.values.created_by}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.created_by && formik.touched.created_by
                    ? "is-invalid"
                    : ""
                }
                important="true"
                readOnly={true}
                onBlur={formik.handleBlur}
              />
              {formik.errors.created_by && formik.touched.created_by ? (
                <p className="errorMsg"> {formik.errors.created_by} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                id="parent_id"
                name="parent_id"
                label="Issue Requirement"
                type="issue"
                defaultValue={
                  formik.values.parent_title === ""
                    ? undefined
                    : formik.values.parent_title
                }
                options={issueRequirements}
                onClick={fetchIssueRequirement}
                loading={loadingIssueRequirementApi}
                loadingApi={loadingIssueRequirementApi}
                onChange={formik.handleChange}
                // important="true"
                formik={formik}
                isFilter={false}
                disabled={isView}
                placeholder="Issue Requirement"
                status={
                  formik.errors.parent_id && formik.touched.parent_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.parent_id && formik.touched.parent_id ? (
                <p className="errorMsg"> {formik.errors.parent_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-3 col-sm-12 px-3">
              <BaseSelectInput
                id="issue_type"
                name="issue_type"
                label="Issue Type"
                type="issue_group"
                defaultValue={
                  formik.values.issue_type_value === ""
                    ? undefined
                    : formik.values.issue_type_value
                }
                options={issueSettings.issue_types}
                onClick={fetchIssueSetting}
                loading={loadingIssueSettingApi}
                loadingApi={loadingIssueSettingApi}
                onChange={formik.handleChange}
                disabled={isView}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Issue Type"
                status={
                  formik.errors.issue_type && formik.touched.issue_type
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.issue_type && formik.touched.issue_type ? (
                <p className="errorMsg"> {formik.errors.issue_type} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-3 col-sm-12 px-3">
              <BaseSelectInput
                label="Work Process"
                id="work_process"
                type="issue_group"
                defaultValue={
                  formik.values.work_process_value === ""
                    ? undefined
                    : formik.values.work_process_value
                }
                options={issueSettings.work_process}
                onClick={fetchIssueSetting}
                loading={loadingIssueSettingApi}
                loadingApi={loadingIssueSettingApi}
                onChange={formik.handleChange}
                disabled={isView}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Work Process"
                status={
                  formik.errors.work_process && formik.touched.work_process
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.work_process && formik.touched.work_process ? (
                <p className="errorMsg"> {formik.errors.work_process} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-3 col-sm-12 px-3">
              <SelectInputMilestone
                label="Project Milestone"
                id="milestone_id"
                defaultValue={formik.values.milestone_name}
                onClick={fetchMilestone}
                loading={loadingMilestoneApi}
                loadingApi={loadingMilestoneApi}
                options={milestones}
                onChange={formik.handleChange}
                disabled={isView}
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
            <div className="col-md-3 col-sm-12 px-3">
              <SelectInputAssignee
                label="Assignee"
                id="assignee"
                type="class_student"
                defaultValue={formik.values.assignee_name}
                onClick={fetchAssignee}
                loading={loadingAssigneeApi}
                loadingApi={loadingAssigneeApi}
                options={students}
                onChange={formik.handleChange}
                disabled={isView}
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
            </div>
            <div className="col-md-3 col-sm-12 px-3">
              <BaseDatePicker
                id="due_date"
                label="Due Date"
                name="due_date"
                className="w-100 px-2 datePicker"
                defaultValue={formik.values.due_date}
                value={formik.values.due_date}
                onChange={formik.handleChange}
                disabled={isView}
                classNameInput={
                  formik.errors.due_date && formik.touched.due_date
                    ? "is-invalid"
                    : ""
                }
                status={
                  formik.errors.due_date && formik.touched.due_date
                    ? "error"
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
            <div className="col-md-3 col-sm-12 px-3">
              <BaseSelectInput
                label="Issue Status"
                id="issue_status"
                type="issue_group"
                defaultValue={
                  formik.values.issue_status_value === ""
                    ? undefined
                    : formik.values.issue_status_value
                }
                options={issueSettings.issue_statuses}
                onClick={fetchIssueSetting}
                loading={loadingIssueSettingApi}
                loadingApi={loadingIssueSettingApi}
                onChange={formik.handleChange}
                disabled={isView}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Issue Status"
                status={
                  formik.errors.issue_status && formik.touched.issue_status
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.issue_status && formik.touched.issue_status ? (
                <p className="errorMsg"> {formik.errors.issue_status} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-12 col-sm-12 mt-0 px-3">
              <BaseTextArea
                formik={formik}
                disabled={isView}
                label="Description"
                placeholder="Description"
                important="false"
                style={{ marginTop: "8px" }}
                row={10}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 px-3">
            {loadingData ? (
              isView ? (
                <BaseButton
                  nameTitle="float-start mt-4 btnLoadingUpdateIssue"
                  type="button"
                  value="Update"
                  color="info"
                />
              ) : (
                <BaseButton
                  nameTitle="float-start mt-4 btnLoadingUpdateIssue "
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
                    nameTitle="float-start mt-4 btnLoadingUpdateIssue"
                    type="submit"
                    value="Update"
                    color="info"
                  />
                ) : (
                  <BaseButton
                    nameTitle="float-start mt-4 btnLoadingUpdateIssue"
                    type="submit"
                    value="Update"
                    color="secondary"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
};
