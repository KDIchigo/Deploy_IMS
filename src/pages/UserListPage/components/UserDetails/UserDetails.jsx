import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/Swal";
import * as Yup from "yup";
import "./UserDetails.scss";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
const status = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 0,
    label: "Inactive",
  },
];
function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}
export const UserDetails = ({
  roles,
  modal,
  setModal,
  user,
  fetchData,
  searchParams,
  code,
}) => {
  const toggle = () => {
    setModal(!modal);
    formik.resetForm({ values: { ...user } });
  };
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: {
      ...user,
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Fullname is required")
        .min(4, "Must be 4 characters or more")
        .max(255, "Fullname must be lower than 255 characters"),
      // user_name: Yup.string()
      //   .required("Username is required")
      //   .min(4, "Must be 4 characters or more"),
      // password: Yup.string()
      //   .required("Password is required")
      //   .matches(
      //     /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,19}$/,
      //     "Password must be 8-19 characters and contain at least one letter, one number and a special character"
      //   ),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        )
        .max(255, "Email must be lower than 255 characters"),
      phone_number: Yup.string()
        .nullable()
        .test(
          "is-valid-postal-code",
          "Phone must be a valid phone number and have 10 digits",
          function (value) {
            if (value && value.trim() !== null) {
              const postalCodePattern =
                /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
              if (!postalCodePattern.test(value)) {
                return false; // Validation failed
              }
            }
            return true;
          }
        ),
      setting_id: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: `Are you sure to update the user named ${code}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          console.log(result);
          if (result.isConfirmed) {
            setLoadingData(true);
            const { data, err } = await axiosClient.put(
              `/User/${user.user_id}`,
              values
            );
            if (err) {
              // toast.error(`The user named ${code} was updated fail!`);
              showErrorMessage(err);
              setLoadingData(false);
              return;
            } else {
              toast.success(`The user named ${code} was updated successfully!`);
              setLoadingData(false);
              formik.resetForm();
              setModal(!modal);
              fetchData(searchParams);
            }
          }
        });
    },
  });
  // useEffect(() => {
  //   formik.resetForm({ values: { ...user } })
  // })
  useEffect(() => {
    // Update initialValues whenever the user prop changes
    formik.setValues({
      ...user,
    });
  }, [user]);
  return (
    <>
      {/* <ToastContainer autoClose="2000" theme="colored" /> */}
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>User Details</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-12 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="fullname"
                name="fullname"
                label="Full name"
                placeholder="Enter Full name"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                classNameInput={
                  formik.errors.fullname && formik.touched.fullname
                    ? "is-invalid"
                    : ""
                }
                important="true"
              />
              {formik.errors.fullname && formik.touched.fullname ? (
                <p className="errorMsg"> {formik.errors.fullname} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="email"
                name="email"
                label="Email"
                placeholder="Enter Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                classNameInput={
                  formik.errors.email && formik.touched.email
                    ? "is-invalid"
                    : ""
                }
                important="true"
                readOnly={true}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="errorMsg"> {formik.errors.email} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="phone_number"
                label="Phone"
                placeholder="Enter Phone"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                classNameInput={
                  formik.errors.phone_number && formik.touched.phone_number
                    ? "is-invalid"
                    : ""
                }
              />
              {formik.errors.phone_number && formik.touched.phone_number ? (
                <p className="errorMsg"> {formik.errors.phone_number} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Role"
                type="setting"
                id="setting_id"
                defaultValue={formik.values.setting_value}
                options={roles}
                onChange={formik.handleChange}
                placeholder="Role"
                onBlur={formik.handleBlur}
                important="true"
                status={
                  formik.errors.setting_id && formik.touched.setting_id
                    ? "error"
                    : ""
                }
                formik={formik}
              />
              {formik.errors.setting_id && formik.touched.setting_id ? (
                <p className="errorMsg"> {formik.errors.setting_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3 mt-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
              />
              {/* <BaseCheckbox formik={formik} type="status" /> */}
            </div>
            <div className="col-md-12 col-sm-12 px-3 mt-1">
              <BaseTextArea
                formik={formik}
                label="Note"
                placeholder="Note"
                important="false"
                type="user"
                row="4"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {loadingData ? (
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingUser"
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                className="ms-3 px-3 "
                type="submit"
                value="Update"
                color="secondary"
              />
            )}
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
