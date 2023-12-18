import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseColorPicker } from "src/components/Base/BaseColorPicker/BaseColorPicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { SelectInputIssueGroup } from "src/components/Base/BaseSelectInput/SelectInputIssueGroup";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
import "./IssueSettingDetails.scss";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
function isNullOrEmptyUUID(uuid) {
  return !uuid || uuid === "00000000-0000-0000-0000-000000000000";
}
export const IssueSettingDetails = ({
  issueSetting,
  id,
  typeIssue,
  selectTypeIssue,
  searchParams,
  fetchData,
  issueGroup,
  code,
}) => {
  const issue_group = [
    {
      value: 1,
      label: "Issue Type",
    },
    {
      value: 2,
      label: "Issue Status",
    },
    {
      value: 3,
      label: "Work Process",
    },
  ];
  const { currentUser } = HandleAuth();
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: {
      ...issueSetting,
      modified_by: currentUser.email,
    },
    validationSchema: Yup.object({
      issue_value: Yup.string().required("Issue Value is required"),
    }),
    onSubmit: async (values) => {
      if (isNullOrEmptyUUID(values.project_id)) {
        const { project_id, project_code, project_name, ...value } = values;
        values = { ...value };
      }
      if (isNullOrEmptyUUID(values.subject_id)) {
        const { subject_id, subject_code, subject_name, ...value } = values;
        values = { ...value };
      }
      const { class_code, class_name, ...value } = values;
      values = { ...value };

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: `Are you sure to update the issue setting named ${code}?`,
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: "Yes,update it!",
          cancelButtonText: "No, cancel!",
        })
        .then(async (result) => {
          // console.log(result);
          if (result.isConfirmed) {
            setLoadingData(true);
            const { err } = await axiosClient.put(
              `/IssueSetting/${issueSetting.issue_setting_id}`,
              values
            );

            if (err) {
              // toast.error(`The issue setting named ${code} was updated fail!`);
              showErrorMessage(err);
              setLoadingData(false);
            } else {
              toast.success(
                `The issue setting named ${code} was updated successfully!`
              );
              setLoadingData(false);
              fetchData(searchParams);
            }
            toggle();
          }

          // console.log(values);
        });
    },
  });
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    formik.resetForm({
      values: {
        ...issueSetting,
        modified_by: currentUser.email,
      },
    });
  };
  useEffect(() => {
    // Update initialValues whenever the user prop changes
    formik.setValues({
      ...issueSetting,
      modified_by: currentUser.email,
    });
  }, [issueSetting]);
  return (
    <>
      <Tooltip
        title="Details"
        className="action_space"
        placement="top"
        color="#ffc107"
        size="large"
      >
        <div>
          <BaseButton
            icon={<EditOutlined />}
            variant="outline"
            nameTitle="px-2 py-1"
            color="warning"
            onClick={toggle}
          />
        </div>
      </Tooltip>
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>Issue Setting Details</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="issue_value"
                name="issue_value"
                label="Issue Value"
                placeholder="Enter Issue Value"
                value={formik.values.issue_value}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.issue_value && formik.touched.issue_value
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.issue_value && formik.touched.issue_value ? (
                <p className="errorMsg"> {formik.errors.issue_value} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <SelectInputIssueGroup
                label="Issue Group"
                id="issue_group"
                defaultValue={formik.values.issue_group}
                onBlur={formik.handleBlur}
                status={
                  formik.errors.issue_group && formik.touched.issue_group
                    ? "error"
                    : ""
                }
                placeholder="Issue Group"
                options={issue_group}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                disabled={true}
                issueGroup={issueGroup}
              />
              {formik.errors.issue_group && formik.touched.issue_group ? (
                <p className="errorMsg"> {formik.errors.issue_group} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-3 col-sm-12 px-3">
              <BaseColorPicker
                formik={formik}
                value={formik.values.style}
                isLabel={true}
                label="Style"
                important="true"
              />
            </div>
            <div className="col-md-3 col-sm-12 pe-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
                label="Status"
                important="true"
              />
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
            <div className="col-md-12 col-sm-12  mt-3 px-3">
              <BaseTextArea
                formik={formik}
                label="Description"
                placeholder="Description"
                important="false"
                row={4}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingIssueUpdate "
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                nameTitle="ms-3 px-3"
                type="submit"
                value="Update"
                color="secondary"
                disabled={
                  typeIssue === "project" &&
                  (issueSetting.inherited_from === 1 ||
                    issueSetting.inherited_from === 2 ||
                    issueSetting.class_id ||
                    issueSetting.project_id === null)
                }
              />
            )}
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
