import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { SelectInputSubject } from "src/components/Base/BaseSelectInput/SelectInputSubject";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import * as Yup from "yup";
import "./SubjectAssignmentDetails.scss";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { Spin, Tooltip } from "antd";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { HandleAuth } from "src/utils/handleAuth";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const SubjectAssignmentDetails = ({
  searchParams,
  subjectId,
  assignment,
  fetchData,
  // assignments,
  modal,
  setModal,
  code,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      ...assignment,
      modified_by: currentUser.email,
    },
    validationSchema: Yup.object({
      assignment_name: Yup.string()
        .required("Assignment Name is required")
        .max(255, "Assignment Name must be lower than 255 characters"),
    }),
    onSubmit: async (values) => {
      // console.log(values);
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: `Are you sure to update the subject assignment named ${code}?`,
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: "Yes,update it!",
          cancelButtonText: "No, cancel!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            setLoadingData(true);
            const { err } = await axiosClient.put(
              `/Assignment/${assignment.assignment_id}`,
              values
            );

            if (err) {
              // toast.error(`The assignment named ${code} was updated fail!`);
              showErrorMessage(err);
              setLoadingData(false);
            } else {
              toast.success(
                `The assignment named ${code} was updated successfully!`
              );
              setLoadingData(false);
              fetchData(searchParams);
            }
            toggle();
            // console.log("values", values);
          }
        });
    },
  });

  const toggle = () => {
    setModal(!modal);
    formik.resetForm({
      values: {
        ...assignment,
        modified_by: currentUser.email,
      },
    });
  };
  useEffect(() => {
    // Update initialValues whenever the user prop changes
    formik.setValues({
      ...assignment,
      modified_by: currentUser.email,
    });
  }, [assignment]);
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
          <ModalHeader toggle={toggle}>Subject Assignment Details</ModalHeader>

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
            {/* {console.log(subjects)} */}
            {/* <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                label="Subject Code"
                id="subject_code"
                value={formik.values.subject_code}
                onBlur={formik.handleBlur}
                placeholder="Subject Code"
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                readOnly={true}
              />
              {formik.errors.subject_code && formik.touched.subject_code ? (
                <p className="errorMsg"> {formik.errors.subject_code} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                label="Subject Name"
                id="subject_name"
                value={formik.values.subject_name}
                onBlur={formik.handleBlur}
                placeholder="Subject Name"
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                readOnly={true}
              />
              {formik.errors.subject_name && formik.touched.subject_name ? (
                <p className="errorMsg"> {formik.errors.subject_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div> */}
            <div className="col-md-6 col-sm-12 mt-3 px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-0 px-3 ">
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
                nameTitle="ms-3 px-3 btnLoadingAss"
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
              />
            )}
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
