import React, { useEffect, useState } from "react";
import { Collapse } from "antd";
import { ProjectStudentItem } from "../ProjectStudentItem/ProjectStudentItem";
import { SettingOutlined } from "@ant-design/icons";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum } from "src/enum/Enum";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { Role } from "src/enum/Role";
import { ProjectWaitingItem } from "../ProjectStudentItem/ProjectWaitingItem";
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

export const ProjectWaitingList = ({
  classId,
  projects,
  classObj,
  searchWaitingListParams,
  fetchFilterData,
  searchClassParams,
  students,
  handleWaitingListDelete,
  handleAddStudentToProject,
  onPageChange,
  loadingAddStudent,
  loadingWaitDelete,
}) => {
  if (!projects) {
    return null;
  }
  const [loadingData, setLoadingData] = useState(true);

  // const [students, setStudents] = useState({
  //   totalRecord: 0,
  //   data: [],
  //   summary: "",
  // });
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 5,
  //   sortString: "",
  //   filterConditions: [
  //     {
  //       field: "project_id",
  //       value: "",
  //       condition: ConditionEnum.IsNull,
  //     },
  //     {
  //       field: "class_id",
  //       value: classId,
  //       condition: ConditionEnum.Equal,
  //     },
  //   ],
  // });
  // console.log("classId: ", searchParams);
  // const fetchData = async (searchParams) => {
  //   const newFilterConditions = [
  //     {
  //       field: "project_id",
  //       value: "",
  //       condition: ConditionEnum.IsNull,
  //     },
  //     {
  //       field: "class_id",
  //       value: classId,
  //       condition: ConditionEnum.Equal,
  //     },
  //   ];
  //   const newSearchParams = {
  //     ...searchParams,
  //     filterConditions: newFilterConditions,
  //   };
  //   const { data, err } = await axiosClient.post(
  //     `/ClassStudent/GetByPaging`,
  //     searchParams
  //   );

  //   setStudents(data);
  //   setSearchParams(newSearchParams);
  //   setLoadingData(true);
  // };
  // const genExtra = () => (
  //   <SettingOutlined
  //     onClick={(event) => {
  //       // If you don't want click extra trigger collapse, you can prevent this:
  //       event.stopPropagation();
  //     }}
  //   />
  // );

  const onChange = (key) => {
    console.log(key);
  };
  // useEffect(() => {
  // fetchData(searchParams);
  // }, []);
  return (
    <>
      {loadingData ? (
        <Collapse
          className="projectCollapse"
          collapsible="icon"
          items={[
            {
              key: "0",
              label: "Waiting List (These trainees would work personally)",
              children: (
                <ProjectWaitingItem
                  students={students}
                  isWaitingList={true}
                  // fetchData={fetchData}
                  classObj={classObj}
                  searchParams={searchWaitingListParams}
                  fetchFilterData={fetchFilterData}
                  searchClassParams={searchClassParams}
                  projects={projects}
                  classId={classId}
                  loadingAddStudent={loadingAddStudent}
                  loadingWaitDelete={loadingWaitDelete}
                  handleWaitingListDelete={handleWaitingListDelete}
                  handleAddStudentToProject={handleAddStudentToProject}
                  onPageChange={onPageChange}
                />
              ),
              // extra: (
              //   <AuthoComponentRoutes
              //     element={genExtra()}
              //     listRole={[Role.Manager, Role.Admin, Role.Teacher]}
              //   />
              // ),
            },
          ]}
          defaultActiveKey={["1"]}
          onChange={onChange}
        />
      ) : (
        ""
      )}
    </>
  );
};
