import React, { useState } from "react";
import { LoadingOutlined, LockOutlined } from "@ant-design/icons";
import "./ChangePassword.scss";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "src/axios/AxiosClient";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { Spin } from "antd";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import { jwtDecode } from "jwt-decode";

const ChangePassword = () => {
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();
  const emailAddress = jwtDecode(localStorage.getItem("token")).email;

  const formik = useFormik({
    initialValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmedPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Password is required")
        .min(8)
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,19}$/,
          "Password must be 8-19 characters and contain at least one letter, one number and a special character"
        ),

      newPassword: Yup.string()
        .required("New Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,19}$/,
          "Password must be 8-19 characters and contain at least one letter, one number and a special character"
        )
        .notOneOf(
          [Yup.ref("oldPassword"), "invalid new password"],
          "New password must not be the same as the current password"
        ),

      confirmedPassword: Yup.string()
        .required("Confirm password is required")
        .min(8)
        .oneOf(
          [Yup.ref("newPassword"), null],
          "Confirm password must match with new password "
        ),
    }),

    onSubmit: async (values) => {
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "Are you sure to change password?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, change it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          console.log(result);
          if (result.isConfirmed) {
            const value = { ...values, email: emailAddress };
            const { confirmedPassword, ...password } = value;
            setLoadingData(true);
            const { err } = await axiosClient.post(
              "User/change-password",
              password
            );

            if (err) {
              // toast.err("Change password fail!");
              showErrorMessage(err);
              setLoadingData(false);
            } else {
              navigate("/sign-in");
              toast.success("Change password successfully!");
              setLoadingData(false);
            }
            // console.log(values);
            // console.log(err);
          }
        });
    },
  });

  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />

      <Form
        onSubmit={formik.handleSubmit}
        style={loadingData ? { pointerEvents: "none" } : {}}
      >
        <BaseInputField
          type="password"
          id="oldPassword"
          name="oldPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter current password"
          label="Current Password"
          classNameDiv="col-12 "
          important="true"
          icon={<LockOutlined style={{ color: "gray" }} />}
          classNameInput={
            formik.errors.oldPassword && formik.touched.oldPassword
              ? "is-invalid"
              : ""
          }
        />
        {formik.errors.oldPassword && formik.touched.oldPassword ? (
          <p className="errorMsg"> {formik.errors.oldPassword} </p>
        ) : (
          <p className="hiddenMsg">acb</p>
        )}
        <BaseInputField
          type="password"
          id="newPassword"
          name="newPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter new password"
          label="New Password"
          classNameDiv="col-12"
          important="true"
          icon={<LockOutlined style={{ color: "gray" }} />}
          classNameInput={
            formik.errors.newPassword && formik.touched.newPassword
              ? "is-invalid"
              : ""
          }
        />
        {formik.errors.newPassword && formik.touched.newPassword ? (
          <p className="errorMsg"> {formik.errors.newPassword} </p>
        ) : (
          <p className="hiddenMsg">acb</p>
        )}
        <BaseInputField
          type="password"
          id="confirmedPassword"
          name="confirmedPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter confirm password"
          label="Confirm Password"
          classNameDiv="col-12 "
          important="true"
          icon={<LockOutlined style={{ color: "gray" }} />}
          classNameInput={
            formik.errors.confirmedPassword && formik.touched.confirmedPassword
              ? "is-invalid"
              : ""
          }
        />
        {formik.errors.confirmedPassword && formik.touched.confirmedPassword ? (
          <p className="errorMsg mb-3"> {formik.errors.confirmedPassword} </p>
        ) : (
          <p className="hiddenMsg mb-3">acb</p>
        )}
        {loadingData ? (
          // <Spin size="large" width="50px" height="50px" />
          <BaseButton
            icon={<LoadingOutlined />}
            disabled={true}
            color="danger"
            nameTitle="changePassword-form-button mx-auto col-12"
          />
        ) : (
          <BaseButton
            color="danger"
            value="Save"
            nameTitle="changePassword-form-button mx-auto col-12"
          />
        )}
      </Form>
    </>
  );
};

export default ChangePassword;
