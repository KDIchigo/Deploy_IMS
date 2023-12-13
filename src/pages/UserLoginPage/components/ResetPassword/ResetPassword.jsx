import React, { useState } from "react";
import { LoadingOutlined, MailOutlined } from "@ant-design/icons";
import "./ResetPassword.scss";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { Spin } from "antd";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
const ResetPassword = ({ setModal, modal }) => {
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: {
      to: "",
      toName: "",
      action: 1,
    },
    validationSchema: Yup.object({
      to: Yup.string()
        .required("Email is required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        ),
    }),
    onSubmit: async (values) => {
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "Are you sure to send email to reset password?",
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: "Yes,reset!",
          cancelButtonText: "No, cancel!",
        })
        .then(async (result) => {
          // console.log(result);
          if (result.isConfirmed) {
            setLoadingData(true);
            const { err } = await axiosClient.post(`/User/send-mail`, values);

            if (err) {
              // toast.error("Send mail fail!");
              showErrorMessage(err);
              setLoadingData(false);
              return;
            } else {
              toast.success("Send mail successfully!");
              setLoadingData(false);
              setModal(!modal);
              formik.resetForm();
            }
          }
          // console.log(values.to);
        });
    },
  });
  return (
    <>
      <Form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        style={loadingData ? { pointerEvents: "none" } : {}}
      >
        <h1 className="title-reset">Forgot Password?</h1>
        <span className="d-block text-center" style={{ fontSize: "16px" }}>
          No problem. Just enter your email address below and we 'll send you
          password reset instructions
        </span>

        <BaseInputField
          type="email"
          id="to"
          name="to"
          value={formik.values.to}
          onChange={formik.handleChange}
          placeholder="Enter your email"
          label="Email"
          classNameDiv="col-12 mt-2 "
          important="true"
          icon={<MailOutlined style={{ color: "gray" }} />}
          classNameInput={
            formik.errors.to && formik.touched.to ? "is-invalid" : ""
          }
          onBlur={formik.handleBlur}
        />
        {formik.errors.to && formik.touched.to ? (
          <p className="errorMsg"> {formik.errors.to} </p>
        ) : (
          <p className="hiddenMsg">acb</p>
        )}
        {loadingData ? (
          <BaseButton
            color="danger"
            icon={<LoadingOutlined />}
            nameTitle="reset-form-button mx-auto"
            type="submit"
            disabled={true}
          />
        ) : (
          <BaseButton
            color="danger"
            value="Reset Password"
            type="submit"
            nameTitle="reset-form-button mx-auto"
          />
        )}
      </Form>
    </>
  );
};

export default ResetPassword;
