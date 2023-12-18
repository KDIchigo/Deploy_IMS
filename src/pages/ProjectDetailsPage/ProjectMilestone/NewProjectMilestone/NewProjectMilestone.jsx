import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseRangePicker } from "src/components/Base/BaseRangePicker/BaseRangePicker";

import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import * as Yup from "yup";

import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { SelectInputMilestone } from "src/components/Base/BaseSelectInput/SelectInputMilestone";
import "./NewProjectMilestone.scss";
import { HandleAuth } from "src/utils/handleAuth";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import Draggable from "react-draggable";
import { LoadingOutlined } from "@ant-design/icons";
import { InheritedEnum } from "src/enum/Enum";
import dayjs from "dayjs";

export const NewProjectMilestone = ({
  projectId,
  fetchData,
  searchParams,
  classMilestones,
  project,
}) => {
  const { currentUser } = HandleAuth();
  const [modal, setModal] = useState(false);
  const [selectMileParent, setSelectMileParent] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [loadingData, setLoadingData] = useState(false);
  const formik = useFormik({
    initialValues: {
      milestone_name: "",
      from_date: "",
      to_date: "",
      status: 1,
      description: "",
      project_id: projectId,
      class_id: project.class_id,
      parent_id: "",
      is_customized: false,
      is_editable: true,
      created_by: currentUser.email,
    },
    validationSchema: Yup.object({
      milestone_name: Yup.string()
        .required("Milestone Name is required")
        .max(255, "Must be less than 255 characters"),
      // from_date: Yup.string().required("From Date is required"),
      // to_date: Yup.string().required("To Date is required"),
      // fromTo_date: Yup.string().required("To Date is required"),
      // project_id: Yup.string().required("Project Code is required"),
      // assignment_id: Yup.string().required("Assignment is required"),
    }),
    validate: (values) => {
      if (formik.values.parent_id !== "") {
        const mileParent = classMilestones.filter(
          (ele) => ele.milestone_id === formik.values.parent_id
        )[0];
        setSelectMileParent(mileParent);
        console.log(mileParent);
      }
      // const errors = {};
      // if (formik.values.parent_id !== "") {
      //   errors.parent_id = "Milestone Parent is required";
      // }
      // return errors;
    },
    onSubmit: async (values) => {
      const newValue = {
        ...values,
        class_id: project.class_id,
        action: InheritedEnum.Project,
      };
      const { data, err } = await axiosClient.post(`/Milestone`, newValue);
      if (err) {
        // toast.error("Add milestone fail!");
        showErrorMessage(err);
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
        return;
      } else {
        toast.success("Add milestone successfully!");
        formik.resetForm();
        setModal(!modal);
        fetchData(searchParams);
      }
      // console.log(values);
    },
  });

  const disabledDate = (current) => {
    // Disable dates before today or after a specific future date
    const formattedLimitFromDate = dayjs(selectMileParent.from_date);
    const formattedLimitToDate = dayjs(selectMileParent.to_date);

    let isLimitDate = undefined;
    if (
      selectMileParent.from_date !== undefined &&
      selectMileParent.to_date !== undefined
    ) {
      isLimitDate =
        current &&
        (current < formattedLimitFromDate.startOf("day") ||
          current > formattedLimitToDate.endOf("day"));
    }
    return isLimitDate;
  };

  const handleDrag = (e, ui) => {
    const { x, y } = modalPosition;
    setModalPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
  };

  const handleStop = () => {
    // Do nothing when stopped
  };

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setModalPosition(initialPosition);
    }
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
      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onDrag={handleDrag}
        onStop={handleStop}
      >
        <Modal isOpen={modal} toggle={toggle} size="lg" centered>
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <ModalHeader toggle={toggle}> New Project Milestone</ModalHeader>
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
                  name="milestone_name"
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

              <div className="col-md-6 col-sm-12 px-3">
                <SelectInputMilestone
                  label="Milestone Parent"
                  id="parent_id"
                  defaultValue={formik.values.milestone_name ? "" : undefined}
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

              <div className="col-md-6 col-sm-12 px-3">
                <BaseRangePicker
                  id="fromTo_date"
                  name="fromTo_date"
                  className="w-100 px-2 datePicker"
                  label="From Date - To Date"
                  valueFromDate={formik.values.from_date}
                  valueToDate={formik.values.to_date}
                  disabledDate={disabledDate}
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
              <div className="col-md-6 col-sm-12 px-3">
                {/* <BaseRadio label="Status" important="true" formik={formik} type="status"/> */}
                <BaseRadio
                  value={formik.values.status}
                  formik={formik}
                  type="status"
                  feature="pending"
                  isLabel={true}
                  label="Status"
                  important="true"
                />
              </div>
              <div className="col-md-12 col-sm-12 px-3">
                <BaseTextArea
                  formik={formik}
                  label="Description"
                  placeholder="Description"
                  important="false"
                  row="4"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              {/* <BaseButton
              type="reset"
              value="Reset"
              color="dark"
              onClick={() => {
                formik.resetForm();
                setModal(!modal);
              }}
            /> */}
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
