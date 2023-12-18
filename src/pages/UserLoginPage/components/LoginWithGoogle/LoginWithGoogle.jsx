import { jwtDecode } from "jwt-decode";
import React from "react";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { setLoggedInUser } from "src/app/feature/user/UserSlice";
import { axiosClient } from "src/axios/AxiosClient";

const clientId =
  "436820330351-egki06cp3o90rk02uvhh6hmi0idjme9q.apps.googleusercontent.com";
export const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchLoginWithGoogle = async (account) => {
    const { data, err } = await axiosClient.post(
      `/User/google-signin?email=${account.email}&name=${account.name}&avatar=${account.imageUrl}`
    );
    if (err) {
      toast.error("LOGIN Fail!!!");
      navigate("/sign-in");
    } else {
      localStorage.setItem("token", data);
      dispatch(setLoggedInUser(jwtDecode(data)));
      toast.success("LOGIN SUCCESS!!!");
      navigate("/user-dashboard");
    }
  };

  const onSuccess = (res) => {
    console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
    localStorage.setItem('login', 'google')
    fetchLoginWithGoogle(res.profileObj);
  };

  const onFailure = (res) => {
    console.log("LOGIN Fail! res: ", res);
  };
  return (
    <>
      <div id="loginGoogle">
        <GoogleLogin
          clientId={clientId}
          onSuccess={onSuccess}
          onFailure={onFailure}
          buttonText="Sign in with Google"
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      </div>
    </>
  );
};
