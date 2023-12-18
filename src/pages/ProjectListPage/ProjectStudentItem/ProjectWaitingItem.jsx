import {
  DeleteFilled,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Badge, Dropdown, Table, Tooltip } from "antd";
import { useState } from "react";
import { ProjectAction } from "src/components/Base/BaseAction/ProjectAction";
import { ProjectActionDemo } from "src/components/Base/BaseAction/ProjectActionDemo";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Role } from "src/enum/Role";
import { AuthoComponentRoutes } from "src/routes/AuthoComponentRoutes";
import { HandleAuth } from "src/utils/handleAuth";

export const ProjectWaitingItem = ({
  students,
  isWaitingList,
  //   fetchData,
  searchParams,
  projects,
  classId,
  classObj,
  fetchFilterData,
  searchClassParams,
  handleWaitingListDelete,
  handleAddStudentToProject,
  onPageChange,
  loadingAddStudent,
  loadingWaitDelete,
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

  const addToProject = [];
  projects.map((project) =>
    addToProject.push({
      value: project.project_id,
      label: (
        <a onClick={() => handleAddStudentToProject(project, student)}>
          {project.group_name} ({project.project_code})
        </a>
      ),
    })
  );

  const items = [
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
        <a target="_blank">
          <DeleteFilled className="me-2" /> Delete
        </a>
      ),
    },
  ];

  const { IsStudent } = HandleAuth();
  const dataSource = [];
  // console.log(students);
  students.length !== 0
    ? students.map((student, index) => {
        dataSource.push({
          key: student.student_id,
          order: index + 1,
          fullname: student.student_name,
          email: student.student_email,
          // phone_number: student.student_phone,
          status:
            student.status === 1 ? (
              <Badge
                key="#26BF94"
                color="#26BF94"
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
                  {/* <ProjectAction
                    optionId={student.class_student_id}
                    option={student}
                    classObj={classObj}
                    isWaitingList={isWaitingList}
                    searchParams={searchParams}
                    fetchFilterData={fetchFilterData}
                    searchClassParams={searchClassParams}
                    projects={projects}
                    classId={classId}
                    loadingAddStudent={loadingAddStudent}
                    loadingWaitDelete={loadingWaitDelete}
                    handleWaitingListDelete={handleWaitingListDelete}
                    handleAddStudentToProject={handleAddStudentToProject}
                  /> */}
                  <ProjectActionDemo
                    optionId={student.class_student_id}
                    option={student}
                    classObj={classObj}
                    isWaitingList={isWaitingList}
                    searchParams={searchParams}
                    fetchFilterData={fetchFilterData}
                    searchClassParams={searchClassParams}
                    projects={projects}
                    classId={classId}
                    loadingAddStudent={loadingAddStudent}
                    loadingWaitDelete={loadingWaitDelete}
                    handleWaitingListDelete={handleWaitingListDelete}
                    handleAddStudentToProject={handleAddStudentToProject}
                  />
                  {/* <Tooltip title="More" placement="top" size="large">
                    <Dropdown menu={{ items }} trigger={["click"]} arrow>
                      <MoreOutlined
                        className="ms-2"
                        style={{ fontSize: "18px" }}
                      />
                    </Dropdown>
                  </Tooltip> */}
                </>
              }
              listRole={[Role.Manager, Role.Admin, Role.Teacher]}
            />
          ),
        });
      })
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
      {/* {isWaitingList ? (
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
      )} */}
    </>
  );
};
