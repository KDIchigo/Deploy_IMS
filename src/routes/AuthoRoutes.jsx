import { Navigate, useLocation } from "react-router";
import { HandleAuth } from "src/utils/handleAuth";
export const AuthoRoutes = ({ path, element, listRole }) => {
  const { accessToken, currentUser, IsLoggedIn } = HandleAuth();
  const location = useLocation();
  return (
    <>
      {IsLoggedIn() && listRole.includes(currentUser?.role) ? (
        element
      ) : (
        <Navigate to="/access-denied" state={{ from: location }} replace />
      )}
    </>
  );
};
