import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseRangePicker } from "src/components/Base/BaseRangePicker/BaseRangePicker";
// import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { SelectInputMilestone } from "src/components/Base/BaseSelectInput/SelectInputMilestone";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import * as Yup from "yup";
import "./NewMilestone.scss";
import { Spin } from "antd";
import { HandleAuth } from "src/utils/handleAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
// const { RangePicker } = DatePicker;
import Draggable from "react-draggable";
import { InheritedEnum } from "src/enum/Enum";

export const NewMilestone = ({
  id,
  selectType,
  typeMilestone,
  milestone,
  fetchData,
  searchParams,
  classMilestones,
  option,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  let addNewInit = "";
  switch (typeMilestone) {
    case "class":
      addNewInit = {
        milestone_name: "",
        from_date: "",
        to_date: "",
        status: 1,
        class_id: id,
        description: "",
        is_customized: true,
        created_by: currentUser.email,
        action: InheritedEnum.Class,
      };
      break;
    case "project":
      addNewInit = {
        milestone_name: "",
        from_date: "",
        to_date: "",
        status: 1,
        project_id: id,
        description: "",
        parent_id: "",
        class_id: option.class_id,
        is_customized: false,
        is_editable: true,
        created_by: currentUser.email,
        action: InheritedEnum.Project,
      };
      break;
    default:
      break;
  }
  const formik = useFormik({
    initialValues: { ...addNewInit },
    validationSchema: Yup.object({
      milestone_name: Yup.string()
        .required("Milestone Name is required")
        .max(255, "Must be less than 255 characters"),
      // parent_id: Yup.string().required("Milestone Parent is required"),
    }),
    validate: (values) => {
      const errors = {};
      if (typeMilestone === "project" && values.parent_id === "") {
        errors.parent_id = "Milestone Parent is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      // window.alert("Form submitted");
      setLoadingData(true);
      const { data, err } = await axiosClient.post(`/Milestone`, values);
      if (err) {
        // toast.error("Add milestone fail!");
        showErrorMessage(err);
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
        return;
      } else {
        toast.success("Add milestone successfully!");
        setLoadingData(false);
        formik.resetForm();
        setModal(!modal);
        fetchData(searchParams);
      }
    },
  });
  const [modal, setModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setModalPosition(initialPosition);
    }
    formik.resetForm();
  };

  const handleDrag = (e, ui) => {
    const { x, y } = modalPosition;
    setModalPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
  };

  const handleStop = () => {
    // Do nothing when stopped
  };

  const handleOpen = () => {
    const modalContent = document.querySelector(".modal-content");
    const modalWidth = modalContent.offsetWidth;
    const modalHeight = modalContent.offsetHeight;
    const centerX = window.innerWidth / 2 - modalWidth / 2;
    const centerY = window.innerHeight / 2 - modalHeight / 2;

    setModalPosition({ x: centerX, y: centerY });
    setInitialPosition({ x: centerX, y: centerY });
    setModal(true);
  };

  return (
    <>
      <BaseButton
        nameTitle="my-auto ms-3 px-3 py-2 col-lg-3 col-md-3 mb-1 float-end addNewBtn"
        onClick={toggle}
        color="warning"
        value="Add New"
      />
      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onDrag={handleDrag}
        onStop={handleStop}
      >
        <Modal
          isOpen={modal}
          toggle={toggle}
          size="lg"
          centered
          destroyOnClose={true}
        >
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <ModalHeader toggle={toggle}> New Milestone</ModalHeader>

            <ModalBody
              className="row"
              style={loadingData ? { pointerEvents: "none" } : {}}
            >
              <div className="col-md-6 col-sm-12 px-3">
                <BaseInputField
                  type="text"
                  label="Milestone Name"
                  value={formik.values.milestone_name}
                  placeholder="Enter Milestone Name"
                  classNameInput={
                    formik.errors.milestone_name &&
                    formik.touched.milestone_name
                      ? "is-invalid"
                      : ""
                  }
                  important="true"
                  formik={formik}
                  isRandom={false}
                  onChange={formik.handleChange}
                  id="milestone_name"
                  readOnly={false}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.milestone_name &&
                formik.touched.milestone_name ? (
                  <p className="errorMsg"> {formik.errors.milestone_name} </p>
                ) : (
                  <p className="hiddenMsg">acb</p>
                )}
              </div>
              {typeMilestone === "project" && (
                <div className="col-md-6 col-sm-12 px-3">
                  <SelectInputMilestone
                    label="Milestone Parent"
                    id="parent_id"
                    defaultValue={formik.values.parent_name ? "" : undefined}
                    options={classMilestones}
                    onChange={formik.handleChange}
                    important="true"
                    formik={formik}
                    isFilter={false}
                    placeholder="Milestone Manager"
                    status={
                      formik.errors.parent_id && formik.touched.parent_id
                        ? "error"
                        : ""
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.parent_id && formik.touched.parent_id ? (
                    <p className="errorMsg"> {formik.errors.parent_id} </p>
                  ) : (
                    <p className="hiddenMsg">acb</p>
                  )}
                </div>
              )}

              <div className="col-md-6 col-sm-12 px-3">
                <BaseRangePicker
                  id="fromTo_date"
                  name="fromTo_date"
                  className="w-100 px-2 datePicker"
                  label="From Date - To Date"
                  valueFromDate={formik.values.from_date}
                  valueToDate={formik.values.to_date}
                  important="true"
                  formik={formik}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  status={
                    formik.errors.from_date && formik.touched.from_date
                      ? "error"
                      : ""
                  }
                />
                {formik.errors.from_date && formik.touched.from_date ? (
                  <p className="errorMsg"> {formik.errors.from_date} </p>
                ) : (
                  <p className="hiddenMsg">acb</p>
                )}
              </div>
              {typeMilestone === "project" ? (
                <div className="col-md-6 col-sm-12 mt-4 px-3">
                  {/* <BaseRadio label="Status" important="true" formik={formik} type="status"/> */}
                  <BaseRadio
                    value={formik.values.status}
                    formik={formik}
                    type="status"
                    feature="pending"
                    isLabel={true}
                  />
                </div>
              ) : (
                <div className="col-md-6 col-sm-12 px-3">
                  {/* <BaseRadio label="Status" important="true" formik={formik} type="status"/> */}
                  <BaseRadio
                    value={formik.values.status}
                    formik={formik}
                    type="status"
                    feature="pending"
                    isLabel={false}
                  />
                </div>
              )}
              {typeMilestone === "project" ? (
                <div className="col-md-12 col-sm-12 px-3 ">
                  <BaseTextArea
                    formik={formik}
                    label="Description"
                    placeholder="Description"
                    important="false"
                    row="4"
                  />
                </div>
              ) : (
                <div className="col-md-12 col-sm-12 mt-3 px-3 ">
                  <BaseTextArea
                    formik={formik}
                    label="Description"
                    placeholder="Description"
                    important="false"
                    row="4"
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              {loadingData ? (
                // <Spin size="large" width="50px" height="50px" />
                <BaseButton
                  nameTitle="ms-3 me-0 btnLoadingAddMile "
                  type="submit"
                  color="secondary"
                  icon={<LoadingOutlined />}
                  disabled={true}
                />
              ) : (
                <BaseButton
                  nameTitle="ms-3 me-0"
                  type="submit"
                  value="Add New"
                  color="secondary"
                />
              )}
            </ModalFooter>
          </form>
        </Modal>
      </Draggable>
    </>
  );
};
