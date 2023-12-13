import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseRangePicker } from "src/components/Base/BaseRangePicker/BaseRangePicker";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import * as Yup from "yup";
import "./ClassStudentDetails.scss";

export const ClassStudentDetails = ({
  searchParams,
  classId,
  student,
  fetchData,
  code,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [modal, setModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      ...student,
    },

    onSubmit: async (values) => {
      // console.log(values);
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: `Are you sure to update the student named ${code}?`,
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
              `/ClassStudent/${student.class_student_id}`,
              values
            );
            if (err) {
              toast.error(`The student named ${code} was updated fail!`);
              setLoadingData(false);
            } else {
              toast.success("Update class student successfully!");
              setLoadingData(false);
              fetchData(searchParams);
            }
            toggle();
          }
        });
    },
  });
  const toggle = () => {
    setModal(!modal);
    formik.resetForm({
      values: {
        ...student,
      },
    });
  };
  useEffect(() => {
    // Update initialValues whenever the user prop changes
    formik.setValues({
      ...student,
    });
  }, [student]);
  return (
    <>
      {/* {console.log(student.class_student_id)} */}
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
          <ModalHeader toggle={toggle}>Class Student Details</ModalHeader>

          <ModalBody style={loadingData ? { pointerEvents: "none" } : {}}>
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <BaseInputField
                  type="text"
                  id="student_name"
                  name="student_name"
                  label="Full name"
                  onBlur={formik.handleBlur}
                  placeholder="Enter Full name"
                  value={formik.values.student_name}
                  readOnly={true}
                  onChange={formik.handleChange}
                  classNameInput={
                    formik.errors.student_name && formik.touched.student_name
                      ? "is-invalid"
                      : ""
                  }
                  important="true"
                />
                {formik.errors.student_name && formik.touched.student_name ? (
                  <p className="errorMsg"> {formik.errors.student_name} </p>
                ) : (
                  <p className="hiddenMsg">acb</p>
                )}
              </div>
              <div className="col-md-6 col-sm-12">
                <BaseInputField
                  type="text"
                  id="student_email"
                  name="student_email"
                  label="Email"
                  placeholder="Enter Email"
                  onBlur={formik.handleBlur}
                  value={formik.values.student_email}
                  onChange={formik.handleChange}
                  readOnly={true}
                  classNameInput={
                    formik.errors.student_email && formik.touched.student_email
                      ? "is-invalid"
                      : ""
                  }
                  important="true"
                />
                {formik.errors.student_email && formik.touched.student_email ? (
                  <p className="errorMsg"> {formik.errors.student_email} </p>
                ) : (
                  <p className="hiddenMsg">acb</p>
                )}
              </div>
              <div className="col-md-6 col-sm-12">
                <BaseInputField
                  type="text"
                  id="student_phone"
                  name="student_phone"
                  label="Phone"
                  placeholder="Enter Phone"
                  readOnly={true}
                  onBlur={formik.handleBlur}
                  value={
                    formik.values.student_phone === null
                      ? ""
                      : formik.values.student_phone
                  }
                  onChange={formik.handleChange}
                  classNameInput={
                    formik.errors.student_phone && formik.touched.student_phone
                      ? "is-invalid"
                      : ""
                  }
                />
                {formik.errors.student_phone && formik.touched.student_phone ? (
                  <p className="errorMsg"> {formik.errors.student_phone} </p>
                ) : (
                  <p className="hiddenMsg">acb</p>
                )}
              </div>
              <div className="col-md-6 col-sm-12">
                <BaseInputField
                  type="text"
                  id="class_code"
                  name="class_code"
                  label="Class Name"
                  placeholder="Enter Class Code"
                  readOnly={true}
                  onBlur={formik.handleBlur}
                  value={
                    formik.values.class_code === null
                      ? ""
                      : formik.values.class_code
                  }
                  onChange={formik.handleChange}
                  classNameInput={
                    formik.errors.class_code && formik.touched.class_code
                      ? "is-invalid"
                      : ""
                  }
                />
                {formik.errors.class_code && formik.touched.class_code ? (
                  <p className="errorMsg"> {formik.errors.class_code} </p>
                ) : (
                  <p className="hiddenMsg">acb</p>
                )}
              </div>
              <div className="col-md-6 col-sm-12">
                <BaseInputField
                  type="text"
                  id="project_name"
                  name="project_name"
                  label="Project Name"
                  placeholder="Enter Project Name"
                  readOnly={true}
                  onBlur={formik.handleBlur}
                  value={
                    formik.values.project_name === null
                      ? ""
                      : formik.values.project_name
                  }
                  onChange={formik.handleChange}
                  classNameInput={
                    formik.errors.project_name && formik.touched.project_name
                      ? "is-invalid"
                      : ""
                  }
                />
                {formik.errors.project_name && formik.touched.project_name ? (
                  <p className="errorMsg"> {formik.errors.project_name} </p>
                ) : (
                  <p className="hiddenMsg">acb</p>
                )}
              </div>

              <div className="col-md-12 col-sm-12 px-3">
                <BaseTextArea
                  formik={formik}
                  label="Note"
                  placeholder="Note"
                  important="false"
                  type="user"
                  row="4"
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingUpdateStudent "
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
