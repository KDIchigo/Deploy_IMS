import {
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import { MDBContainer, MDBIcon } from "mdb-react-ui-kit";
import { NavLink, useNavigate } from "react-router-dom";
import { Form } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import * as Yup from "yup";
import "./UserRegisterPage.scss";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { VerifyEmail } from "./VerifyEmail/VerifyEmail";
import { ConditionEnum } from "src/enum/Enum";
import { Spin } from "antd";

const UserRegisterPage = () => {
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [code, setCode] = useState("");
  const [user, setUser] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    {
      title: "first_page",
      page: <div style={{ width: "200px", height: "200px" }}>firstPage</div>,
    },
    {
      title: "second_page",
      page: <div style={{ width: "200px", height: "200px" }}>secondPage</div>,
    },
  ];
  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= items.length) {
      newIndex = items.length - 1;
    }
    setActiveIndex(newIndex);
  };

  const resendCode = async () => {
    setLoadingData(true);
    const { data, err } = await axiosClient.post("/User/register", user);

    if (err) {
      toast.error("Send code fail!");
      setLoadingData(false);
    } else {
      toast.success("Send code successfully!");
      setLoadingData(false);
      setCode(data);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const { data: roleArr } = await axiosClient.post(
        "/Setting/GetFilterData?sortString=display_order ASC",
        [
          {
            field: "setting_value",
            value: "Student",
            condition: ConditionEnum.Equal,
          },
        ]
      );

      setRole(roleArr);
      // console.log("role", role);
      // console.log(role[0].setting_id);
      // formik.setFieldValue("setting_id", role[0].setting_id);
    };
    getData();
  }, []);
  const formik = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      password: "",
      setting_id: "",
      status: 1,
      confirmedPassword: "",
      action: 1,
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Fullname is required")
        .min(4, "Must be 4 characters or more")
        .max(255, "Fullname must be lower than 255 characters"),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        )
        .max(255, "Email must be lower than 255 characters"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,19}$/,
          "Password must be 8-19 characters and contain at least one letter, one number and a special character"
        ),
      confirmedPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf(
          [Yup.ref("password"), null],
          "Confirm password must match with current password "
        ),
    }),
    onSubmit: async (values) => {
      const { confirmedPassword, ...user } = values;
      const newUser = {
        ...user,
        setting_id: role[0].setting_id,
      };
      setLoadingData(true);
      const { data, err } = await axiosClient.post("/User/register", newUser);
      if (err) {
        toast.error(err.response.data.Message);
        setLoadingData(false);
      } else {
        updateIndex(activeIndex + 1);
        setUser(newUser);
        setCode(data);
      }
    },
  });
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      <Form
        className="background-register"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className="register__body">
          <div className="carousel__regis ">
            <div
              className="inner__regis"
              style={{ transform: `translate(-${activeIndex * 100}%)` }}
            >
              <div className="carousel-item__regis" style={{ width: "100%" }}>
                <MDBContainer
                  className="p-3 mt-5 flex-column "
                  style={loadingData ? { pointerEvents: "none" } : {}}
                >
                  <div className="d-flex flex-row mt-4 mb-3">
                    <MDBIcon
                      fas
                      icon="cubes fa-3x me-3"
                      style={{ color: "#ff6219" }}
                    />
                    <span className="h1 fw-bold mb-0">IMS</span>
                  </div>
                  {/* <div className="d-flex flex-row ">
                    <p className="lead fw-normal mb-0">Sign in with</p>
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
                    <BaseButton
                      nameTitle="rounded-circle btnLogin_logo me-3 facebook position-relative"
                      color="primary"
                      value={
                        <MDBIcon
                          fab
                          icon="facebook-f"
                          className="position-absolute top-50 start-50 translate-middle"
                        />
                      }
                    />
                    <BaseButton
                      nameTitle="rounded-circle btnLogin_logo position-relative"
                      color="secondary"
                      value={
                        <MDBIcon
                          fab
                          icon="twitter"
                          className="position-absolute top-50 start-50 translate-middle"
                        />
                      }
                    />
                  </div>
                  <div className="divider d-flex align-items-center my-3">
                    <p className="text-center  mx-3 mb-0">or continue with</p>
                  </div> */}
                  <BaseInputField
                    type="name"
                    id="fullname"
                    name="fullname"
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your fullname"
                    label="Fullname"
                    classNameDiv="col-12 "
                    important="true"
                    icon={<UserOutlined style={{ color: "gray" }} />}
                    classNameInput={
                      formik.errors.fullname && formik.touched.fullname
                        ? "is-invalid"
                        : ""
                    }
                  />

                  {formik.errors.fullname && formik.touched.fullname ? (
                    <p className="errorMsg"> {formik.errors.fullname} </p>
                  ) : (
                    <p className="hiddenMsg">acb</p>
                  )}
                  <BaseInputField
                    type="email"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email"
                    label="Email"
                    classNameDiv="col-12 "
                    important="true"
                    icon={<MailOutlined style={{ color: "gray" }} />}
                    classNameInput={
                      formik.errors.email && formik.touched.email
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <p className="errorMsg"> {formik.errors.email} </p>
                  ) : (
                    <p className="hiddenMsg">acb</p>
                  )}
                  <BaseInputField
                    type="password"
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter password"
                    label="Password"
                    classNameDiv="col-12 "
                    important="true"
                    icon={<LockOutlined style={{ color: "gray" }} />}
                    classNameInput={
                      formik.errors.password && formik.touched.password
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p className="errorMsg"> {formik.errors.password} </p>
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
                    classNameDiv="col-12 mb-2"
                    important="true"
                    icon={<LockOutlined style={{ color: "gray" }} />}
                    classNameInput={
                      formik.errors.confirmedPassword &&
                      formik.touched.confirmedPassword
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.errors.confirmedPassword &&
                  formik.touched.confirmedPassword ? (
                    <p className="errorMsg mb-3">
                      {" "}
                      {formik.errors.confirmedPassword}{" "}
                    </p>
                  ) : (
                    <p className="hiddenMsg mb-2">acb</p>
                  )}
                  {loadingData ? (
                    <BaseButton
                      color="danger"
                      type="submit"
                      nameTitle="register-form-button"
                      icon={<LoadingOutlined />}
                      disabled={true}
                    />
                  ) : (
                    <BaseButton
                      color="danger"
                      type="submit"
                      value="SIGN UP"
                      nameTitle="register-form-button"
                    />
                  )}
                  <div className="divider d-flex align-items-center mb-2 mt-2 ">
                    <p className="text-center  mx-3 mb-2">OR</p>
                  </div>
                  <div>
                    {" "}
                    <BaseButton
                      color="danger"
                      value="LOGIN WITH GOOGLE"
                      variant="outline"
                      nameTitle="login-form-button mb-1"
                    />
                  </div>
                  {/* <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        /> */}
                  <div className="text-center ">
                    <p>
                      Already have an account?{" "}
                      <NavLink
                        to="/sign-in"
                        style={{
                          cursor: "pointer",
                          fontSize: "13px",
                          color: "#3b71ca",
                          textDecoration: "none",
                        }}
                      >
                        Sign In
                      </NavLink>
                    </p>
                  </div>
                </MDBContainer>
              </div>
              <div className="carousel-item__regis" style={{ width: "100%" }}>
                <VerifyEmail code={code} user={user} resendCode={resendCode} />
              </div>
            </div>
            {/* <div className="carousel-buttons__regis">
            <button
              className="button-arrow__regis"
              onClick={() => {
                updateIndex(activeIndex - 1);
              }}
            >
              <span className="material-symbols-outlined">Previous</span>{" "}
            </button>
            <div className="indicators__regis">
              {items.map((item, index) => (
                <button
                  key={index}
                  className="indicator-buttons__regis"
                  onClick={() => {
                    updateIndex(index);
                  }}
                >
                  <span
                    className={`material-symbols-outlined ${
                      index === activeIndex
                        ? "indicator-symbol-active__regis"
                        : "indicator-symbol__regis"
                    }`}
                  >
                    {index}
                  </span>
                </button>
              ))}
            </div>
            <button
              className="button-arrow__regis"
              onClick={() => {
                updateIndex(activeIndex + 1);
              }}
            >
              <span className="material-symbols-outlined">Next</span>
            </button>
          </div> */}
          </div>
        </div>
      </Form>
    </>
  );
};

export default UserRegisterPage;
