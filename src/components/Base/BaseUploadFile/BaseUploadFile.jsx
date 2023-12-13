import React, { useState } from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { BaseButton } from "../BaseButton/BaseButton";
import { DownloadExcelTemplate } from "src/components/DownloadExcel/DownloadExcel";
import { axiosClient } from "src/axios/AxiosClient";
import Dragger from "antd/es/upload/Dragger";

export const BaseUploadFile = ({ handleImport, actionURL, excelName }) => {
  const [fileExcel, setFileExcel] = useState();
  const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);

        // Convert the uploaded file to a File object
        // convertToFile(info.file, importFile);
        setFileExcel(info.file)
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const convertToFile = (file, callback) => {
    // Use the File constructor to create a File object
    const fileObject = new File([file], file.name, { type: file.type });
    // Pass the File object to the callback function
    // callback(fileObject);
    setFileExcel(fileObject);
  };

  // const handleImport = async () => {
  //   const formData = new FormData();
  //   formData.append("formFile", fileExcel.originFileObj);
  //   // formData.append("class_id", classId);
  //   console.log(fileExcel);
  //   const { data, err } = await axiosClient.post(
  //     `/ClassStudent/Import/${classId}`,
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   console.log(data, err);
  // };

  return (
    <>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag a file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      <div className="mt-3 d-flex flex-row">
        <DownloadExcelTemplate exceURL={actionURL} />
        <BaseButton
          nameTitle="w-25 float-end flexGrow_1 ms-5"
          type="button"
          value="Import"
          color="secondary"
          onClick={() => handleImport(fileExcel)}
        />
      </div>
        {/* <input type="file" onChange={() => handleImport()}/> */}
    </>
  );
};
