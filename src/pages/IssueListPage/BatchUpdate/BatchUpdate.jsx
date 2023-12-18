import { useFormik } from "formik";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { SelectInputAssignees } from "src/components/Base/BaseSelectInput/SelectInputAssignees";
import { SelectInputBatchUpdate } from "src/components/Base/BaseSelectInput/SelectInputBatchUpdate";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
export const BatchUpdate = ({
  issueSettings,
  students,
  milestones,
  handleBatchUpdate,
  handleAssigneeValue,
  assigneeValue,
  handleCancelBatch,
}) => {
  // console.log(milestones)
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      issue_type: "",
      issue_status: "",
      work_process: "",
      issue_type_value: "",
      issue_status_value: "",
      work_process_value: "",
      assignee: "",
      student_name: "",
      milestone_id: "",
      milestone_name: "",
      modified_by: currentUser.email,
      // parent_id: "",
    },
    // validationSchema: Yup.object({
    //   issue_title: Yup.string()
    //     .required("Issue Title is required")
    //     .max(1023, "Issue Title must be lower than 1023 characters"),
    //   issue_status: Yup.string()
    //     .required("Issue Status is required")
    //     .max(36, "Issue Status must be lower than 36 characters"),
    //   work_process: Yup.string()
    //     .required("Work Process is required")
    //     .max(36, "Work Process must be lower than 36 characters"),
    //   // assignee_id: Yup.string().required("Issue Manager is required"),
    // }),
    onSubmit: async (values) => {
      //   const { err } = await axiosClient.post(`/Issue`, values);
      //   if (err) {
      //     toast.error("Add issue fail!");
      //   } else {
      //     toast.success("Add issue success!");
      //     formik.resetForm();
      //   }
      //   fetchData(searchParams);
      // console.log(values);
      handleBatchUpdate(values, handleReset);
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };

  return (
    <>
      <form
        className="d-flex flex-column flexGrow_1"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className="flexGrow_1">
          <div className="row">
            <div className="col-md-12 col-sm-12 px-3">
              <SelectInputBatchUpdate
                id="issue_type"
                name="issue_type"
                label="Issue Type "
                type="issue_group"
                placeholder="Enter Issue Type"
                defaultValue={
                  formik.values.issue_type === ""
                    ? undefined
                    : formik.values.issue_type
                }
                options={issueSettings.issue_types}
                onChange={formik.handleChange}
                checked={
                  formik.values.issue_type_value === ""
                    ? undefined
                    : formik.values.issue_type_value
                }
                formik={formik}
                isFilter={false}
                batchUpdateType="issue_type_value"
                status={
                  formik.errors.issue_id && formik.touched.issue_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col-md-12 col-sm-12 px-3 mt-2">
              <SelectInputBatchUpdate
                id="issue_status"
                name="issue_status"
                label="Issue Status "
                type="issue_group"
                placeholder="Enter Issue Status"
                defaultValue={
                  formik.values.issue_status === ""
                    ? undefined
                    : formik.values.issue_status
                }
                options={issueSettings.issue_statuses}
                onChange={formik.handleChange}
                formik={formik}
                checked={
                  formik.values.issue_status_value === ""
                    ? undefined
                    : formik.values.issue_status_value
                }
                isFilter={false}
                batchUpdateType="issue_status_value"
                status={
                  formik.errors.issue_status && formik.touched.issue_status
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col-md-12 col-sm-12 px-3 mt-2">
              <SelectInputBatchUpdate
                id="work_process"
                name="work_process"
                label="Work Process"
                type="issue_group"
                placeholder="Enter Work Process"
                defaultValue={
                  formik.values.work_process === ""
                    ? undefined
                    : formik.values.work_process
                }
                options={issueSettings.work_process}
                onChange={formik.handleChange}
                formik={formik}
                checked={
                  formik.values.work_process_value === ""
                    ? undefined
                    : formik.values.work_process_value
                }
                isFilter={false}
                batchUpdateType="work_process_value"
                status={
                  formik.errors.work_process && formik.touched.work_process
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col-md-12 col-sm-12 px-3 mt-2">
              <SelectInputBatchUpdate
                id="assignee"
                name="assignee"
                label="Assignee"
                type="class_student"
                placeholder="Enter Assignee"
                defaultValue={
                  formik.values.assignee === ""
                    ? undefined
                    : formik.values.assignee
                }
                options={students}
                onChange={formik.handleChange}
                formik={formik}
                checked={
                  formik.values.student_name === ""
                    ? undefined
                    : formik.values.student_name
                }
                isFilter={false}
                batchUpdateType="student_name"
                status={
                  formik.errors.assignee && formik.touched.assignee
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
            </div>
            {/* <div className="col-md-12 col-sm-12 px-3 mt-2">
            <SelectInputAssignees
              id="assignee"
              name="assignee"
              label="Assignee"
              important="true"
              placeholder="Enter Assignee"
              value={assigneeValue}
              defaultValue={
                formik.values.assignee === ""
                  ? []
                  : formik.values.assignee
              }
              students={students}
              onChange={formik.handleChange}
              formik={formik}
              checked={
                formik.values.student_name === ""
                  ? undefined
                  : formik.values.student_name
              }
              isFilter={false}
              handleAssigneeValue={handleAssigneeValue}
              status={
                formik.errors.assignee && formik.touched.assignee ? "error" : ""
              }
              onBlur={formik.handleBlur}
            />
          </div> */}
            <div className="col-md-12 col-sm-12 px-3 mt-2">
              <SelectInputBatchUpdate
                id="milestone_id"
                name="milestone_id"
                label="Milestone"
                type="milestone"
                placeholder="Enter Milestone"
                defaultValue={
                  formik.values.milestone_id === ""
                    ? undefined
                    : formik.values.milestone_id
                }
                options={milestones}
                onChange={formik.handleChange}
                formik={formik}
                checked={
                  formik.values.milestone_name === ""
                    ? undefined
                    : formik.values.milestone_name
                }
                isFilter={false}
                batchUpdateType="milestone_name"
                status={
                  formik.errors.milestone_id && formik.touched.milestone_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-12 px-3 d-flex justify-content-between">
            <BaseButton
              nameTitle="float-start"
              type="reset"
              value="Reset"
              color="dark"
              onClick={() => formik.resetForm()}
            />
            <BaseButton
              nameTitle="float-end"
              type="button"
              value="Cancel"
              color="primary"
              onClick={() => handleCancelBatch(handleReset)}
            />
            <BaseButton
              nameTitle="float-end"
              type="submit"
              value="Update"
              color="secondary"
            />
          </div>
        </div>
      </form>
    </>
  );
};
