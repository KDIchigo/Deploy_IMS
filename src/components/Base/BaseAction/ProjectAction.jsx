import {
  DeleteFilled,
  LoadingOutlined,
  PlusOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import { useState } from "react";
import { MoveToAnotherProject } from "src/pages/ProjectListPage/ProjectStudentItem/MoveToAnotherProject/MoveToAnotherProject";
import { BaseFilter } from "../BaseFilter/BaseFilter";
import { BaseButton } from "../BaseButton/BaseButton";
import { StatusEnum } from "src/enum/Enum";
export const ProjectAction = ({
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
  projects.map((project) =>
    items.push({
      key: project.project_id,
      label: (
        <a onClick={() => handleAddStudentToProject(project, option)}>
          {project.project_code}
        </a>
      ),
    })
  );
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
        {isWaitingList ? (
          <>
            <Tooltip
              title="Add to Project"
              placement="top"
              color="rgb(73, 182, 245)"
              size="large"
            >
              <div>
                <Dropdown
                  menu={{
                    items: projects.map((project) => ({
                      key: project.project_id,
                      label: (
                        <a
                          onClick={() =>
                            handleAddStudentToProject(project, option)
                          }
                        >
                          {project.group_name} ({project.project_code})
                        </a>
                      ),
                    })),
                  }}
                  disabled={classObj.status === StatusEnum.Active}
                  placement="bottom"
                  arrow={{
                    pointAtCenter: true,
                  }}
                >
                  {loadingAddStudent ? (
                    <button className="px-2 py-1 btn btn-wave waves-effect waves-light btn-outline-info">
                      <LoadingOutlined />
                    </button>
                  ) : (
                    <button className="px-2 py-1 btn btn-wave waves-effect waves-light btn-outline-info">
                      <PlusOutlined />
                    </button>
                  )}
                </Dropdown>
              </div>
            </Tooltip>
            <Tooltip
              title="Delete"
              placement="top"
              color="#dc3545"
              size="large"
            >
              <div>
                {loadingWaitDelete ? (
                  <BaseButton
                    color="danger"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    color="danger"
                    variant="outline"
                    disabled={classObj.status === StatusEnum.Active}
                    nameTitle="px-2 py-1"
                    onClick={() =>
                      handleWaitingListDelete(option.class_student_id)
                    }
                    icon={<DeleteFilled />}
                  />
                )}
              </div>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip
              title="Move to Another Project"
              placement="top"
              color="rgb(73, 182, 245)"
              size="large"
            >
              <div>
                {/* <BaseFilter
                  icon={
                    <BaseButton
                      icon={<PlusOutlined />}
                      variant="outline"
                      nameTitle="px-2 py-1"
                      color="info"
                    />
                  }
                  filterBody={
                    <MoveToAnotherProject
                      projects={projects}
                      student={option}
                      classId={classId}
                      fetchData={fetchData}
                      project={project}
                      searchParams={searchParams}
                      fetchFilterData={fetchFilterData}
                      searchClassParams={searchClassParams}
                      handleMoveToAnotherProject={handleMoveToAnotherProject}
                    />
                  }
                /> */}
                <Dropdown
                  menu={{
                    items: projects
                      .filter(
                        (projectItem) =>
                          projectItem.project_id !== project.project_id
                      )
                      .map((projectItem) => ({
                        key: projectItem.project_id,
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
                            {projectItem.group_name} ({projectItem.project_code}
                            )
                          </a>
                        ),
                      })),
                  }}
                  disabled={classObj.status === StatusEnum.Active}
                  placement="bottom"
                  arrow={{
                    pointAtCenter: true,
                  }}
                >
                  {actionId === option.class_student_id && loadingMove ? (
                    <button className="px-2 py-1 btn btn-wave waves-effect waves-light btn-outline-info">
                      <LoadingOutlined />
                    </button>
                  ) : (
                    <button className="px-2 py-1 btn btn-wave waves-effect waves-light btn-outline-info">
                      <PlusOutlined />
                    </button>
                  )}
                </Dropdown>
              </div>
            </Tooltip>
            {!isLeader ? (
              <Tooltip
                title="Set Leader"
                placement="top"
                color="rgb(132, 90, 223)"
                size="large"
              >
                <div>
                  {loadingLeader ? (
                    <BaseButton
                      color="primary"
                      variant="outline"
                      nameTitle="px-2 py-1"
                      icon={<LoadingOutlined />}
                    />
                  ) : (
                    <BaseButton
                      color="primary"
                      variant="outline"
                      nameTitle="px-2 py-1"
                      disabled={classObj.status === StatusEnum.Active}
                      onClick={() =>
                        handleSetLeader(option.student_id, project)
                      }
                      icon={<StarOutlined />}
                    />
                  )}
                </div>
              </Tooltip>
            ) : (
              ""
            )}
            <Tooltip
              title="Remove"
              placement="top"
              color="#dc3545"
              size="large"
            >
              <div>
                {actionId === option.class_student_id && loadingRemove ? (
                  <BaseButton
                    color="danger"
                    variant="outline"
                    nameTitle="px-2 py-1"
                    icon={<LoadingOutlined />}
                  />
                ) : (
                  <BaseButton
                    color="danger"
                    disabled={classObj.status === StatusEnum.Active}
                    variant="outline"
                    nameTitle="px-2 py-1"
                    onClick={() => handleProjectStudentDelete(option, project)}
                    icon={<DeleteFilled />}
                  />
                )}
              </div>
            </Tooltip>
          </>
        )}
      </div>
    </>
  );
};
