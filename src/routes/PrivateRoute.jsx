import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { setLoggedInUser } from "src/app/feature/user/UserSlice";

const checkExpToken = (exp) => {
  const currentDateTimestamp = Math.floor(Date.now() / 1000);
  return currentDateTimestamp > exp;
};

export const PrivateRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token !== null) {
    const currentUser = jwtDecode(token);
    dispatch(setLoggedInUser(currentUser));
  }
  useEffect(() => {
    if (token !== null) {
      try {
        const currentUser = jwtDecode(token);
        if (checkExpToken(currentUser.exp)) {
          navigate("/sign-in");
        } else {
          dispatch(setLoggedInUser(currentUser));
          // navigate("/user-dashboard");
        }
      } catch (error) {
        // Handle decoding error, e.g., log the error or redirect to sign-in
        // console.error("Error decoding token:", error);
        navigate("/sign-in");
      }
    } else {
      navigate("/access-denied");
    }
  }, [token, dispatch, navigate]);
  return <Outlet />;
};
