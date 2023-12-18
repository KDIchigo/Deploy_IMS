import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { SelectInputSettingGroup } from "src/components/Base/BaseSelectInput/SelectInputSettingGroup";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "./NewSystemSetting.scss";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { HandleAuth } from "src/utils/handleAuth";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

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
export const NewSystemSetting = ({
  fetchData,
  searchParams,
  settings,
  dataGroup,
}) => {
  // const [domainValidate, setDomainValidate] = useState();

  // let settingId = null;
  // const handleCheckDomain = (value) => {
  //   settingId = value;
  // };
  // const getUnique = (arr, data_group) => {
  //   const unique = arr
  //     .map((e) => e[data_group])

  //     // store the keys of the unique objects
  //     .map((e, i, final) => final.indexOf(e) === i && i)

  //     // eliminate the dead keys & store unique objects
  //     .filter((e) => arr[e])
  //     .map((e) => arr[e]);

  //   return unique;
  // };
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      description: "",
      setting_value: "",
      data_group: "",
      display_order: "",
      status: 1,
      created_by: currentUser.email,
    },
    validationSchema: Yup.object({
      setting_value: Yup.string()
        // .required("Setting Value is required")
        .max(255, "Setting Value must be lower than 255 characters"),
      display_order: Yup.string()
        .required("Display Order is required")
        .matches(
          /^[0-9]+$/,
          "Display Order must be numbers not contain characters"
        ),
    }),
    validate: (values) => {
      const errors = {};
      if (values.setting_value === "") {
        errors.setting_value = "Setting Value is required";
      }
      if (parseInt(values.data_group,10) === 3) {
        const postalCodePattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!postalCodePattern.test(values.setting_value)) {
          errors.setting_value = "Setting Value is valid email address";
        }
      }
      return errors;
    },
    onSubmit: async (values) => {
      setLoadingData(true);
      const { err } = await axiosClient.post(`/Setting`, values);

      if (err) {
        // toast.error("Add system setting fail!");
        showErrorMessage(err);
        setLoadingData(false);
      } else {
        toast.success("Add system setting successfully!");
        setLoadingData(false);
        formik.resetForm();
      }
      setModal(!modal);
      fetchData(searchParams);
      // console.log(values);
    },
  });
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    formik.resetForm();
  };
  return (
    <>
      <BaseButton
        nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>New System Setting</ModalHeader>

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
                label="Setting Group"
                id="data_group"
                defaultValue={formik.values.data_group}
                options={data_group}
                onChange={formik.handleChange}
                important="true"
                formik={formik}
                dataGroup={dataGroup}
                settings={settings}
                isFilter={false}
                placeholder="Setting Group"
                // handleCheckDomain={handleCheckDomain}
                status={
                  formik.errors.data_group && formik.touched.data_group
                    ? "error"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.data_group && formik.touched.data_group ? (
                <p className="errorMsg"> {formik.errors.data_group} </p>
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
            <div className="col-md-6 col-sm-12 px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
                label="Status"
                important="true"
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
                nameTitle="ms-3 px-3 btnLoadingSystem"
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
    </>
  );
};
