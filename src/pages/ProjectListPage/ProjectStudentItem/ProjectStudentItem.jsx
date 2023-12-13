import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Badge, Table, Tooltip } from "antd";
import { useState } from "react";
import { ProjectAction } from "src/components/Base/BaseAction/ProjectAction";
import { ProjectActionDemo } from "src/components/Base/BaseAction/ProjectActionDemo";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { StatusEnum } from "src/enum/Enum";
import { Role } from "src/enum/Role";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { HandleAuth } from "src/utils/handleAuth";

export const ProjectStudentItem = ({
  students,
  isWaitingList,
  fetchData,
  searchParams,
  project,
  projects,
  classId,
  classObj,
  fetchFilterData,
  searchClassParams,
  handleWaitingListDelete,
  handleAddStudentToProject,
  handleMoveToAnotherProject,
  handleProjectStudentDelete,
  handleSetLeader,
  onPageChange,
  actionId,
  loadingRemove,
  loadingLeader,
  loadingMove,
}) => {
  // const [students, setStudents] = useState([]);
  // const [searchParams, setSearchParams] = useState([
  //   {
  //     field: "project_id",
  //     value: project.project_id,
  //     condition: ConditionEnum.Equal,
  //   },
  // ]);
  // const fetchData = async (searchParams) => {
  //   const { data: studentList } = await axiosClient.post(
  //     "/ClassStudent/GetFilterData?sortString=created_date ASC",
  //     searchParams
  //   );
  //   setStudents(studentList);
  // };
  // useEffect(() => {
  //   fetchData(searchParams);
  // }, []);

  const { IsStudent } = HandleAuth();
  const dataSource = [];
  isWaitingList
    ? students.data.length !== 0
      ? students.data.map((student, index) => {
          dataSource.push({
            key: student.class_student_id,
            order: index + 1,
            fullname: student.student_name,
            email: student.student_email,
            // phone_number: student.student_phone,
            status:
              student.status === 1 ? (
                <Badge
                  key="#198754"
                  color="#198754"
                  text="Active"
                  className="badgeActive"
                />
              ) : (
                <Badge
                  key="red"
                  color="red"
                  text="Inactive"
                  className="badgeInactive"
                />
              ),
            action: (
              <AuthoComponentRoutes
                element={
                  <>
                    <ProjectActionDemo
                      optionId={student.class_student_id}
                      option={student}
                      isWaitingList={isWaitingList}
                      fetchData={fetchData}
                      searchParams={searchParams}
                      fetchFilterData={fetchFilterData}
                      searchClassParams={searchClassParams}
                      projects={projects}
                      project={project}
                      classId={classId}
                      loadingLeader={loadingLeader}
                      loadingMove={loadingMove}
                      loadingRemove={loadingRemove}
                      handleWaitingListDelete={handleWaitingListDelete}
                      handleAddStudentToProject={handleAddStudentToProject}
                    />
                  </>
                }
                listRole={[Role.Manager, Role.Admin, Role.Teacher]}
              />
            ),
          });
        })
      : ""
    : "";

  !isWaitingList
    ? students.length !== 0
      ? students.map((student, index) => {
          dataSource.push({
            key: student.class_student_id,
            order: index + 1,
            fullname: (
              <span>
                {student.student_name}{" "}
                {project.leader_id === student.student_id ? (
                  <StarFilled style={{ color: "orange" }} />
                ) : (
                  ""
                )}
              </span>
            ),
            email: student.student_email,
            // phone_number: student.student_phone,
            status:
              student.status === 1 ? (
                <Badge
                  key="#198754"
                  color="#198754"
                  text="Active"
                  className="badgeActive"
                />
              ) : (
                <Badge
                  key="red"
                  color="red"
                  text="Inactive"
                  className="badgeInactive"
                />
              ),
            action: (
              <AuthoComponentRoutes
                element={
                  <ProjectActionDemo
                    optionId={student.student_id}
                    option={student}
                    isWaitingList={isWaitingList}
                    fetchData={fetchData}
                    project={project}
                    projects={projects}
                    classObj={classObj}
                    loadingLeader={loadingLeader}
                    loadingMove={loadingMove}
                    loadingRemove={loadingRemove}
                    searchParams={searchParams}
                    fetchFilterData={fetchFilterData}
                    searchClassParams={searchClassParams}
                    handleSetLeader={handleSetLeader}
                    handleMoveToAnotherProject={handleMoveToAnotherProject}
                    handleProjectStudentDelete={handleProjectStudentDelete}
                    isLeader={
                      project.leader_id === student.student_id
                    }
                    actionId={actionId}
                  />
                }
                listRole={[Role.Manager, Role.Admin, Role.Teacher]}
              />
            ),
          });
        })
      : ""
    : "";
  let columns = [];
  {
    IsStudent()
      ? (columns = [
          {
            title: "#",
            dataIndex: "order",
            key: "order",
            width: "5%",
            fixed: "left",
            align: "center",
            sorter: (a, b) => a.order - b.order,
          },
          {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            width: "30%",
            sorter: (a, b) => a.fullname.length - b.fullname.length,
            render: (fullname) => (
              <Tooltip placement="topLeft" title={fullname}>
                {fullname}
              </Tooltip>
            ),
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "55%",
            sorter: (a, b) => a.email.length - b.email.length,
            render: (email) => (
              <Tooltip placement="topLeft" title={email}>
                {email}
              </Tooltip>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
            align: "center",
          },
        ])
      : (columns = [
          {
            title: "#",
            dataIndex: "order",
            key: "order",
            width: "5%",
            fixed: "left",
            align: "center",
            sorter: (a, b) => a.order - b.order,
          },
          {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            width: "30%",
            sorter: (a, b) => a.fullname.length - b.fullname.length,
            render: (fullname) => (
              <Tooltip placement="topLeft" title={fullname}>
                {fullname}
              </Tooltip>
            ),
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "45%",
            sorter: (a, b) => a.email.length - b.email.length,
            render: (email) => (
              <Tooltip placement="topLeft" title={email}>
                {email}
              </Tooltip>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
            align: "center",
          },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: "10%",
            align: "center",
            fixed: "right",
            borderColor: "black",
          },
        ]);
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        // rowSelection={rowSelection}
        showHeader={false}
        pagination={false}
        size="small"
      />
      {isWaitingList ? (
        students.data.length !== 0 ? (
          <BasePagination
            pageNumber={searchParams.pageNumber}
            onPageChange={(pageNumber) => {
              // setSearchParams({ ...searchParams, pageNumber: pageIndex });
              // console.log(searchParams, pageIndex);
              onPageChange(pageNumber);
            }}
            pageSize={searchParams.pageSize}
            totalRecord={students.totalRecord}
          />
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </>
  );
};
