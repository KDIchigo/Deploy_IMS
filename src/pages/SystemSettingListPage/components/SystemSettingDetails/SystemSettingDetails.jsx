import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { SelectInputSettingGroup } from "src/components/Base/BaseSelectInput/SelectInputSettingGroup";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import * as Yup from "yup";
import "./SystemSettingDetails.scss";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { HandleAuth } from "src/utils/handleAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const SystemSettingDetails = ({
  searchParams,
  setting,
  settings,
  fetchData,
  modal,
  dataGroup,
  setModal,
  code,
}) => {
  const data_group = [
    {
      value: 1,
      label: "Role",
    },
    {
      value: 2,
      label: "Semester",
    },
    {
      value: 3,
      label: "Email Domain",
    },
  ];
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      ...setting,
      modified_by: currentUser.email,
    },
    validationSchema: Yup.object({
      setting_value: Yup.string()
        .required("Setting Value is required")
        .max(255, "Setting Value must be lower than 255 characters"),
      display_order: Yup.string()
        .required("Display Order is required")
        .matches(
          /^[0-9]+$/,
          "Display Order must be numbers not contain characters"
        ),
    }),
    onSubmit: async (values) => {
      console.log(values);
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: `Are you sure to update the system setting named ${code}?`,
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: "Yes,update it!",
          cancelButtonText: "No, cancel!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            setLoadingData(true);
            const { err } = await axiosClient.put(
              `/Setting/${setting.setting_id}`,
              values
            );

            if (err) {
              // toast.error(`The system setting named ${code} was updated fail!`);
              showErrorMessage(err);
              setLoadingData(false);
            } else {
              toast.success(
                `The system setting named ${code} was updated successfully!`
              );
              setLoadingData(false);
              fetchData(searchParams);
            }
            toggle();
            // console.log("values", values);
          }
        });
    },
  });

  const toggle = () => {
    setModal(!modal);
    formik.resetForm({
      values: {
        ...setting,
        modified_by: currentUser.email,
      },
    });
  };
  useEffect(() => {
    // Update initialValues whenever the user prop changes
    formik.setValues({
      ...setting,
      modified_by: currentUser.email,
    });
  }, [setting]);
  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>System Setting Details</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="setting_value"
                name="setting_value"
                label="Setting Value"
                placeholder="Enter Setting Value"
                value={formik.values.setting_value}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.setting_value && formik.touched.setting_value
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.setting_value && formik.touched.setting_value ? (
                <p className="errorMsg"> {formik.errors.setting_value} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <SelectInputSettingGroup
                label="Data Group"
                id="data_group"
                defaultValue={formik.values.data_group}
                options={data_group}
                onChange={formik.handleChange}
                dataGroup={dataGroup}
                important="true"
                formik={formik}
                isFilter={false}
                placeholder="Data Group"
                status={
                  formik.errors.setting_id && formik.touched.setting_id
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.setting_id && formik.touched.setting_id ? (
                <p className="errorMsg"> {formik.errors.setting_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="display_order"
                name="display_order"
                label="Display Order"
                placeholder="Enter Display Order"
                value={formik.values.display_order}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.display_order && formik.touched.display_order
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.display_order && formik.touched.display_order ? (
                <p className="errorMsg"> {formik.errors.display_order} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mt-3 px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-0 px-3">
              <BaseTextArea
                formik={formik}
                label="Description"
                placeholder="Description"
                important="false"
                row={4}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3  btnLoadingUpSystem "
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                nameTitle="ms-3 "
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
