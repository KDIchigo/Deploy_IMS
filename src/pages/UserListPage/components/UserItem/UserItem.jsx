import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseBadge } from "src/components/Base/BaseBadge/BaseBadge";
import { UserDetails } from "../UserDetails/UserDetails";

export const UserItem = ({ user, roles, fetchData, searchParams }) => {
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const roleBadges = [
    {
      role: "Admin",
      color: "danger",
    },
    {
      role: "Manager",
      color: "secondary",
    },
    {
      role: "Teacher",
      color: "success",
    },
    {
      role: "Student",
      color: "primary",
    },
  ];

  const handleChangeStatus = async (userId, status) => {
    const userIdArr = [];
    userIdArr.push(userId);
    const { data, err } = await axiosClient.post(
      `/User/UpdateStatus?status=${status}`,
      userIdArr
    );
    if (err) {
      window.alert("Change fail!");
      return;
    } else {
      window.alert("Change Successful!");
      fetchData(searchParams);
    }
  };

  const roleBage = roleBadges.filter(
    (roleBadge) => roleBadge.role == user.setting_value
  );
  console.log(user)
  return (
    <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
      <div className="card custom-card">
        <div className="card-body contact-action position-relative">
          <div className="contact-overlay"></div>
          <div className="d-flex align-items-top ">
            <div className="d-flex flex-fill flex-wrap gap-2">
              <div className="avatar avatar-xl avatar-rounded me-3">
                <img src="/src/images/user_none_img.jpg" alt="" />
              </div>
              <div>
                <h6 className="mb-1 fw-semibold">{user.fullname}</h6>
                <p className="mb-1 text-muted contact-mail text-truncate">
                  {user.email}
                </p>
                <p className="fw-semibold fs-11 mb-0 text-primary">
                  {user.phone_number}
                </p>
              </div>
            </div>
            <div className="position-absolute bottom-0 end-0 me-3 mb-2">
              <BaseBadge
                color={roleBage[0].color}
                variant="transparent"
                bageName={user.setting_value}
              />
            </div>
            <div>
              <i className="ri-heart-3-fill fs-16 text-danger"></i>
              <div className="position-relative">
                {user.status === 1 ? (
                  <span className="position-absolute top-50 start-0 translate-middle-y p-1 bg-success border border-light rounded-circle"></span>
                ) : (
                  <span className="position-absolute top-50 start-0 translate-middle-y p-1 bg-danger border border-light rounded-circle"></span>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-2 contact-hover-buttons">
            <button
              type="button"
              className="btn btn-sm btn-light contact-hover-btn"
              onClick={() => setModal(!modal)}
            >
              Details
            </button>
            <UserDetails
              roles={roles}
              modal={modal}
              setModal={setModal}
              user={user}
              fetchData={fetchData}
              searchParams={searchParams}
            />
            <button
              aria-label="button"
              className="btn btn-sm btn-light contact-hover-btn position-relative"
              type="button"
              onClick={() => {
                const status = user.status === 1 ? 0 : 1;
                handleChangeStatus(user.user_id, status);
                fetchData(searchParams);
              }}
            >
              {user.status === 0 ? (
                <>
                  <span className="position-absolute top-50 start-0 ms-1 translate-middle-y p-1 bg-success border border-light rounded-circle"></span>
                  <span className="ms-2 text-success">Active</span>
                </>
              ) : (
                <>
                  <span className="position-absolute top-50 start-0 ms-1 translate-middle-y p-1 bg-danger border border-light rounded-circle"></span>
                  <span className="ms-2 text-danger">Inactive</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
