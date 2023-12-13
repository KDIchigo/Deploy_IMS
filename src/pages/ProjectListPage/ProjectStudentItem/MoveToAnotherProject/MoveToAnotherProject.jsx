import { MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { swalWithBootstrapButtons } from "src/enum/swal";

export const MoveToAnotherProject = ({
  projects,
  project,
  student,
  classId,
  fetchData,
  searchParams,
  fetchFilterData,
  searchClassParams,
  handleMoveToAnotherProject,
}) => {
  const navigate = useNavigate();
  // const handleMoveToAnotherProject = async (project, student, fetchData, searchParams) => {
  //   console.log(student);
  //   const { data, err } = await axiosClient.put(
  //     `ClassStudent/${student.class_student_id}`,
  //     {
  //       class_student_id: student.class_student_id,
  //       student_id: student.student_id,
  //       class_id: project.class_id,
  //       project_id: project.project_id,
  //     }
  //   );

  //   if (err) {
  //     toast.error("Add fail!");
  //     return;
  //   } else {
  //     toast.success("Add Successful!");
  //     // fetchWaitingData(searchWaitingParams)
  //     fetchData(searchParams);
  //   }
  // };
  return (
    <>
      {projects.filter(projectItem => projectItem.project_id !== project.project_id).map((projectItem) => (
        <MenuItem
          key={projectItem.project_id}
          onClick={() => handleMoveToAnotherProject(projectItem, student, fetchData, searchParams)}
          disableRipple
        >
          {projectItem.project_code}
        </MenuItem>
      ))}
    </>
  );
};
