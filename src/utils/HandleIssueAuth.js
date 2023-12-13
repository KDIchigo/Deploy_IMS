import { ConditionEnum, FilterOperatorEnum } from "src/enum/Enum";
import { axiosClient } from "src/axios/AxiosClient";

const projectsByStudent = async (currentUser, projectParam, isNull) => {
  const { data: classStudent } = await axiosClient.post(
    `/ClassStudent/GetFilterData?sortString=created_date ASC`,
    [
      {
        field: "student_id",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
      },
    ]
  );
  classStudent.length !== 0
    ? classStudent
        .filter((ele) => ele.project_id !== null)
        .map((project) => {
          projectParam.push({
            field: "project_id",
            value: project.project_id,
            condition: ConditionEnum.Equal,
            operator: FilterOperatorEnum.OR,
          });
        })
    : (isNull = true);
};

const projectsByTeacher = async (currentUser, projectParam, isNull) => {
  const { data: classItem } = await axiosClient.post(
    `/Class/GetFilterData?sortString=created_date ASC`,
    [
      {
        field: "teacher_id",
        value: currentUser.user_id,
        condition: ConditionEnum.Equal,
      },
    ]
  );
  let projectTeacherParam = [];
  classItem.length !== 0
    ? classItem.map((classEle) => {
        projectParam.push({
          field: "class_id",
          value: classEle.class_id,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
        });
      })
    : (isNull = true);
    // console.log(classItem)
    // console.log(projectParam)
    // console.log(isNull)
  //   if (!isNull) {
  //     projectTeacherParam.length !== 0
  //     ? projectTeacherParam
  //         .filter((ele) => ele.project_id !== null)
  //         .map((project) => {
  //           projectParam.push({
  //             field: "project_id",
  //             value: project.project_id,
  //             condition: ConditionEnum.Equal,
  //             operator: FilterOperatorEnum.OR,
  //           });
  //         })
  //     : (isNull = true);
  //   }
};

export { projectsByStudent, projectsByTeacher };
