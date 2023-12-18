import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import * as Yup from "yup";
import "./NewProject.scss";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { Spin } from "antd";
import { HandleAuth } from "src/utils/handleAuth";
import { LoadingOutlined } from "@ant-design/icons";

export const NewProject = ({
  fetchFilterData,
  fetchAllData,
  searchClassParams,
  classId,
  handleNewProject,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  // console.log(classId);
  const formik = useFormik({
    initialValues: {
      description: "",
      project_code: "",
      group_name: "",
      english_group_name: "",
      vn_group_name: "",
      status: 1,
      class_id: "",
      created_by: currentUser.email,
    },
    validationSchema: Yup.object({
      project_code: Yup.string()
        .required("Project Code is required")
        .max(100, "Project Code must be lower than 100 characters"),
      group_name: Yup.string()
        .required("Group Name is required")
        .max(500, "Group Name must be lower than 500 characters"),
      english_group_name: Yup.string()
        .required("English Group Name is required")
        .max(500, "English Group Name must be lower than 500 characters"),
      vn_group_name: Yup.string()
        .required("Vietnam Group Name is required")
        .max(500, "Vietnam Group Name must be lower than 500 characters"),
    }),
    onSubmit: async (values) => {
      const newValues = { ...values, class_id: classId };
      setLoadingData(true);
      handleNewProject(formik, toggle, newValues, setLoadingData);
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
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>New Project</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="project_code"
                name="project_code"
                label="Project Code"
                placeholder="Enter Project Code"
                value={formik.values.project_code}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.project_code && formik.touched.project_code
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.project_code && formik.touched.project_code ? (
                <p className="errorMsg"> {formik.errors.project_code} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="group_name"
                name="group_name"
                label="Group Name"
                placeholder="Group Name"
                value={formik.values.group_name}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.group_name && formik.touched.group_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.group_name && formik.touched.group_name ? (
                <p className="errorMsg"> {formik.errors.group_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="english_group_name"
                name="english_group_name"
                label="English Project Name"
                placeholder="English Project Name"
                value={formik.values.english_group_name}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.english_group_name &&
                  formik.touched.english_group_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.english_group_name &&
              formik.touched.english_group_name ? (
                <p className="errorMsg"> {formik.errors.english_group_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="vn_group_name"
                name="vn_group_name"
                label="Vietnamese Project Name"
                placeholder="Vietnamese Project Name"
                value={formik.values.vn_group_name}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.vn_group_name && formik.touched.vn_group_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.vn_group_name && formik.touched.vn_group_name ? (
                <p className="errorMsg"> {formik.errors.vn_group_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
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
            <div className="col-md-12 col-sm-12 mt-2  px-3">
              <BaseTextArea
                formik={formik}
                label="Description"
                placeholder="Description"
                important="false"
                row={5}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingProject "
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                className="ms-3 px-3"
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
