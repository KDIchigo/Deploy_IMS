import {
  DownOutlined,
  DownloadOutlined,
  ExportOutlined,
  ImportOutlined,
  LoadingOutlined,
  ReloadOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import { Dropdown, Space, Tooltip, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { ConditionEnum } from "src/enum/Enum";
import { exportToExcel } from "src/utils/handleExcel";
import "./ClassStudent.scss";
import { ClassStudentsTable } from "./ClassStudentsTable/ClassStudentsTable";
import { NewClassStudent } from "./NewClassStudent/NewClassStudent";
import { NewClassStudentExist } from "./NewClassStudent/NewClassStudentExist";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
const items = [
  {
    key: "1",
    label: "New Student",
    children: <NewClassStudent />,
  },
  {
    key: "2",
    label: "Exist Student",
    children: "Content of Tab Pane 2",
  },
];

// const searchClassStudent = [
//   {
//     id: "student_name",
//     value: "Student Name",
//   },
//   {
//     id: "student_email",
//     value: "Email",
//   },
//   {
//     id: "student_phone",
//     value: "Phone",
//   },
// ];

export const ClassStudents = ({
  classId,
  classObj,
  fetchData,
  searchParams,
  students,
  onSearch,
  onFilter,
  onReset,
  onPageChange,
  onPageSizeChange,
  settingStudent,
  loadingTable,
  loading,
  onSearchAll,
  searchClassStudent,
  checkedSearchInput,
  setCheckedSearchInput,
  checkedSearchSelect,
  setCheckedSearchSelect,
  setSearchParamsURL,
  existStudents,
  setExistStudents,
  studentsParams,
  setStudentsParams,
  loadingOther,
  loadingOtherData,
  loadingOtherTable,
  setLoadingOther,
  setLoadingOtherData,
  setLoadingOtherTable,
  checkedSearchInputOther,
  setCheckedSearchInputOther,
  checkedSearchSelectOther,
  setCheckedSearchSelectOther,
}) => {
  const navigate = useNavigate();
  const [modalStudent, setModalStudent] = useState(false);
  const [modalStudentExist, setModalStudentExist] = useState(false);
  // const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  // const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [spin, setSpin] = useState(false);

  const toggleStudent = () => setModalStudent(!modalStudent);
  const toggleStudentExist = () => setModalStudentExist(!modalStudentExist);

  const [exportParam, setExportParam] = useState([
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
    },
  ]);

  const handleExportToExcel = async () => {
    try {
      // Gọi API để lấy dữ liệu Excel
      const { data: exportExcel } = await axiosClient.post(
        "/ClassStudent/Export",
        exportParam,
        {
          responseType: "arraybuffer", // Đảm bảo dữ liệu trả về dưới dạng binary
        }
      );
      exportToExcel(exportExcel, "StudentList.xlsx");
      // const blob = new Blob([exportExcel], {
      //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // });

      // // Tạo liên kết tải về
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", "Danhsachsinhvien.xlsx");
      // document.body.appendChild(link);
      // link.click();

      // // Giải phóng URL khi không cần thiết nữa
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải file Excel: ", error);
    }
  };
  const handleButtonClick = (e) => {
    message.info("Click on left button.");
  };
  const handleMenuClick = (e) => {
    message.info("Click on menu item.");
  };
  const handleAddnewStudent = () => {
    toggleStudent();
  };
  const handleAddnewStudentExist = () => {
    toggleStudentExist();
  };
  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const items = [
    {
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAddnewStudent}
        >
          Add New Student
        </a>
      ),
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAddnewStudentExist}
        >
          Add Existing Student
        </a>
      ),
      key: "2",
      icon: <UserOutlined />,
    },
  ];
  const menuProps = {
    items,
  };
  return (
    <>
      <Box className="box w-100 d-flex flex-column flexGrow_1 flex_height ">
        {/* <div className="card custom-card mb-0 flexGrow_1">
            <div className="card-body d-flex flex-column"> */}
        <div className="row">
          <div className="row p-0 m-0 align-items-center justify-content-between">
            <h3 className="fw-bold m-0 " style={{ paddingBottom: 10 }}>
              Students for Class {classObj.class_code}
            </h3>
            <div className="col-lg-7 col-md-3 my-auto">
              {/* <BaseSearch
              className="col-lg-9 col-md-8 p-0 m-0"
              placeholderInput="Search here..."
              placeholderSelect="Search by"
              options={searchClassStudent}
              onSearch={onSearch}
              checkedSearchSelect={checkedSearchSelect}
              onResetSearchSelect={onResetSearchSelect}
              checkedSearchInput={checkedSearchInput}
              onResetSearchInput={onResetSearchInput}
            /> */}
              <BaseSearchAll
                className="col-lg-7 p-0 m-0"
                placeholderInput="Search here..."
                options={searchClassStudent}
                onSearch={onSearchAll}
                checkedSearchSelect={checkedSearchSelect}
                onResetSearchSelect={onResetSearchSelect}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              />
            </div>
            <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative d-flex align-items-center justify-content-end">
              <Space
                wrap
                className="col-lg-7 float-end d-flex h-100 justify-content-end"
              >
                <Tooltip
                  title="Reset"
                  placement="top"
                  color="#845adf"
                  size="large"
                >
                  {loading ? (
                    <LoadingOutlined
                      className="filterIcon me-4 float-end"
                      disabled
                    />
                  ) : (
                    <ReloadOutlined
                      className="filterIcon me-4 float-end"
                      onClick={() => {
                        onReset();
                      }}
                    />
                  )}
                </Tooltip>
                <div className="d-flex align-items-center">
                  <BaseButton
                    color="success"
                    variant="outline"
                    value="Export"
                    nameTitle="me-2 px-3 py-1"
                    isIconLeft={true}
                    icon={<ExportOutlined />}
                    onClick={() => handleExportToExcel()}
                  />
                  <BaseButton
                    variant="outline"
                    nameTitle="ms-3 px-3 py-1"
                    color="danger"
                    value="Import"
                    isIconLeft={true}
                    icon={<ImportOutlined />}
                    onClick={() => navigate(`/class-import-student/${classId}`)}
                  />
                  {/* </Tooltip> */}
                </div>
              </Space>
              <Dropdown.Button
                type="primary"
                className="w-auto ms-3 d-flex justify-content-end"
                menu={menuProps}
                icon={<DownOutlined />}
                onChange={handleButtonClick}
              >
                Add New
              </Dropdown.Button>
              <NewClassStudent
                modal={modalStudent}
                setModalStudent={setModalStudent}
                toggle={toggleStudent}
                fetchData={fetchData}
                searchParams={searchParams}
                classId={classId}
              />
              <NewClassStudentExist
                modal={modalStudentExist}
                setModalStudentExist={setModalStudentExist}
                toggle={toggleStudentExist}
                classId={classId}
                fetchData={fetchData}
                searchParams={searchParams}
                settingStudent={settingStudent}
                setSearchParamsURL={setSearchParamsURL}
                students={existStudents}
                setStudents={setExistStudents}
                studentsParams={studentsParams}
                setStudentsParams={setStudentsParams}
                loadingOther={loadingOther}
                loadingOtherData={loadingOtherData}
                loadingOtherTable={loadingOtherTable}
                setLoading={setLoadingOther}
                setLoadingData={setLoadingOtherData}
                setLoadingTable={setLoadingOtherTable}
                checkedSearchInput={checkedSearchInputOther}
                setCheckedSearchInput={setCheckedSearchInputOther}
                checkedSearchSelect={checkedSearchSelectOther}
                setCheckedSearchSelect={setCheckedSearchSelectOther}
              />
            </div>
          </div>
        </div>

        <Grid container className="m-0 flexGrow_1 d-flex flex-column">
          <Grid
            item
            md={12}
            xs={12}
            sm={12}
            className="flexGrow_1 d-flex flex-column"
          >
            <ClassStudentsTable
              // users={users}
              students={students}
              classId={classId}
              fetchData={fetchData}
              searchParams={searchParams}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              loadingTable={loadingTable}
            />
          </Grid>
        </Grid>
        {/* </div>
          </div> */}
      </Box>
    </>
  );
};
