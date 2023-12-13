import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { ClassStudentDetails } from "src/pages/ClassDetailsPage/ClassStudents/ClassStudentDetails/ClassStudentDetails";

export const StudentAction = ({
  optionId,
  fetchData,
  searchParams,
  classId,
  student,
  option,
  code,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const handleDelete = async (id) => {
    const classStudentId = [];
    classStudentId.push(id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete the student named ${code} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoadingData(true);
          const { data, err } = await axiosClient.delete(
            "ClassStudent/DeleteMultiple",
            {
              data: classStudentId,
            }
          );

          if (err) {
            toast.error(`The student named ${code} was deleted fail`);
            setLoadingData(false);
            return;
          }
          fetchData(searchParams);

          toast.success(`The student named ${code} was deleted successfully`);
          setLoadingData(false);
        }
      });
    // console.log(classStudentId);
  };

  return (
    <>
      <div className="d-flex justify-content-around">
        <ClassStudentDetails
          student={student}
          fetchData={fetchData}
          searchParams={searchParams}
          classId={classId}
          code={code}
        />

        <Tooltip title="Delete" placement="top" color="#dc3545" size="large">
          <div>
            {loadingData ? (
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
                nameTitle="px-2 py-1"
                onClick={() => handleDelete(optionId)}
                icon={<DeleteOutlined />}
              />
            )}
          </div>
        </Tooltip>
      </div>
    </>
  );
};
