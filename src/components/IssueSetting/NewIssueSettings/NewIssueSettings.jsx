import { Spin } from "antd";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseColorPicker } from "src/components/Base/BaseColorPicker/BaseColorPicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { SelectInputIssueGroup } from "src/components/Base/BaseSelectInput/SelectInputIssueGroup";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
import "./NewIssueSetting.scss";
import { LoadingOutlined } from "@ant-design/icons";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
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
export const NewIssueSetting = ({
  id,
  option,
  searchParams,
  fetchData,
  selectTypeIssue,
  typeIssue,
  issueGroup,
}) => {
  const { currentUser } = HandleAuth();
  let addNewInit = "";
  switch (typeIssue) {
    case "class":
      addNewInit = {
        issue_value: "",
        issue_group: "",
        description: "",
        status: 1,
        inherited_from: 2,
        class_id: option.class_id,
        is_editable: true,
        style: JSON.stringify({ color: "#1677ff" }),
        created_by: currentUser.email,
      };
      break;
    case "project":
      addNewInit = {
        issue_value: "",
        issue_group: "",
        description: "",
        status: 1,
        inherited_from: 3,
        project_id: id,
        is_editable: true,
        style: JSON.stringify({ color: "#1677ff" }),
        created_by: currentUser.email,
      };
      break;
    case "subject":
      addNewInit = {
        issue_value: "",
        issue_group: "",
        description: "",
        status: 1,
        // inherited_from: 1,
        subject_id: id,
        inherited_from: 1,
        style: JSON.stringify({ color: "#1677ff" }),
        created_by: currentUser.email,
      };
      break;
    default:
      break;
  }
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: addNewInit,
    validationSchema: Yup.object({
      issue_value: Yup.string().required("Issue Value is required"),
      issue_group: Yup.string().required("Issue Group is required"),
    }),
    onSubmit: async (values) => {
      //   window.alert("submit");
      // console.log(values);
      setLoadingData(true);
      const { err } = await axiosClient.post(`/IssueSetting`, values);

      if (err) {
        toast.error("Add issue setting fail!");
        // showErrorMessage(err);
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
        return;
      } else {
        toast.success("Add issue setting successfully!");
        setLoadingData(false);
        formik.resetForm();
        setModal(!modal);
        fetchData(searchParams);
      }

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
      <BaseButton
        nameTitle="my-auto ms-3 px-3 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>New Issue Setting</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-6 col-sm-12">
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
            <div className="col-md-6 col-sm-12">
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
                issueGroup={issueGroup}
                important="true"
                formik={formik}
              />
              {formik.errors.issue_group && formik.touched.issue_group ? (
                <p className="errorMsg"> {formik.errors.issue_group} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseColorPicker
                formik={formik}
                value={formik.values.style}
                isLabel={true}
                label="Style"
                important="true"
              />
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
                label="Status"
                important="true"
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
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingIssueSetting "
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                nameTitle="ms-3 px-3"
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
