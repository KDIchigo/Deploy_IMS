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
      exportToExcel(exportExcel);
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
        <div className="row d-flex flex-row">
          <div className="col-lg-7 my-auto d-flex">
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
          <div className="col-lg-5 mt-sm-0 mt-2 align-items-center float-end d-flex flex-row">
            <Space
              wrap
              className="my-auto py-2 col-lg-3 mb-1 ms-0 float-end flexGrow_1 dropdownStudent"
            >
              <Tooltip
                title="Reset"
                placement="topLeft"
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
              <div className="flexGrow_1 d-flex flex-row justify-content-end">
                {/* <Tooltip
                  title="Export"
                  placement="top"
                  color="#8E69DF"
                  size="large"
                > */}
                {/* <div>
                    <BaseButton
                      color="primary"
                      variant="outline"
                      nameTitle="me-2 px-3 py-1"
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportToExcel()}
                    />
                  </div> */}
                <div>
                  <BaseButton
                    color="success"
                    variant="outline"
                    value="Export"
                    nameTitle="mt-1 me-4 px-3 py-1"
                    isIconLeft={true}
                    icon={<ExportOutlined />}
                    onClick={() => handleExportToExcel()}
                  />
                </div>
                {/* </Tooltip> */}
                {/* <ImportClassStudent
                  classId={classId}
                  fetchData={fetchData}
                  searchParams={searchParams}
                /> */}
                {/* <ImportDemo
                  classId={classId}
                  fetchData={fetchData}
                  searchParams={searchParams}
                /> */}
                {/* <Tooltip
                  title="Import"
                  placement="top"
                  color="#E6533C"
                  size="large"
                > */}
                {/* <div>
                    <BaseButton
                      variant="outline"
                      nameTitle="px-3 py-1"
                      color="danger"
                      icon={<UploadOutlined />}
                      onClick={() =>
                        navigate(`/class-import-student/${classId}`)
                      }
                    />
                  </div> */}
                <div>
                  <BaseButton
                    variant="outline"
                    nameTitle="mt-1 px-3 py-1"
                    color="danger"
                    value="Import"
                    isIconLeft={true}
                    icon={<ImportOutlined />}
                    onClick={() => navigate(`/class-import-student/${classId}`)}
                  />
                </div>
                {/* </Tooltip> */}
              </div>
              <Dropdown.Button
                type="primary"
                className="flexGrow_1 d-flex flex-row justify-content-end ms-0"
                menu={menuProps}
                icon={<DownOutlined />}
                onChange={handleButtonClick}
              >
                Add New
              </Dropdown.Button>
            </Space>
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
            />
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
