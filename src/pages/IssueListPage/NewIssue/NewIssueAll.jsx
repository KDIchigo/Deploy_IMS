import { LoadingOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { SelectInputAssignees } from "src/components/Base/BaseSelectInput/SelectInputAssignees";
import { SelectInputMilestone } from "src/components/Base/BaseSelectInput/SelectInputMilestone";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
import "./NewIssueAll.scss";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const NewIssueAll = ({
  fetchData,
  searchParams,
  issueType,
  students,
  issues,
  milestones,
  projectId,
  issueSettings,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [assigneeValue, setAssigneeValue] = useState([]);
  const { currentUser } = HandleAuth();
  const handleAssigneeValue = (value) => {
    setAssigneeValue(value);
  };
  const formik = useFormik({
    initialValues: {
      description: "",
      issue_title: "",
      issue_type: "",
      issue_status: "",
      work_process: "",
      due_date: "",
      status: 1,
      project_id: projectId,
      assignee: "",
      milestone_id: "",
      created_by: currentUser.email,
      user_id: currentUser.user_id,
      // parent_id: "",
    },
    validationSchema: Yup.object({
      issue_title: Yup.string()
        .required("Issue Title is required")
        .max(1023, "Issue Title must be lower than 1023 characters"),
      milestone_id: Yup.string().required("Project Milestone is required"),
      due_date: Yup.string().required("Due Date is required"),
      issue_type: Yup.string()
        .required("Issue Type is required")
        .max(36, "Issue Type must be lower than 36 characters"),
      issue_status: Yup.string()
        .required("Issue Status is required")
        .max(36, "Issue Status must be lower than 36 characters"),
      work_process: Yup.string()
        .required("Work Process is required")
        .max(36, "Work Process must be lower than 36 characters"),
      // assignee: Yup.string().required("Assignee is required"),
    }),
    onSubmit: async (values) => {
      setLoadingData(true);
      const { err } = await axiosClient.post(`/Issue`, values);

      if (err) {
        toast.error("Add issue fail!");
        // showErrorMessage(err);
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
        return;
      } else {
        toast.success("Add issue successfully!");
        setLoadingData(false);

        formik.resetForm();
      }
      setModal(!modal);
      fetchData(searchParams);

      // console.log(values);
    },
  });
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    formik.resetForm();
  };
  return (
    <>
      {/* {console.log(classId)} */}
      <BaseButton
        nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Modal isOpen={modal} toggle={toggle} size="lg" fullscreen>
        <form
          onSubmit={formik.handleSubmit}
          autoComplete="off"
          className=" d-flex flex-column flexGrow_1"
        >
          <ModalHeader toggle={toggle}>Add New Issue</ModalHeader>

          <ModalBody className="row">
            <div className="col-md-6 col-sm-12 px-3">
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
            {/* <div className="col-md-6 col-sm-12 px-3">
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
                  onChange={formik.handleChange}
                  // important="true"
                  formik={formik}
                  isFilter={false}
                  disabled={true}
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
              </div> */}
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Issue Type"
                id="issue_type"
                type="issue_group"
                defaultValue={
                  formik.values.issue_type === ""
                    ? undefined
                    : formik.values.issue_type
                }
                options={issueSettings.issue_types}
                onChange={formik.handleChange}
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

            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Work Process"
                id="work_process"
                type="issue_group"
                defaultValue={
                  formik.values.work_process === ""
                    ? undefined
                    : formik.values.work_process
                }
                options={issueSettings.work_process}
                onChange={formik.handleChange}
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
            <div className="col-md-3 col-sm-12 px-3">
              <BaseSelectInput
                label="Assignee"
                id="assignee"
                type="class_student"
                defaultValue={formik.values.student_name}
                options={students}
                onChange={formik.handleChange}
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
            {/* {console.log(formik.values.due_date)} */}
            <div className="col-md-3 col-sm-12 px-3">
              <BaseDatePicker
                id="due_date"
                label="Due Date"
                name="due_date"
                className="w-100 px-2 datePicker"
                valueDueDate={formik.values.due_date}
                value={formik.values.due_date}
                onChange={formik.handleChange}
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
            {/* <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="number"
                id="estimate_time"
                name="estimate_time"
                label="Estimate Time"
                placeholder="Enter Estimate Time"
                value={formik.values.estimate_time}
                onChange={formik.handleChange}
                important="true"
                classNameInput={
                  formik.errors.estimate_time && formik.touched.estimate_time
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.estimate_time && formik.touched.estimate_time ? (
                <p className="errorMsg"> {formik.errors.estimate_time} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="number"
                id="actual_time"
                name="actual_time"
                label="Actual Time"
                placeholder="Enter Actual Time"
                value={formik.values.actual_time}
                onChange={formik.handleChange}
                important="true"
                classNameInput={
                  formik.errors.actual_time && formik.touched.actual_time
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.actual_time && formik.touched.actual_time ? (
                <p className="errorMsg"> {formik.errors.actual_time} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div> */}
            <div className="col-md-3 col-sm-12 px-3">
              <BaseSelectInput
                label="Issue Status"
                id="issue_status"
                type="issue_group"
                defaultValue={
                  formik.values.issue_status === ""
                    ? undefined
                    : formik.values.issue_status
                }
                options={issueSettings.issue_statuses}
                onChange={formik.handleChange}
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
                label="Description"
                placeholder="Description"
                important="false"
                row={10}
              />
            </div>
            {/* <div className="col-md-6 col-sm-12 mt-1 px-3">
              <BaseRadio formik={formik} type="status" />
            </div> */}
          </ModalBody>
          <ModalFooter>
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingAddIssueAll "
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                className="ms-3 px-3 btnAddAll"
                type="submit"
                value="Add New"
                color="secondary"
              />
            )}
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
