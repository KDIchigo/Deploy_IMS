import { LoadingOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { ConditionEnum, UserEnum } from "src/enum/Enum";
import * as Yup from "yup";
import "./NewClassStudent.scss";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const NewClassStudent = ({
  modal,
  setModalStudent,
  classId,
  fetchData,
  searchParams,
}) => {
  // const [modal, setModal] = useState(false);

  // const toggle = () => setModal(!modal);
  const [loadingData, setLoadingData] = useState(false);
  const [role, setRole] = useState(null);
  const [roleParam, setRoleParam] = useState([
    {
      field: "setting_value",
      value: "Student",
      condition: ConditionEnum.Equal,
    },
  ]);
  const onChange = (key) => {
    console.log(key);
  };
  let settingId = null;
  const formik = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      password: "Dung1881@",
      phone_number: "",
      note: "",
      setting_id: "",
      status: 1,
      action: UserEnum.Add,
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Fullname is required")
        .min(4, "Must be 4 characters or more"),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        ),
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
    }),
    onSubmit: async (values) => {
      const newValue = {
        ...values,
        setting_id: role[0].setting_id,
      };
      setLoadingData(true);
      const { data: user, err } = await axiosClient.post(`/User`, newValue);
      if (err) {
        // toast.error(err.response.data.Message);
        showErrorMessage(err);
        formik.resetForm();
        setLoadingData(false);
        setModalStudent(!modal);
        return;
      } else {
        // window.alert("add");
        const { data: userByEmail } = await axiosClient.post(
          "/User/GetFilterData?sortString=created_date ASC",
          [
            {
              field: "email",
              value: newValue.email,
              condition: ConditionEnum.Equal,
            },
          ]
        );
        const { data, err } = await axiosClient.post("/ClassStudent", {
          student_id: userByEmail[0].user_id,
          class_id: classId,
          status: 1,
        });
        if (!err) {
          toast.success("Add student successfully!");
          setLoadingData(false);
          setModalStudent(!modal);
          formik.resetForm();
          toggle();
          fetchData(searchParams);
        }
      }
    },
  });
  const toggle = () => {
    setModalStudent(!modal);
    formik.resetForm();
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: roleArr } = await axiosClient.post(
        "/Setting/GetFilterData?sortString=display_order ASC",
        [
          {
            field: "setting_value",
            value: "Student",
            condition: ConditionEnum.Equal,
          },
        ]
      );

      setRole(roleArr);
      // console.log("role", role);
      // console.log(role[0].setting_id);
      // formik.setFieldValue("setting_id", role[0].setting_id);
    };
    fetchData();
  }, []);
  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggle} size="lg" centered>
          {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} className="px-3"/> */}
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <ModalHeader toggle={toggle}> New Class Student</ModalHeader>

            <ModalBody style={loadingData ? { pointerEvents: "none" } : {}}>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <BaseInputField
                    type="text"
                    id="fullname"
                    name="fullname"
                    label="Full name"
                    onBlur={formik.handleBlur}
                    placeholder="Enter Full name"
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
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
                <div className="col-md-6 col-sm-12">
                  <BaseInputField
                    type="text"
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Enter Email"
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    classNameInput={
                      formik.errors.email && formik.touched.email
                        ? "is-invalid"
                        : ""
                    }
                    important="true"
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <p className="errorMsg"> {formik.errors.email} </p>
                  ) : (
                    <p className="hiddenMsg">acb</p>
                  )}
                </div>
                <div className="col-md-6 col-sm-12">
                  <BaseInputField
                    type="text"
                    id="phone_number"
                    label="Phone"
                    placeholder="Enter Phone"
                    onBlur={formik.handleBlur}
                    value={
                      formik.values.phone_number === null
                        ? ""
                        : formik.values.phone_number
                    }
                    onChange={formik.handleChange}
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
                {/* <div className="col-md-6 col-sm-12">
                  <GeneratePassword
                    length="10"
                    uppercase={true}
                    lowercase={true}
                    numbers={true}
                    symbols={true}
                    placeholder="Enter Password"
                    classNameInput={
                      formik.errors.password && formik.touched.password
                        ? "is-invalid"
                        : ""
                    }
                    label="Password"
                    important="true"
                    isRandom={true}
                    formik={formik}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p className="errorMsg"> {formik.errors.password} </p>
                  ) : (
                    <p className="hiddenMsg">acb</p>
                  )}
                </div> */}
                <div className="col-md-6 col-sm-12">
                  <BaseRadio
                    value={formik.values.status}
                    formik={formik}
                    type="status"
                    isLabel={true}
                    label="Status"
                    important="true"
                  />
                  {/* <BaseCheckbox formik={formik} type="status" /> */}
                </div>
                <div className="col-md-12 col-sm-12">
                  <BaseTextArea
                    formik={formik}
                    label="Note"
                    placeholder="Note"
                    important="false"
                    type="user"
                    row="4"
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              {loadingData ? (
                // <Spin size="large" width="50px" height="50px" />
                <BaseButton
                  nameTitle="ms-3 px-3 btnLoadingStudent "
                  type="submit"
                  color="secondary"
                  icon={<LoadingOutlined />}
                  disabled={true}
                />
              ) : (
                <BaseButton
                  nameTitle="ms-3 px-3"
                  type="submit"
                  value="Add New"
                  color="secondary"
                />
              )}
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </>
  );
};
