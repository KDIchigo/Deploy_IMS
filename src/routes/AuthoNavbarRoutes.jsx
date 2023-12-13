import { HandleAuth } from "src/utils/handleAuth";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const AuthoNavbarRoutes = () => {
  const { accessToken, currentUser, IsLoggedIn } = HandleAuth();
  const itemNavbar = (element, title, position, icon, listRole, children, type) => {
    if (IsLoggedIn() && listRole.includes(currentUser?.role)) {
      return element.push(getItem(title, position, icon, children, type));
    }
  };

  const itemNavbarChild = (title, position, icon, listRole, children) => {
    if (IsLoggedIn() && listRole.includes(currentUser?.role)) {
      return getItem(title, position, icon, children);
    }
  };
  //   return (
  //     <>
  //       {IsLoggedIn() && listRole.includes(currentUser?.role) ? (
  //         element
  //       ) : (
  //         <Navigate to="/access-denied" state={{ from: location }} replace />
  //       )}
  //     </>
  //   );
  return { itemNavbarChild, itemNavbar };
};
