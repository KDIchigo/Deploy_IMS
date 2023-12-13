import { LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
// import { gapi } from "gapi-script";
import { MDBContainer, MDBIcon } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Form, Input, Label } from "reactstrap";
// import { setLoggedInUser } from "src/app/feature/user/UserSlice";
// import { gapi } from "gapi-script";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { ModalCmpt } from "src/components/Modal/ModalCmpt";
import * as Yup from "yup";
import "./UserLoginPage.scss";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "src/app/feature/user/UserSlice";
import { Spin } from "antd";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import { jwtDecode } from "jwt-decode";
import { LoginWithGoogle } from "./components/LoginWithGoogle/LoginWithGoogle";
import { gapi } from "gapi-script";

const clientId =
  "436820330351-egki06cp3o90rk02uvhh6hmi0idjme9q.apps.googleusercontent.com";

const UserLoginPage = () => {
  // const clientId =
  //   "436820330351-7d5cjnnng5dgaioda7ej2ab5aed0kor0.apps.googleusercontent.com";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: {
      loginInput: "",
      passwordInput: "",
      isRemember: "",
    },
    validationSchema: Yup.object({
      loginInput: Yup.string()
        .required("Email is required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        ),
      passwordInput: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,19}$/,
          "Password must be 8-19 characters and contain at least one letter, one number and a special character"
        ),
    }),

    onSubmit: async (values) => {
      const { isRemember, ...account } = values;
      setLoadingData(true);
      const { data, err } = await axiosClient.post("/User/login", account);
      if (err) {
        toast.error("Username or password is incorrect ");
        // toast.error(
        //   <div>
        //     <h6>Sign In Failed!</h6>
        //     <span>Username or password is incorrect</span>
        //   </div>
        // );
        // showErrorMessage(err);
        setLoadingData(false);
      } else {
        // if (isRemember) {
        //   localStorage.setItem("token", data);
        // }
        localStorage.setItem("token", data);
        dispatch(setLoggedInUser(jwtDecode(data)));
        toast.success("Sign in successfully!");
        setLoadingData(false);
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 2000);
      }
      // console.log(values);
      // console.log(data);
    },
  });

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
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
          <div className="d-flex flex-row mt-5 mb-4">
            <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: "#ff6219" }} />
            <span className="h1 fw-bold mb-0">IMS</span>
          </div>
          {/* <div className="d-flex flex-row ">
            <p className="lead fw-normal mt-2">Sign in with</p>
            <BaseButton
              nameTitle="rounded-circle btnLogin_logo mx-3 position-relative"
              color="danger"
              value={
                <MDBIcon
                  fab
                  icon="google"
                  className="position-absolute top-50 start-50 translate-middle"
                />
              }
            />
          </div>
          <div className="divider d-flex align-items-center ">
            <p className="text-center  mx-3 mb-2">or continue with</p>
          </div> */}
          <BaseInputField
            type="text"
            id="loginInput"
            name="loginInput"
            value={formik.values.loginInput}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email"
            label="Email"
            classNameDiv="col-12 mb-2 "
            important="true"
            icon={<UserOutlined style={{ color: "gray" }} />}
            tooltip="invalid-feedback"
            tooltipName={formik.errors.loginInput}
            classNameInput={
              formik.errors.loginInput && formik.touched.loginInput
                ? "is-invalid"
                : ""
            }
          />

          {formik.errors.loginInputt && formik.touched.loginInput ? (
            <p className="errorMsg"> {formik.errors.loginInput} </p>
          ) : (
            <p className="hiddenMsg">acb</p>
          )}
          <BaseInputField
            type="password"
            id="passwordInput"
            name="passwordInput"
            value={formik.values.passwordInput}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter password"
            label="Password"
            classNameDiv="col-12 mb-2 "
            important="true"
            icon={<LockOutlined style={{ color: "gray" }} />}
            classNameInput={
              formik.errors.passwordInput && formik.touched.passwordInput
                ? "is-invalid"
                : ""
            }
          />
          {formik.errors.passwordInput && formik.touched.passwordInput ? (
            <p className="errorMsg"> {formik.errors.passwordInput} </p>
          ) : (
            <p className="hiddenMsg">acb</p>
          )}
          <div className="d-flex justify-content-between mb-3">
            <Label>
              <Input
                type="checkbox"
                style={{
                  borderColor: "gray",
                  marginRight: "10px",
                  width: "0.7rem",
                  height: "0.75rem",
                }}
                name="isRemember"
                checked={formik.values.isRemember}
                onChange={formik.handleChange}
              />
              Remember me
            </Label>
            <ModalCmpt
              classNameBtn="btn btn-light btn-wave waves-effect waves-light px-5 ms-3 my-auto"
              btnToggle="Forgot password?"
              isAnchor={true}
              variant="outline"
              isFooter={false}
              isHeader={false}
              modalBody={<ResetPassword setModal={setModal} modal={modal} />}
              modal={modal}
              toggle={toggle}
              isImage={true}
              imgSrc="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
              size="md"
            />
          </div>
          {loadingData ? (
            <BaseButton
              color="danger"
              type="submit"
              nameTitle="login-form-button"
              icon={<LoadingOutlined />}
              disabled={true}
            />
          ) : (
            <BaseButton
              color="danger"
              value="SIGN IN"
              type="submit"
              nameTitle="login-form-button"
            />
          )}

          <div className="divider d-flex align-items-center mb-2 mt-2 ">
            <p className="text-center  mx-3 mb-2">OR</p>
          </div>
          <div>
            {" "}
            {/* <BaseButton
              color="danger"
              value="LOGIN WITH GOOGLE"
              variant="outline"
              type="submit"
              nameTitle="login-form-button  mb-1"
            /> */}
            <LoginWithGoogle />
          </div>
          {/* <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        /> */}
          <div className="text-center">
            <p>
              Don't have an account?{" "}
              <NavLink
                to="/register"
                style={{
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#3b71ca",
                  textDecoration: "none",
                }}
              >
                Sign Up
              </NavLink>
            </p>
          </div>
        </MDBContainer>
      </Form>
    </>
  );
};

export default UserLoginPage;
