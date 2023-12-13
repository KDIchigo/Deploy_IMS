import { MDBContainer } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import VerificationInput from "react-verification-input";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import "./VerifyEmail.scss";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
export const VerifyEmail = ({ code, user, resendCode }) => {
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();
  const [verificationValue, setVerificationValue] = useState();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  // Event handler to capture the value when it changes
  const handleInputChange = (value) => {
    setVerificationValue(value);
  };

  const fetchCodeVerify = async () => {
    setLoadingData(true);
    const { data, err } = await axiosClient.post("/User", user);
    // console.log(user);
    if (err) {
      toast.error("Sign up failed!");
      setLoadingData(false);
    } else {
      toast.success("Sign up successfully!");
      setLoadingData(false);
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    }
  };

  const handleCheckVerify = () => {
    // console.log(code);
    // console.log(parseInt(verificationValue, 10));
    if (parseInt(verificationValue, 10) === code && isCheckboxChecked) {
      fetchCodeVerify();
    }
  };
  useEffect(() => {});
  return (
    <>
      <div className="background-verify w-100" style={{ minHeight: "676px" }}>
        <MDBContainer
          className="p-3 flex-column body-Verify"
          style={loadingData ? { pointerEvents: "none" } : {}}
        >
          <h2 className="title-verifyMail">OTP Verification</h2>
          <div className="d-flex mb-4">
            <img src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2Femail.png?alt=media&token=df8a4f26-0c4f-43e0-9e27-c47edb7d259d" />
            <span
              className="d-block text-center"
              style={{ fontSize: "14px", backgroundColor: "#b6ffe38c" }}
            >
              Enter this verification code with a 6 digit <br></br>on your email
              to sign in.Please check mail
            </span>
          </div>
          <VerificationInput
            value={verificationValue}
            onChange={handleInputChange}
            length={6}
            validChars="0-9"
            removeDefaultStyles
            container={{
              className: "container",
            }}
            characters={{
              className: "characters",
            }}
            character={{
              className: "character",
              classNameInactive: "character--inactive",
              classNameSelected: "character--selected",
            }}
          />

          <div className="form-check mt-4 mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="defaultCheck1"
              style={{
                borderColor: "darkgray",
                width: "0.7rem",
                height: "0.75rem",
              }}
              onChange={(e) => {
                setIsCheckboxChecked(e.target.checked);
              }}
            />
            <label className="form-check-label">
              Did not recieve a code ?
              <a
                style={{ cursor: "pointer" }}
                className="text-primary ms-2 d-inline-block"
                onClick={() => resendCode()}
              >
                Resend
              </a>
            </label>
          </div>
          {loadingData ? (
            <BaseButton
              type="button"
              color="danger"
              icon={<LoadingOutlined />}
              disabled={true}
              nameTitle="verifyMail-form-button mx-auto col-12 mt-2"
            />
          ) : (
            <BaseButton
              type="button"
              color="danger"
              value="Submit"
              nameTitle="verifyMail-form-button mx-auto col-12 mt-2"
              onClick={() => handleCheckVerify()}
            />
          )}
          <div className="text-center">
            <p className="fs-12 text-danger mt-2">
              <sup>
                <i className="ri-asterisk"></i>
              </sup>
              Don't share the verification code with anyone !
            </p>
          </div>
        </MDBContainer>
      </div>
    </>
  );
};
