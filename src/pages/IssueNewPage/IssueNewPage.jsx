import { LoadingOutlined } from "@ant-design/icons";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseDatePicker } from "src/components/Base/BaseDatePicker/BaseDatePicker";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { SelectInputAssignee } from "src/components/Base/BaseSelectInput/SelectInputAssignee";
import { SelectInputMilestone } from "src/components/Base/BaseSelectInput/SelectInputMilestone";
import { BaseTextArea } from "src/components/Base/BaseTextArea/BaseTextArea";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";
import { ConditionEnum } from "src/enum/Enum";
import { HandleAuth } from "src/utils/handleAuth";
import * as Yup from "yup";

export const IssueNewPage = () => {
  const navigate = useNavigate();
  const { projectId, issueTypeId } = useParams();
  const { currentUser } = HandleAuth();
  const [issues, setIssues] = useState([]);
  const [students, setStudents] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [projectObj, setProjectObj] = useState([]);
  const [issueSettings, setIssueSettings] = useState([]);
  const [issueRequirements, setIssueRequirements] = useState([]);
  const [issueType, setIssueType] = useState(undefined);
  const [loadingSelectData, setLoadingSelectData] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [loadingAssigneeApi, setLoadingAssigneeApi] = useState(false);
  const [isCallAssignees, setIsCallAssignees] = useState(false);
  const [loadingMilestoneApi, setLoadingMilestoneApi] = useState(false);
  const [isCallMilestones, setIsCallMilestones] = useState(false);
  const [loadingIssueSettingApi, setLoadingIssueSettingApi] = useState(false);
  const [isCallIssueSettings, setIsCallIssueSettings] = useState(false);
  const [loadingIssueRequirementApi, setLoadingIssueRequirementApi] =
    useState(false);
  const [isCallIssueRequirements, setIsCallIssueRequirements] = useState(false);

  const formik = useFormik({
    initialValues: {
      description: "",
      issue_title: "",
      issue_type: issueTypeId === undefined ? "" : issueTypeId,
      issue_status: "",
      work_process: "",
      due_date: "",
      status: 1,
      project_id: projectId,
      // assignee: "",
      milestone_id: "",
      created_by: currentUser.email,
      user_id: currentUser.user_id,
      // parent_id: "",
    },
    validationSchema: Yup.object({
      issue_title: Yup.string()
        .required("Issue Title is required")
        .max(1023, "Issue Title must be lower than 1023 characters"),
      milestone_id: Yup.string().required("Project Milestone is required"),
      due_date: Yup.string().required("Due Date is required"),
      issue_type: Yup.string()
        .required("Issue Type is required")
        .max(36, "Issue Type must be lower than 36 characters"),
      issue_status: Yup.string()
        .required("Issue Status is required")
        .max(36, "Issue Status must be lower than 36 characters"),
      work_process: Yup.string()
        .required("Work Process is required")
        .max(36, "Work Process must be lower than 36 characters"),
      // assignee: Yup.string().required("Assignee is required"),
    }),
    onSubmit: async (values) => {
      setLoadingData(true);
      if (values.assignee === "") {
        let { assignee, ...newValues } = values;
      }
      const { err } = await axiosClient.post(`/Issue`, values);
      if (err) {
        toast.error("Add issue fail!");
        // showErrorMessage(err);
        setLoadingData(false);
        formik.resetForm();
      } else {
        toast.success("Add issue successfully!");
        setLoadingData(false);
        formik.resetForm();
        navigate(
          `/issue-list/${projectId}/${
            issueTypeId === undefined ? "all" : issueTypeId
          }`
        );
      }
      // fetchData(searchParams);
    },
  });

  const fetchAssignee = async () => {
    if (!isCallAssignees) {
      setLoadingAssigneeApi(true);
      const { data: studentArr } = await axiosClient.post(
        "/ClassStudent/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: projectId,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setStudents(studentArr);
      setIsCallAssignees(true);
      setLoadingAssigneeApi(false);
    }
  };

  const fetchMilestone = async () => {
    if (!isCallMilestones) {
      setLoadingMilestoneApi(true);
      const { data: milestoneArr } = await axiosClient.post(
        "/Milestone/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "project_id",
            value: projectId,
            condition: ConditionEnum.Equal,
          },
        ]
      );

      setMilestones(milestoneArr);
      setIsCallMilestones(true);
      setLoadingMilestoneApi(false);
    }
  };

  const fetchIssueSetting = async () => {
    if (!isCallIssueSettings) {
      setLoadingIssueSettingApi(true);
      const { data: projectById } = await axiosClient.get(
        `/Project/${projectId}`
      );
      const { data: issueSettingArr } = await axiosClient.post(
        `/IssueSetting/GetDataCombobox?project_id=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
      );
      setIssueSettings(issueSettingArr);
      if (issueTypeId !== undefined) {
        setIssueType(
          issueSettingArr.issue_types.filter(
            (ele) => ele.issue_setting_id === issueTypeId
          )[0]
        );
      }
      setIsCallIssueSettings(true);
      setLoadingIssueSettingApi(false);
      setLoadingSelectData(true);
    }
  };

  const fetchIssueRequirement = async () => {
    if (!isCallIssueRequirements) {
      setLoadingIssueRequirementApi(true);
      const { data: projectById } = await axiosClient.get(
        `/Project/${projectId}`
      );
      const { data: issueRequirements } = await axiosClient.post(
        `/Issue/GetRequirementIssue?projectId=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
      );
      setIssueRequirements(issueRequirements);
      setIsCallIssueRequirements(true);
      setLoadingIssueRequirementApi(false);
    }
  };

  const fetchDataSelect = async () => {
    const { data: studentArr } = await axiosClient.post(
      "/ClassStudent/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "project_id",
          value: projectId,
          condition: ConditionEnum.Equal,
        },
      ]
    );
    setStudents(studentArr);

    const { data: milestoneArr } = await axiosClient.post(
      "/Milestone/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "project_id",
          value: projectId,
          condition: ConditionEnum.Equal,
        },
      ]
    );

    setMilestones(milestoneArr);

    const { data: projectById } = await axiosClient.get(
      `/Project/${projectId}`
    );
    // setProjectObj(projectById);

    const { data: issueSettingArr } = await axiosClient.post(
      `/IssueSetting/GetDataCombobox?project_id=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
    );
    setIssueSettings(issueSettingArr);
    if (issueTypeId !== undefined) {
      setIssueType(
        issueSettingArr.issue_types.filter(
          (ele) => ele.issue_setting_id === issueTypeId
        )[0]
      );
    }

    const { data: issueRequirements } = await axiosClient.post(
      `/Issue/GetRequirementIssue?projectId=${projectId}&class_id=${projectById.class_id}&subject_id=${projectById.subject_id}`
    );
    setIssueRequirements(issueRequirements);
    setLoadingSelectData(true);
    // console.log(issueSettingArr);
  };

  const fetchData = async () => {
    const { data: projectById } = await axiosClient.get(
      `/Project/${projectId}`
    );
    setProjectObj(projectById);
    setLoadingData(true);
  };
  useEffect(() => {
    // fetchDataSelect();
    fetchIssueSetting();
  }, []);
  return (
    <>
      <NavbarDashboard
        position="issue"
        spin={loadingSelectData}
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    New Issue
                  </h3>
                </div>
                <form
                  onSubmit={formik.handleSubmit}
                  autoComplete="off"
                  className="flex_height d-flex flex-column flexGrow_1"
                >
                  <div
                    className="flexGrow_1 "
                    style={loadingData ? { pointerEvents: "none" } : {}}
                  >
                    {loadingSelectData && (
                      <div className="row">
                        <div className="col-md-6 col-sm-12 px-3">
                          <BaseInputField
                            type="text"
                            id="issue_title"
                            name="issue_title"
                            label="Issue Title "
                            placeholder="Enter Issue Title"
                            value={formik.values.issue_title}
                            onChange={formik.handleChange}
                            classNameInput={
                              formik.errors.issue_title &&
                              formik.touched.issue_title
                                ? "is-invalid"
                                : ""
                            }
                            important="true"
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.issue_title &&
                          formik.touched.issue_title ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.issue_title}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-6 col-sm-12 px-3">
                          <BaseInputField
                            type="text"
                            id="created_by"
                            name="created_by"
                            label="Created"
                            placeholder="Enter Created"
                            value={formik.values.created_by}
                            onChange={formik.handleChange}
                            classNameInput={
                              formik.errors.created_by &&
                              formik.touched.created_by
                                ? "is-invalid"
                                : ""
                            }
                            important="true"
                            readOnly={true}
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.created_by &&
                          formik.touched.created_by ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.created_by}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-6 col-sm-12 px-3">
                          <BaseSelectInput
                            id="parent_id"
                            name="parent_id"
                            label="Issue Requirement"
                            type="issue"
                            defaultValue={
                              formik.values.parent_title === ""
                                ? undefined
                                : formik.values.parent_title
                            }
                            options={issueRequirements}
                            onClick={fetchIssueRequirement}
                            loading={loadingIssueRequirementApi}
                            loadingApi={loadingIssueRequirementApi}
                            onChange={formik.handleChange}
                            // important="true"
                            formik={formik}
                            isFilter={false}
                            placeholder="Issue Requirement"
                            status={
                              formik.errors.parent_id &&
                              formik.touched.parent_id
                                ? "error"
                                : ""
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.parent_id &&
                          formik.touched.parent_id ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.parent_id}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-3 col-sm-12 px-3">
                          <BaseSelectInput
                            id="issue_type"
                            name="issue_type"
                            label="Issue Type"
                            type="issue_group"
                            defaultValue={
                              issueType === undefined
                                ? undefined
                                : issueType.issue_value
                            }
                            onClick={fetchIssueSetting}
                            loading={loadingIssueSettingApi}
                            loadingApi={loadingIssueSettingApi}
                            options={issueSettings.issue_types}
                            onChange={formik.handleChange}
                            important="true"
                            disabled={issueType !== undefined}
                            formik={formik}
                            isFilter={false}
                            placeholder="Issue Type"
                            status={
                              formik.errors.issue_type &&
                              formik.touched.issue_type
                                ? "error"
                                : ""
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.issue_type &&
                          formik.touched.issue_type ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.issue_type}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-3 col-sm-12 px-3">
                          <BaseSelectInput
                            label="Work Process"
                            id="work_process"
                            type="issue_group"
                            defaultValue={
                              formik.values.work_process_value === ""
                                ? undefined
                                : formik.values.work_process_value
                            }
                            options={issueSettings.work_process}
                            onChange={formik.handleChange}
                            onClick={fetchIssueSetting}
                            loading={loadingIssueSettingApi}
                            loadingApi={loadingIssueSettingApi}
                            important="true"
                            formik={formik}
                            isFilter={false}
                            placeholder="Work Process"
                            status={
                              formik.errors.work_process &&
                              formik.touched.work_process
                                ? "error"
                                : ""
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.work_process &&
                          formik.touched.work_process ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.work_process}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-3 col-sm-12 px-3">
                          <SelectInputMilestone
                            label="Project Milestone"
                            id="milestone_id"
                            defaultValue={formik.values.milestone_name}
                            options={milestones}
                            onChange={formik.handleChange}
                            onClick={fetchMilestone}
                            loading={loadingMilestoneApi}
                            loadingApi={loadingMilestoneApi}
                            important="true"
                            formik={formik}
                            isFilter={false}
                            placeholder="Project Milestone"
                            status={
                              formik.errors.milestone_id &&
                              formik.touched.milestone_id
                                ? "error"
                                : ""
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.milestone_id &&
                          formik.touched.milestone_id ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.milestone_id}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-3 col-sm-12 px-3">
                          <SelectInputAssignee
                            label="Assignee"
                            id="assignee"
                            type="class_student"
                            defaultValue={formik.values.assignee_name}
                            options={students}
                            onChange={formik.handleChange}
                            onClick={fetchAssignee}
                            loading={loadingAssigneeApi}
                            loadingApi={loadingAssigneeApi}
                            formik={formik}
                            isFilter={false}
                            placeholder="Assignee"
                            status={
                              formik.errors.assignee && formik.touched.assignee
                                ? "error"
                                : ""
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.assignee && formik.touched.assignee ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.assignee}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-3 col-sm-12 px-3">
                          <BaseDatePicker
                            id="due_date"
                            label="Due Date"
                            name="due_date"
                            className="w-100 px-2 datePicker"
                            defaultValue={formik.values.due_date}
                            value={formik.values.due_date}
                            onChange={formik.handleChange}
                            classNameInput={
                              formik.errors.due_date && formik.touched.due_date
                                ? "is-invalid"
                                : ""
                            }
                            status={
                              formik.errors.due_date && formik.touched.due_date
                                ? "error"
                                : ""
                            }
                            important="true"
                            formik={formik}
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.due_date && formik.touched.due_date ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.due_date}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-3 col-sm-12 px-3">
                          <BaseSelectInput
                            label="Issue Status"
                            id="issue_status"
                            type="issue_group"
                            defaultValue={
                              formik.values.issue_status_value === ""
                                ? undefined
                                : formik.values.issue_status_value
                            }
                            options={issueSettings.issue_statuses}
                            onChange={formik.handleChange}
                            onClick={fetchIssueSetting}
                            loading={loadingIssueSettingApi}
                            loadingApi={loadingIssueSettingApi}
                            important="true"
                            formik={formik}
                            isFilter={false}
                            placeholder="Issue Status"
                            status={
                              formik.errors.issue_status &&
                              formik.touched.issue_status
                                ? "error"
                                : ""
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.issue_status &&
                          formik.touched.issue_status ? (
                            <p className="errorMsg">
                              {" "}
                              {formik.errors.issue_status}{" "}
                            </p>
                          ) : (
                            <p className="hiddenMsg">acb</p>
                          )}
                        </div>
                        <div className="col-md-12 col-sm-12 mt-0 px-3">
                          <BaseTextArea
                            formik={formik}
                            label="Description"
                            placeholder="Description"
                            important="false"
                            style={{ marginTop: "8px" }}
                            row={10}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-12 px-3">
                      {loadingData ? (
                        <BaseButton
                          nameTitle="float-start mt-4 "
                          type="submit"
                          icon={<LoadingOutlined />}
                          disabled={true}
                          color="info"
                        />
                      ) : (
                        <BaseButton
                          nameTitle="float-start mt-4"
                          type="submit"
                          value="Add New"
                          color="info"
                        />
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};
