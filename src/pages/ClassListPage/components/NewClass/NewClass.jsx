import { LoadingOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { StatusEnum } from "src/enum/Enum";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
import "./NewClass.scss";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}
export const NewClass = ({
  semesters,
  subjects,
  teachers,
  fetchData,
  searchParams,
  loadingSemesterApi,
  fetchSystemSetting,
  loadingSubjectApi,
  fetchSubject,
  loadingTeacherApi,
  fetchTeacher,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser } = HandleAuth();
  const formik = useFormik({
    initialValues: {
      class_code: "",
      description: "",
      status: StatusEnum.Pending,
      subject_id: "",
      semester_id: "",
      teacher_id: "",
      created_by: currentUser.email,
    },
    validationSchema: Yup.object({
      class_code: Yup.string()
        .required("Class Code is required")
        .max(100, "Class Code must be lower than 100 characters"),
      subject_id: Yup.string().required("Subject Code is required"),
      semester_id: Yup.string().required("Semester is required"),
      teacher_id: Yup.string().required("Teacher is required"),
    }),
    onSubmit: async (values) => {
      setLoadingData(true);
      const { data, err } = await axiosClient.post(`/Class`, values);
      if (err) {
        // toast.error("Add class fail!");
        showErrorMessage(err);
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
        return;
      } else {
        toast.success("Add class successfully!");
        setLoadingData(false);
        setModal(!modal);
        formik.resetForm();
      }

      fetchData(searchParams);
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
          <ModalHeader toggle={toggle}>New Class</ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="class_code"
                name="class_code"
                label="Class Code"
                placeholder="Enter Class Code"
                onBlur={formik.handleBlur}
                value={formik.values.class_code}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.class_code && formik.touched.class_code
                    ? "is-invalid"
                    : ""
                }
                important="true"
              />
              {formik.errors.class_code && formik.touched.class_code ? (
                <p className="errorMsg"> {formik.errors.class_code} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Subject Code"
                type="subject"
                id="subject_id"
                placeholder="Subject Code"
                defaultValue={formik.values.subject_name}
                options={subjects.filter((ele) => ele.status === StatusEnum.Active)}
                loading={loadingSubjectApi}
                loadingApi={loadingSubjectApi}
                onClick={fetchSubject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                status={
                  formik.errors.subject_id && formik.touched.subject_id
                    ? "error"
                    : ""
                }
                important="true"
                isFilter={false}
                formik={formik}
              />
              {formik.errors.subject_id && formik.touched.subject_id ? (
                <p className="errorMsg"> {formik.errors.subject_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Semester"
                type="setting"
                id="semester_id"
                placeholder="Semester"
                defaultValue={formik.values.semester_name}
                loading={loadingSemesterApi}
                loadingApi={loadingSemesterApi}
                onClick={fetchSystemSetting}
                options={semesters.filter((ele) => ele.status === StatusEnum.Active)}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                status={
                  formik.errors.semester_id && formik.touched.semester_id
                    ? "error"
                    : ""
                }
                important="true"
                isFilter={false}
                formik={formik}
              />
              {formik.errors.semester_id && formik.touched.semester_id ? (
                <p className="errorMsg"> {formik.errors.semester_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Teacher"
                type="user"
                id="teacher_id"
                placeholder="Teacher"
                defaultValue={formik.values.teacher_name}
                options={teachers.filter((ele) => ele.status === StatusEnum.Active)}
                loading={loadingTeacherApi}
                loadingApi={loadingTeacherApi}
                onClick={fetchTeacher}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                status={
                  formik.errors.teacher_id && formik.touched.teacher_id
                    ? "error"
                    : ""
                }
                important="true"
                isFilter={false}
                formik={formik}
              />
              {formik.errors.teacher_id && formik.touched.teacher_id ? (
                <p className="errorMsg"> {formik.errors.teacher_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                feature="class"
                isLabel={true}
                label="Status"
                important="true"
              />
              {/* <BaseCheckbox formik={formik} type="status" /> */}
            </div>
            <div className="col-md-12 col-sm-12 mt-2 px-3">
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
                nameTitle="ms-3 px-3 btnLoadingAddClass"
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                className="ms-3 px-3"
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
