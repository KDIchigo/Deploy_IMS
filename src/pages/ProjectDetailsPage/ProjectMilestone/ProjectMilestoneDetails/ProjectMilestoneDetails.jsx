import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseCheckbox } from "src/components/Base/BaseCheckbox/BaseCheckbox";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseRangePicker } from "src/components/Base/BaseRangePicker/BaseRangePicker";
import { SelectInputMilestone } from "src/components/Base/BaseSelectInput/SelectInputMilestone";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";

export const ProjectMilestoneDetails = ({
  searchParams,
  projectId,
  milestone,
  fetchData,
  classMilestones,
  classMilestone,
  selectMilestones,
  handleMilestoneUpdate,
  code,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      ...milestone,
    },
    validationSchema: Yup.object({
      milestone_name: Yup.string()
        .required("Milestone Name is required")
        .max(255, "Must be less than 255 characters"),
      parent_id: Yup.string().required("Milestone Parent is required"),
    }),
    onSubmit: async (values) => {
      // console.log(values);
      handleMilestoneUpdate(values, setLoadingData, milestone, code, toggle);
    },
  });
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    formik.resetForm({
      values: { ...milestone, modified_by: currentUser.email },
    });
  };
  const disabledDate = (current) => {
    // Disable dates before today or after a specific future date
    const formattedLimitFromDate = dayjs(classMilestone.from_date);
    const formattedLimitToDate = dayjs(classMilestone.to_date);

    let isLimitDate = undefined;
    if (classMilestone.from_date !== undefined && classMilestone.to_date !== undefined) {
      isLimitDate =
        current &&
        (current < formattedLimitFromDate.startOf("day") ||
          current > formattedLimitToDate.endOf("day"));
    }
    return isLimitDate;
  };
  useEffect(() => {
    // Update initialValues whenever the user prop changes
    formik.setValues({ ...milestone, modified_by: currentUser.email });
  }, [milestone]);
  return (
    <>
      <Tooltip
        title="Details"
        className="action_space"
        placement="top"
        color="#ffc107"
        size="large"
      >
        <div>
          <BaseButton
            icon={<EditOutlined />}
            variant="outline"
            nameTitle="px-2 py-1"
            color="warning"
            onClick={toggle}
          />
        </div>
      </Tooltip>
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}> Milestone Details</ModalHeader>

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
                  formik.errors.milestone_name && formik.touched.milestone_name
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
              {formik.errors.milestone_name && formik.touched.milestone_name ? (
                <p className="errorMsg"> {formik.errors.milestone_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            {/* {console.log(classMilestones)} */}
            <div className="col-md-6 col-sm-12 px-3">
              <SelectInputMilestone
                label="Milestone Parent"
                id="parent_id"
                defaultValue={formik.values.parent_name}
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
                limitFromDate={classMilestone.from_date}
                limitToDate={classMilestone.to_date}
                disabledDate={disabledDate}
                important="true"
                value={formik.values.from_date}
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
            <div className="col-md-6 col-sm-12 mt-4 px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                feature="pending"
                isLabel={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-0 px-3">
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
            {loadingData ? (
              // <Spin size="large" width="50px" height="50px" />
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingMilestone "
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
