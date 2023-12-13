import { LoadingOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseRangePicker } from "src/components/Base/BaseRangePicker/BaseRangePicker";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { HandleAuth } from "src/utils/handleAuth";

const ViewClassMilestoneDetails = ({ milestone, setModal, modal }) => {
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      ...milestone,
      modified_by: currentUser.email,
    },
  });
  const toggle = () => {
    setModal(!modal);
    formik.resetForm();
  };
  console.log(modal);
  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}> Class Milestone Details</ModalHeader>

          <ModalBody className="row">
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

            <div className="col-md-6 col-sm-12 px-3">
              <BaseRangePicker
                id="fromTo_date"
                name="fromTo_date"
                className="w-100 px-2 datePicker"
                label="From Date - To Date"
                valueFromDate={formik.values.from_date}
                valueToDate={formik.values.to_date}
                important="true"
                // value={formik.values.from_date}
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
                isLabel={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-3 px-3 ">
              <BaseTextArea
                formik={formik}
                label="Description"
                placeholder="Description"
                important="false"
                row="5"
              />
            </div>
          </ModalBody>
        </form>
      </Modal>
    </>
  );
};

export default ViewClassMilestoneDetails;
