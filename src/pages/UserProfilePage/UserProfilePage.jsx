import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum, SettingEnum } from "src/enum/Enum";
import "./UserProfilePage.scss";
import { FormProfile } from "./components/FormProfile/FormProfile";
import { jwtDecode } from "jwt-decode";

export const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [userParams, setUserParams] = useState({
    email: "",
    fullname: "",
    password: "",
    phone_number: "",
    description: "",
    setting_id: "",
    setting_name: "",
    setting_value: "",
    status: "",
    user_id: "",
    user_name: "",
  });

  const userId = jwtDecode(localStorage.getItem("token")).user_id;
  // console.log(jwtDecode(localStorage.getItem("token")));
  useEffect(() => {
    const fetchData = async () => {
      const { data: userArr } = await axiosClient.get(`/User/${userId}`);
      setUser(userArr);

      const { data: roleArr } = await axiosClient.post(
        `/Setting/GetFilterData?sortString=created_date ASC`,
        [
          {
            field: "data_group",
            value: SettingEnum.Role,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setRoles(roleArr);
    };
    fetchData();
  }, []);

  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <NavbarDashboard
        spin={true}
        dashboardBody={
          <div className="pt-3 d-flex flex-column flexGrow_1">
            <div className="col-xl-12">
              <div className="card custom-card">
                <div className="card-body">
                  <div className="contact-header">
                    <div className="row align-items-center justify-content-between d-flex flex-row">
                      <div className="col-xl-1 col-l h5 fw-bold mb-0 pe-0 d-flex flex-row flexGrow_1">
                        User Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                {Array.isArray(roles) && roles.length && user !== null ? (
                  <FormProfile user={user} roles={roles} userId={userId} />
                ) : (
                  <ReactLoading height={"20%"} width={"20%"} />
                )}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
