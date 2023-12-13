import { EditOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseColorPicker } from "src/components/Base/BaseColorPicker/BaseColorPicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { SelectInputIssueGroup } from "src/components/Base/BaseSelectInput/SelectInputIssueGroup";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import * as Yup from "yup";
function isNullOrEmptyUUID(uuid) {
  return !uuid || uuid === "00000000-0000-0000-0000-000000000000";
}
export const SubjectSettingDetails = ({
  subjectSetting,
  searchParams,
  fetchData,
  subjectId,
  issueGroup,
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
  const formik = useFormik({
    initialValues: {
      ...subjectSetting,
    },
    validationSchema: Yup.object({
      issue_value: Yup.string()
        .required("Issue Value is required")
        .max(255, "Issue Value must be lower than 255 characters"),
      //   style: Yup.string().required("Style is required"),
    }),
    onSubmit: async (values) => {
      // console.log(values);
      if (isNullOrEmptyUUID(values.subject_id)) {
        const { subject_id, subject_code, subject_name, ...value } = values;
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
          text: "Are you sure to update Issue Setting?",
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: "Yes,update it!",
          cancelButtonText: "No, cancel!",
        })
        .then(async (result) => {
          console.log(result);
          if (result.isConfirmed) {
            const { err } = await axiosClient.put(
              `/IssueSetting/${subjectSetting.issue_setting_id}`,
              values
            );

            if (err) {
              toast.error("Update fail!");
            } else {
              toast.success("Update successfully!");
            }

            setModal(!modal);
            fetchData(searchParams);

            // console.log("values", values);
          }
        });
    },
  });
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <>
      <Tooltip title="Details" placement="top" color="#ffc107" size="large">
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
          <ModalHeader toggle={toggle}>Subject Assignment Details</ModalHeader>

          <ModalBody className="row">
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="issue_value"
                name="issue_value"
                label="Setting Value"
                placeholder="Enter Setting Value"
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
                label="Setting Group"
                id="issue_group"
                defaultValue={formik.values.issue_group}
                onBlur={formik.handleBlur}
                status={
                  formik.errors.issue_group && formik.touched.issue_group
                    ? "error"
                    : ""
                }
                placeholder="Setting Group"
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
            <div className="col-md-6 col-sm-12 mt-2 px-3">
              <BaseColorPicker formik={formik} value={formik.values.style} />
            </div>
            <div className="col-md-6 col-sm-12 mt- px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-3 px-3">
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
            <BaseButton
              className="ms-3 px-3"
              type="submit"
              value="Update"
              color="secondary"
            />
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
