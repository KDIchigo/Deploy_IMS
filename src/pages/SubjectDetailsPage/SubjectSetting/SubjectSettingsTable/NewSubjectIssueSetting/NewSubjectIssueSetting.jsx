import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
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
export const NewSubjectIssueSetting = ({
  issueGroup,
  subjectId,
  searchParams,
  fetchData,
  subjectSettings,
}) => {
  const formik = useFormik({
    initialValues: {
      issue_value: "",
      issue_group: "",
      description: "",
      status: 1,
      subject_id: subjectId,
      style: JSON.stringify({ color: "#1677ff" }),
      inherited_from: 1,
    },
    validationSchema: Yup.object({
      issue_value: Yup.string()
        .required("Issue Value is required")
        .max(255, "Issue Value must be lower than 255 characters"),
      //   style: Yup.string().required("Style is required"),
    }),
    onSubmit: async (values) => {
      //   window.alert("submit");

      const { err } = await axiosClient.post(`/IssueSetting`, values);

      if (err) {
        toast.error("Add fail!");
      } else {
        toast.success("Add success!");

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
  };
  return (
    <>
      <BaseButton
        nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>Add New Issue Setting</ModalHeader>

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
            <div className="col-md-6 col-sm-12 mt-0 px-3">
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
              value="Add New"
              color="secondary"
            />
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
