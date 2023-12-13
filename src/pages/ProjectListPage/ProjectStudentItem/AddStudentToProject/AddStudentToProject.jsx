import { MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { swalWithBootstrapButtons } from "src/enum/swal";

export const AddStudentToProject = ({
  projects,
  student,
  handleAddStudentToProject,
}) => {
  const navigate = useNavigate();
  // const handleAddStudentToProject = async (project, student) => {
  //   console.log(student);
  //   swalWithBootstrapButtons
  //     .fire({
  //       title: "Are you sure?",
  //       text: `Are you sure to Add ${student.student_name} student to ${project.project_code} project?`,
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, add it!",
  //       cancelButtonText: "No, cancel!",
  //       reverseButtons: true,
  //     })
  //     .then(async (result) => {
  //       console.log(result);
  //       if (result.isConfirmed) {
  //         const { data, err } = await axiosClient.put(
  //           `ClassStudent/${student.class_student_id}`,
  //           {
  //             class_student_id: student.class_student_id,
  //             student_id: student.student_id,
  //             class_id: classId,
  //             project_id: project.project_id,
  //           }
  //         );

  //         if (err) {
  //           toast.error("Add fail!");
  //           return;
  //         } else {
  //           swalWithBootstrapButtons.fire(
  //             "Added!",
  //             "User has been added!.",
  //             "success"
  //           );
  //           toast.success("Add Successful!");
  //           // fetchWaitingData(searchWaitingParams)
  //           fetchData(searchParams);
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
  // };
  return (
    <>
      {projects.map((project) => (
        <MenuItem
          key={project.project_id}
          onClick={() => handleAddStudentToProject(project, student)}
          disableRipple
        >
          {project.project_code}
        </MenuItem>
      ))}
    </>
  );
};
