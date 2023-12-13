import { UploadOutlined } from "@ant-design/icons";
import { Button, Result, Steps, Tooltip, message, theme } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseUploadFile } from "src/components/Base/BaseUploadFile/BaseUploadFile";
import { ImportStudentEnum } from "src/enum/Enum";
import { ImportProjectStudentTable } from "./ImportProjectTable/ImportProjectTable";
import { Box } from "@mui/material";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";

export const ImportProject = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [classObj, setClassObj] = useState(false);
  const [current, setCurrent] = useState(0);
  const [importData, setImportData] = useState({
    demoData: [],
    successData: [],
  });
  const fetchData = async () => {
    const { data } = await axiosClient.get(`Class/${classId}`);
    setClassObj(data);
  };
  const toggle = () => {
    setModal(!modal);
    setCurrent(0);
  };
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const handleInsertImport = async (successData) => {
    const { data, err } = await axiosClient.post(
      `ClassStudent/InsertMultiple?action=${ImportStudentEnum.ImportIntoProject}`,
      successData
    );

    if (err) {
      toast.error("Import fail!");
      return;
    } else {
      toast.success("Import Successful!");
    }
    next();
  };
  const handleImport = async (fileExcel) => {
    const formData = new FormData();
    formData.append("formFile", fileExcel.originFileObj);
    // formData.append("class_id", classId);
    const { data, err } = await axiosClient.post(
      `/ClassStudent/Import/${classId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (err) {
      toast.error("Import fail!");
      return;
    } else {
      // toast.success("Import Successful!");
      setImportData(data);
      data.successData.length === 0 ? setIsView(true) : setIsView(false);
      if (
        data.successData.length > 0 &&
        data.successData.length < data.demoData.length
      ) {
        toast.warning(
          `The list contains ${
            data.demoData.length - data.successData.length
          } invalid records. Please correct them...`
        );
      }
      setLoading(true);
    }
    next();
  };
  const steps = [
    {
      title: "Import",
      content: (
        <BaseUploadFile
          handleImport={handleImport}
          excelName="ImportStudentIntoProject.xlsx"
          actionURL="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2Fexcel%2FImportStudentIntoProject.xlsx?alt=media&token=3db3d7b8-f70c-495c-a2d2-a227ee3e94ed"
        />
      ),
      description: "Import",
    },
    {
      title: "Demo data",
      content: (
        <ImportProjectStudentTable
          importData={importData}
          handleInsertImport={handleInsertImport}
          current={current}
          isView={isView}
          prev={prev}
        />
      ),
      description: "Demo data",
      //   icon: <LoadingOutlined />,
    },
    {
      title: "Success",
      content: (
        <Result
          status="success"
          title="Successfully Import Project Allocation!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate(`/project-list`)}
            >
              Go Project Allocation
            </Button>,
            // <Button key="buy">Buy Again</Button>,
          ]}
        />
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    description: item.description,
    icon: item.icon,
  }));
  const contentStyle = {
    // lineHeight: "260px",
    // textAlign: "center",
    color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      <NavbarDashboard
        position="project"
        spin={true}
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    Import Student for {classObj.class_code} Class
                  </h3>
                  <div className="row p-0 m-0 mb-2 align-items-center justify-content-between ">
                    <Steps current={current} items={items} />
                    <div style={contentStyle}>{steps[current].content}</div>
                    {/* <div
                      style={{
                        marginTop: 24,
                      }}
                    >
                      {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                          Next
                        </Button>
                      )}
                      {current === steps.length - 1 && (
                        <Button
                          type="primary"
                          onClick={() =>
                            message.success("Processing complete!")
                          }
                        >
                          Done
                        </Button>
                      )}
                      {current > 0 && (
                        <Button
                          style={{
                            margin: "0 8px",
                          }}
                          onClick={() => prev()}
                        >
                          Previous
                        </Button>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};
