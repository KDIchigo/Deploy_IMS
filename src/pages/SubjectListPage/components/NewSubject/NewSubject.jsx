import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import * as Yup from "yup";
import "./NewSubject.scss";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { HandleAuth } from "src/utils/handleAuth";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const NewSubject = ({ users, fetchData, searchParams }) => {
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      description: "",
      subject_code: "",
      subject_name: "",
      status: 1,
      assignee_id: "",
      created_by: currentUser.email,
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
      setLoadingData(true);
      const { err } = await axiosClient.post(`/Subject`, values);

      if (err) {
        // toast.error("Add subject fail!");
        showErrorMessage(err);
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
      } else {
        toast.success("Add subject successfully!");
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
      <BaseButton
        nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>New Subject</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="subject_code"
                name="subject_code"
                label="Subject Code"
                placeholder="Enter Subject Code"
                value={formik.values.subject_code}
                onChange={formik.handleChange}
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
              <BaseSelectInput
                label="Subject Manager"
                id="assignee_id"
                type="user"
                defaultValue={formik.values.fullname}
                options={users}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                isFilter={false}
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
              />
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
          </ModalBody>
          {/* )} */}

          <ModalFooter>
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoading "
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
