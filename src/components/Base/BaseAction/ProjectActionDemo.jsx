import {
  DeleteFilled,
  LoadingOutlined,
  MoreOutlined,
  PlusOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import { useState } from "react";
import { MoveToAnotherProject } from "src/pages/ProjectListPage/ProjectStudentItem/MoveToAnotherProject/MoveToAnotherProject";
import { BaseFilter } from "../BaseFilter/BaseFilter";
import { BaseButton } from "../BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";
export const ProjectActionDemo = ({
  option,
  optionId,
  actionId,
  roles,
  fetchData,
  searchParams,
  project,
  fetchFilterData,
  searchClassParams,
  onClick,
  isWaitingList,
  projects,
  classObj,
  classId,
  handleWaitingListDelete,
  handleAddStudentToProject,
  handleMoveToAnotherProject,
  handleSetLeader,
  handleProjectStudentDelete,
  isLeader,
  loadingLeader,
  loadingAddStudent,
  loadingWaitDelete,
  loadingMove,
  loadingRemove,
}) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  let items = [];
  if (isWaitingList) {
    const addToProject = [];
    projects.map((project) =>
      addToProject.push({
        value: project.project_id,
        label: (
          <a onClick={() => handleAddStudentToProject(project, option)}>
            {project.group_name} ({project.project_code})
          </a>
        ),
      })
    );
    items = [
      {
        key: "1",
        label: (
          <a target="_blank">
            <PlusOutlined className="me-2" /> Add to Project
          </a>
        ),
        children: addToProject,
      },
      {
        key: "2",
        label: (
          <a
            target="_blank"
            onClick={() => handleWaitingListDelete(option.class_student_id)}
          >
            <DeleteFilled className="me-2" /> Delete
          </a>
        ),
      },
    ];
  } else {
    const moveToAnotherProject = [];
    projects
      .filter((projectItem) => projectItem.project_id !== project.project_id)
      .map((projectItem) =>
        moveToAnotherProject.push({
          value: projectItem.project_id,
          label: (
            <a
              onClick={() =>
                handleMoveToAnotherProject(
                  projectItem,
                  option,
                  fetchData,
                  searchParams
                )
              }
            >
              {projectItem.group_name} ({projectItem.project_code})
            </a>
          ),
        })
      );
    items = [
      {
        key: "1",
        label: (
          <a target="_blank">
            <PlusOutlined className="me-2" /> Add to Project
          </a>
        ),
        children: moveToAnotherProject,
      },
    ];
    if (!isLeader) {
      items.push({
        key: "2",
        label: (
          <a
            target="_blank"
            onClick={() => handleSetLeader(option.student_id, project)}
          >
            <StarOutlined className="me-2" /> Choose Leader
          </a>
        ),
      });
    }
    items.push({
      key: "3",
      label: (
        <a
          target="_blank"
          onClick={() => handleProjectStudentDelete(option, project)}
        >
          <DeleteFilled className="me-2" /> Delete
        </a>
      ),
    });
  }

  // const handleDelete = async (id) => {
  //   const classStudentId = [];
  //   classStudentId.push(id);
  //   swalWithBootstrapButtons
  //     .fire({
  //       title: "Are you sure?",
  //       text: `Are you sure to delete project??`,
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, delete it!",
  //       cancelButtonText: "No, cancel!",
  //       reverseButtons: true,
  //     })
  //     .then(async (result) => {
  //       console.log(result);
  //       if (result.isConfirmed) {
  //         const { data, err } = await axiosClient.delete(
  //           "ClassStudent/DeleteMultiple",
  //           {
  //             data: classStudentId,
  //           }
  //         );

  //         if (err) {
  //           toast.error("Delete fail!");
  //           return;
  //         } else {
  //           swalWithBootstrapButtons.fire(
  //             "Deleted!",
  //             "User has been deleted!.",
  //             "success"
  //           );
  //           toast.success("Delete Successful!");
  //           fetchData(searchParams);
  //           // fetchSemesterData()
  //           fetchFilterData(searchClassParams)
  //         }
  //       } else {
  //         {
  //           swalWithBootstrapButtons.fire(
  //             "Cancelled",
  //             "Your imaginary file is safe :)",
  //             "error"
  //           );
  //         }
  //       }
  //     });
  //   // console.log(classStudentId);
  // };
  return (
    <>
      <div className="d-flex justify-content-around">
        <Tooltip title="More" placement="top" size="large">
          <Dropdown
            menu={{ items }}
            disabled={classObj.status === StatusEnum.Active}
            trigger={["click"]}
            arrow
          >
            <MoreOutlined className="ms-2" style={{ fontSize: "18px" }} />
          </Dropdown>
        </Tooltip>
      </div>
    </>
  );
};
