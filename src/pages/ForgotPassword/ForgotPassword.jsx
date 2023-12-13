import { LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useFormik } from "formik";
import { MDBContainer, MDBIcon } from "mdb-react-ui-kit";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Form } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import * as Yup from "yup";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingData, setLoadingData] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const formik = useFormik({
    initialValues: {
      newPassword: null,
      confirmedPassword: null,
      token: token,
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,19}$/,
          "Password must be 8-19 characters and contain at least one letter, one number and a special character"
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
      const { confirmedPassword, ...pass } = values;
      setLoadingData(true);
      const { data, err } = await axiosClient.post(
        `/User/reset-password?token=${pass.token}&newPassword=${pass.newPassword}`
      );
      if (err) {
        // toast.error("Reset password fail!");
        showErrorMessage(err);
        setLoadingData(false);
      } else {
        toast.success("Reset password successfully!");
        setLoadingData(false);
        navigate("/sign-in");
      }
      // console.log(pass);
      // console.log(err);
    },
  });

  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      <Form
        className="background-login"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <MDBContainer
          className="p-3 flex-column sign-in__body"
          style={loadingData ? { pointerEvents: "none" } : {}}
        >
          <div className="d-flex flex-row mt-5 mb-2">
            <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: "#ff6219" }} />
            <span className="h1 fw-bold mb-0">IMS</span>
          </div>
          <div className=" flex-row ">
            <div className="divider d-flex align-items-center my-3">
              <h4 className="text-center  mx-3 mb-2">Reset Password</h4>
            </div>
          </div>

          <BaseInputField
            type="password"
            id="newPassword"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            placeholder="Enter New Password"
            label="New Password"
            classNameDiv="col-12 mb-2 "
            important="true"
            icon={<UserOutlined style={{ color: "gray" }} />}
            tooltip="invalid-feedback"
            tooltipName={formik.errors.newPassword}
            classNameInput={formik.errors.newPassword ? "is-invalid" : ""}
          />

          {formik.errors.newPassword ? (
            <p className="errorMsg"> {formik.errors.newPassword} </p>
          ) : (
            <p className="hiddenMsg">acb</p>
          )}
          <BaseInputField
            type="password"
            id="confirmedPassword"
            name="confirmedPassword"
            value={formik.values.confirmedPassword}
            onChange={formik.handleChange}
            placeholder="Enter Confirmed Password"
            label="Confirmed Password"
            classNameDiv="col-12 mb-2 "
            important="true"
            icon={<LockOutlined style={{ color: "gray" }} />}
            classNameInput={formik.errors.confirmedPassword ? "is-invalid" : ""}
          />
          {formik.errors.confirmedPassword ? (
            <p className="errorMsg"> {formik.errors.confirmedPassword} </p>
          ) : (
            <p className="hiddenMsg">acb</p>
          )}
          {loadingData ? (
            <BaseButton
              color="danger"
              icon={<LoadingOutlined />}
              nameTitle="login-form-button mt-2"
            />
          ) : (
            <BaseButton
              color="danger"
              value="SAVE"
              nameTitle="login-form-button mt-2"
            />
          )}
        </MDBContainer>
      </Form>
    </>
  );
};
