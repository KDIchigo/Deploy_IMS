import { LoadingOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { UserEnum } from "src/enum/Enum";
import * as Yup from "yup";

export const MoveStudent = ({
  projects,
  project,
  toggle,
  modal,
  option,
  handleMoveToAnotherProject,
}) => {
  if (project === undefined) {
    return null;
  }
  const [loadingData, setLoadingData] = useState(false);
  let newProjects = projects.filter(
    (projectItem) => projectItem.project_id !== project.project_id
  );
  let defaultValue = `${newProjects[0].group_name} (${newProjects[0].project_code})`;
  const formik = useFormik({
    initialValues: {
      project_id: newProjects[0].project_id,
    },
    onSubmit: async (values) => {
      let project = newProjects.filter(
        (ele) => ele.project_id === values.project_id
      )[0];

      handleMoveToAnotherProject(project, option);

      // window.alert("Form submitted");
      //   setLoadingData(true);
      //   const { data, err } = await axiosClient.post(`/User`, values);
      //   if (err) {
      //     // toast.error("Add user fail!");
      //     showErrorMessage(err);
      //     setLoadingData(false);
      //     toggle();
      //     return;
      //   } else {
      //     toast.success("Add user successful!");
      //     setLoadingData(false);
      //     toggle();
      //     fetchData(searchParams);
      //   }
      // console.log(searchParams, values);
    },
  });
  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="md" centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <ModalHeader toggle={toggle}>
            Move Student
          </ModalHeader>

          <ModalBody
            className="row"
            style={loadingData ? { pointerEvents: "none" } : {}}
          >
            <BaseSelectInput
              label="Project"
              isLabel={false}
              id="project_id"
              type="project"
              defaultValue={defaultValue}
              placeholder="Project"
              classNameDiv="col-lg-12"
              options={newProjects}
              isFilter={false}
              isFilterIssue={false}
              formik={formik}
              // onFilter={onProjectFilter}
              // checked={checkedProject}
              // onChange={onChangeProject}
              // onChange={(value) => console.log(value)}
            />
          </ModalBody>

          <ModalFooter>
            {loadingData ? (
              <BaseButton
                nameTitle="ms-3 px-3 btnLoadingAdd "
                type="submit"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                nameTitle="ms-3 px-3"
                type="submit"
                value="Add"
                color="secondary"
              />
            )}
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
