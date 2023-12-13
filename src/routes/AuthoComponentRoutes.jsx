import { Navigate, useLocation } from "react-router";
import { HandleAuth } from "src/utils/handleAuth";
export const AuthoComponentRoutes = ({ path, element, listRole }) => {
  const { accessToken, currentUser, IsLoggedIn } = HandleAuth();
  const location = useLocation();
  return (
    <>{IsLoggedIn() && listRole.includes(currentUser?.role) ? element : ""}</>
  );
};
