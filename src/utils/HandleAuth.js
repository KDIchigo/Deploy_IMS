import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useSelector } from "react-redux";

const getAccessToken = () => {
  return localStorage.getItem("token");
};
const getJwtUser = () => {
  const token = localStorage.getItem("token")
  return token === null ? null : jwtDecode(localStorage.getItem("token"));
};
export const HandleAuth = () => {
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [currentUser, setCurrentUser] = useState(getJwtUser());

  const loggedIn = useSelector((state) => state.user.loggedIn);
  const IsLoggedIn = () => {
    return loggedIn;
  };

  const IsStudent = () => {
    return loggedIn && loggedIn.role === "Student";
  };

  const IsAdmin = () => {
    return loggedIn && loggedIn.role === "Admin";
  };

  const IsManager = () => {
    return loggedIn && loggedIn.role === "Manager";
  };

  const IsTeacher = () => {
    return loggedIn && loggedIn.role === "Teacher";
  };
  
  const IsLeader = (leaderId) => {
    return loggedIn && loggedIn.role === "Student" && currentUser.user_id === leaderId;
  };
  return {
    accessToken,
    currentUser,
    IsLoggedIn,
    IsAdmin,
    IsManager,
    IsStudent,
    IsTeacher,
    IsLeader,
  };
};
