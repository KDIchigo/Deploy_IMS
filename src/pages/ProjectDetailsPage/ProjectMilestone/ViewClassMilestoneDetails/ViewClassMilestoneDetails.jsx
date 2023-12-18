import { useFormik } from "formik";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
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
  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
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
            <BaseDatePicker
              id="modified_date"
              label="Last Update"
              name="modified_date"
              className="w-100 px-2 datePicker"
              defaultValue={formik.values.modified_date}
              placeholder="It hasn't been updated"
              value={formik.values.modified_date}
              onChange={formik.handleChange}
              disabled={true}
              classNameInput={
                formik.errors.modified_date && formik.touched.modified_date
                  ? "is-invalid"
                  : ""
              }
              status={
                formik.errors.modified_date && formik.touched.modified_date
                  ? "error"
                  : ""
              }
              formik={formik}
              onBlur={formik.handleBlur}
            />
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
      </Modal>
    </>
  );
};

export default ViewClassMilestoneDetails;
