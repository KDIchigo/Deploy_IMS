import { CloudSyncOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseRadio } from "src/components/Base/BaseRadio/BaseRadio";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";
import "./ProjectGeneral.scss";

export const ProjectGeneral = ({ project, classes, students, fetchData }) => {
  const navigate = useNavigate();
  const { currentUser, IsStudent, IsLeader, IsAdmin, IsManager, IstTeacher } =
    HandleAuth();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingAsync, setLoadingAsync] = useState(false);
  const [isView, setIsView] = useState(true);
  const handleProjectSynchronize = async (convertId, bearToken, projectId) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Are you sure to Synchronize project?",
        icon: "warning",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Yes, synchronize it!",
        cancelButtonText: "No, cancel!",
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          setLoadingAsync(true);
          const { data, err } = await axiosClient.post(
            `/Project/AsynctGitLabProject?convertId=${convertId}&bearToken=${bearToken}&id=${projectId}`
          );

          if (err) {
            toast.error("Synchronize project fail!");
            setLoadingAsync(false);
            return;
          } else {
            toast.success("Synchronize project successfully!");
            fetchData();
            setLoadingAsync(false);
          }
        }
      });
  };
  const formik = useFormik({
    initialValues: {
      project_id: project.project_id,
      project_code: project.project_code,
      group_name: project.group_name,
      english_group_name: project.english_group_name,
      vn_group_name: project.vn_group_name,
      status: project.status,
      leader_id: project.leader_id,
      class_id: project.class_id,
      leader_name: project.leader_name,
      description: project.description,
      project_convert_id: project.project_convert_id,
      project_convert_token: project.project_convert_token,
      modified_by: currentUser.email,
    },
    validationSchema: Yup.object({
      project_code: Yup.string()
        .required("Project Code is required")
        .max(100, "Project Code must be lower than 100 characters"),
      group_name: Yup.string()
        .required("Group Name is required")
        .max(500, "Group Name must be lower than 500 characters"),
      english_group_name: Yup.string()
        .required("English Group Name is required")
        .max(500, "English Group Name must be lower than 500 characters"),
      vn_group_name: Yup.string()
        .required("Vietnam Group Name is required")
        .max(500, "Vietnam Group Name must be lower than 500 characters"),
    }),
    onSubmit: async (values) => {
      // window.alert("Form submitted");
      isView
        ? setIsView(false)
        : swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: `Are you sure to update the project named ${project.project_code}?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, update it!",
              cancelButtonText: "No, cancel!",
              reverseButtons: true,
            })
            .then(async (result) => {
              if (result.isConfirmed) {
                const { leader_name, ...value } = values;
                setLoadingData(true);
                const { data, err } = await axiosClient.put(
                  `/Project/${values.project_id}`,
                  value
                );
                if (err) {
                  toast.error(
                    `The project named ${project.project_code} was updated fail!`
                  );
                  setLoadingData(false);
                  return;
                } else {
                  toast.success(
                    `The project named ${project.project_code} was updated successfully!`
                  );
                  setLoadingData(false);
                  fetchData();
                }
                setIsView(true);
              }
            });
    },
  });
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="d-flex flex-column flexGrow_1"
      >
        <h3 className="fw-bold m-0" style={{ paddingBottom: 30 }}>
          Project Details for {project.project_code}
        </h3>
        <div
          className="flexGrow_1 "
          style={{ pointerEvents: loadingData ? "none" : "auto" }}
        >
          <div className="row">
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="project_code"
                name="project_code"
                label="Project Code"
                placeholder="Enter Project Code"
                value={formik.values.project_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly={isView}
                classNameInput={
                  formik.errors.project_code && formik.touched.project_code
                    ? "is-invalid"
                    : ""
                }
                important="true"
              />
              {formik.errors.project_code && formik.touched.project_code ? (
                <p className="errorMsg"> {formik.errors.project_code} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="group_name"
                name="group_name"
                label="Group Name"
                placeholder="Group Name"
                value={formik.values.group_name}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.group_name && formik.touched.group_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.group_name && formik.touched.group_name ? (
                <p className="errorMsg"> {formik.errors.group_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="english_group_name"
                name="english_group_name"
                label="English Project Name"
                placeholder="English Project Name"
                value={formik.values.english_group_name}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.english_group_name &&
                  formik.touched.english_group_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.english_group_name &&
              formik.touched.english_group_name ? (
                <p className="errorMsg"> {formik.errors.english_group_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="vn_group_name"
                name="vn_group_name"
                label="Vietnamese Project Name"
                placeholder="Vietnamese Project Name"
                value={formik.values.vn_group_name}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.vn_group_name && formik.touched.vn_group_name
                    ? "is-invalid"
                    : ""
                }
                important="true"
                onBlur={formik.handleBlur}
              />
              {formik.errors.vn_group_name && formik.touched.vn_group_name ? (
                <p className="errorMsg"> {formik.errors.vn_group_name} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>

            <div className="col-md-6 col-sm-12 px-3">
              <BaseSelectInput
                label="Leader"
                id="leader_id"
                type="class_student"
                defaultValue={formik.values.leader_name}
                onBlur={formik.handleBlur}
                disabled={isView}
                status={
                  formik.errors.leader_id && formik.touched.leader_id
                    ? "error"
                    : ""
                }
                placeholder="Leader"
                options={students}
                onChange={formik.handleChange}
                formik={formik}
              />
              {formik.errors.class_id && formik.touched.class_id ? (
                <p className="errorMsg"> {formik.errors.class_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="text"
                id="project_convert_token"
                name="project_convert_token"
                label="Access Token"
                placeholder="Enter Access Token"
                value={formik.values.project_convert_token}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.project_convert_token &&
                  formik.touched.project_convert_token
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.project_convert_token &&
              formik.touched.project_convert_token ? (
                <p className="errorMsg">
                  {" "}
                  {formik.errors.project_convert_token}{" "}
                </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 px-3">
              <BaseInputField
                type="number"
                id="project_convert_id"
                name="project_convert_id"
                label="Gitlab project id"
                placeholder="Gitlab project id"
                value={formik.values.project_convert_id}
                onChange={formik.handleChange}
                readOnly={isView}
                classNameInput={
                  formik.errors.project_convert_id &&
                  formik.touched.project_convert_id
                    ? "is-invalid"
                    : ""
                }
                onBlur={formik.handleBlur}
              />
              {formik.errors.project_convert_id &&
              formik.touched.project_convert_id ? (
                <p className="errorMsg"> {formik.errors.project_convert_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mt-3 px-3">
              {/* <BaseRadio label="Status" important="true" formik={formik} type="status"/> */}
              <BaseRadio
                value={formik.values.status}
                formik={formik}
                type="status"
                isLabel={true}
                disabled={isView}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-0 px-3">
              <BaseTextArea
                formik={formik}
                disabled={isView}
                label="Description"
                placeholder="Description"
                important="false"
                row="5"
              />
            </div>
          </div>
        </div>
        {console.log(isView)}
        {/* {(!IsStudent() ||
          IsLeader(project.leader_id)) && ( */}
        <div className="row">
          <div className="col-12 px-3 mt-5">
            {loadingData ? (
              isView ? (
                <BaseButton
                  nameTitle="float-start btnLoading1Class"
                  type="submit"
                  value="Update"
                  color="info"
                />
              ) : (
                <BaseButton
                  nameTitle="float-start btnLoading1Class"
                  type="submit"
                  color="secondary"
                  icon={<LoadingOutlined />}
                  disabled={true}
                />
              )
            ) : (
              <>
                {isView ? (
                  <BaseButton
                    nameTitle="float-start btnLoading1Class"
                    type="submit"
                    value="Update"
                    color="info"
                  />
                ) : (
                  <BaseButton
                    nameTitle="float-start btnLoading1Class"
                    type="submit"
                    value="Update"
                    color="secondary"
                  />
                )}
              </>
            )}
            {/* {loadingAsync ? (
                <BaseButton
                  nameTitle="float-start ms-2 btnLoading2 "
                  type="button"
                  color="purple"
                  icon={<LoadingOutlined />}
                />
              ) : (
                <>
                  <BaseButton
                    nameTitle="float-start ms-2 btnSync"
                    type="button"
                    value="Synchronize"
                    color="purple"
                    isIconLeft={true}
                    icon={<CloudSyncOutlined size={20} />}
                    onClick={() =>
                      handleProjectSynchronize(
                        project.project_convert_id,
                        project.project_convert_token,
                        project.project_id
                      )
                    }
                    disabled={!isView}
                  />
                </>
              )} */}
          </div>
        </div>
        {/* )} */}
      </form>
    </>
  );
};
