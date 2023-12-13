import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "./NewAssignment.scss";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { HandleAuth } from "src/utils/handleAuth";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const NewAssignment = ({
  subjectId,
  assignments,
  fetchData,
  searchParams,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      description: "",
      assignment_name: "",
      status: 1,
      subject_id: subjectId,
      created_by: currentUser.email,
    },
    validationSchema: Yup.object({
      assignment_name: Yup.string()
        .required("Assignment Name is required")
        .max(255, "Assignment Name must be lower than 255 characters"),
    }),
    onSubmit: async (values) => {
      setLoadingData(true);
      const { err } = await axiosClient.post(`/Assignment`, values);

      if (err) {
        // toast.error("Add subject assignment fail!");
        showErrorMessage(err);
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
        return;
      } else {
        toast.success("Add subject assignment successfully!");
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
      {/* {console.log(assignments)} */}
      <BaseButton
        nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>New Subject Assignment</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="assignment_name"
                name="assignment_name"
                label="Assignment Name"
                placeholder="Enter Assignment Name"
                value={formik.values.assignment_name}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.assignment_name &&
                  formik.touched.assignment_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.assignment_name &&
              formik.touched.assignment_name ? (
                <p className="errorMsg"> {formik.errors.assignment_name} </p>
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
