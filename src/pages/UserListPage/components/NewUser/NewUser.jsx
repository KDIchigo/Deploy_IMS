import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
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
import { UserEnum } from "src/enum/Enum";
import * as Yup from "yup";
import "./NewUser.scss";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const NewUser = ({ roles, fetchData, searchParams }) => {
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      password: "Dung1881@",
      phone_number: "",
      note: "",
      setting_id: "",
      status: 1,
      action: UserEnum.Add,
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Fullname is required")
        .min(4, "Must be 4 characters or more")
        .max(255, "Fullname must be lower than 255 characters"),
      // password: Yup.string()
      //   .required("Password is required")
      //   .matches(
      //     /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,19}$/,
      //     "Password must be 8-19 characters and contain at least one letter, one number and a special character"
      //   ),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        )
        .max(255, "Email must be lower than 255 characters"),
      phone_number: Yup.string()
        .nullable()
        .test(
          "is-valid-postal-code",
          "Phone must be a valid phone number and have 10 digits",
          function (value) {
            if (value && value.trim() !== null) {
              const postalCodePattern =
                /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
              if (!postalCodePattern.test(value)) {
                return false; // Validation failed
              }
            }
            return true;
          }
        ),
      setting_id: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      // window.alert("Form submitted");
      setLoadingData(true);
      const { data, err } = await axiosClient.post(`/User`, values);
      if (err) {
        // toast.error("Add user fail!");
        showErrorMessage(err);
        setLoadingData(false);
        toggle();
        return;
      } else {
        toast.success("Add user successful!");
        setLoadingData(false);
        toggle();
        fetchData(searchParams);
      }
      // console.log(searchParams, values);
    },
  });
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    formik.resetForm();
  };
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <BaseButton
        nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>New User</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-12 col-sm-12 px-3">
              <BaseInputField
                type="text"
                label="Full name"
                value={formik.values.fullname}
                placeholder="Enter Full name"
                classNameInput={
                  formik.errors.fullname && formik.touched.fullname
                    ? "is-invalid"
                    : ""
                }
                important="true"
                isRandom={false}
                onChange={formik.handleChange}
                id="fullname"
                readOnly={false}
                onBlur={formik.handleBlur}
              />
              {formik.errors.fullname && formik.touched.fullname ? (
                <p className="errorMsg"> {formik.errors.fullname} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                label="Email"
                value={formik.values.email}
                placeholder="Enter Email"
                classNameInput={
                  formik.errors.email && formik.touched.email
                    ? "is-invalid"
                    : ""
                }
                important="true"
                isRandom={false}
                onChange={formik.handleChange}
                id="email"
                readOnly={false}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="errorMsg"> {formik.errors.email} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                label="Phone"
                value={formik.values.phone_number}
                placeholder="Enter Phone"
                classNameInput={
                  formik.errors.phone_number && formik.touched.phone_number
                    ? "is-invalid"
                    : ""
                }
                important="false"
                isRandom={false}
                onChange={formik.handleChange}
                id="phone_number"
                readOnly={undefined}
                onBlur={formik.handleBlur}
              />
              {formik.errors.phone_number && formik.touched.phone_number ? (
                <p className="errorMsg"> {formik.errors.phone_number} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                type="setting"
                label="Role"
                important="true"
                defaultValue={
                  formik.values.setting_id === null
                    ? undefined
                    : formik.values.setting_value
                }
                options={roles}
                onChange={formik.handleChange}
                placeholder="Role"
                disabled={false}
                id="setting_id"
                isFilter={false}
                formik={formik}
                status={
                  formik.errors.setting_id && formik.touched.setting_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.setting_id && formik.touched.setting_id ? (
                <p className="errorMsg"> {formik.errors.setting_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3 mt-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
              />
              {/* <BaseCheckbox formik={formik} type="status" /> */}
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
          </ModalBody>

          <ModalFooter>
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingAdd "
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
