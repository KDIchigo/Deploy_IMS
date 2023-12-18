import { GoogleLogout } from "react-google-login";

const clientId =
  "436820330351-egki06cp3o90rk02uvhh6hmi0idjme9q.apps.googleusercontent.com";
export const LogoutWithGoogle = () => {
  const onSuccess = () => {
    // console.log("LOGOUT SUCCESSFull!");
    localStorage.removeItem('login')
  };

  return (
    <>
      <div id="logoutGoogle">
        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={onSuccess}
        />
      </div>
    </>
  );
};
