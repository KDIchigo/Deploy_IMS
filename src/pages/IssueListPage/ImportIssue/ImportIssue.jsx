import { UploadOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseUploadFile } from "src/components/Base/BaseUploadFile/BaseUploadFile";
import { ImportStudentEnum } from "src/enum/Enum";

export const ImportIssue = ({
  classId,
  fetchFilterData,
  searchClassParams,
  fetchAllData,
}) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const handleImport = async (fileExcel) => {
    const formData = new FormData();
    formData.append("formFile", fileExcel.originFileObj);
    // formData.append("class_id", classId);
    const { data, err } = await axiosClient.post(
      `/ClassStudent/Import/e9cdd585-6b2c-11ee-9a7c-3c2c309d7e8b&${ImportStudentEnum.ImportIntoProject}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (err) {
      toast.error("Change class student fail!");
      return;
    } else {
      toast.success("Change class student successfully!");
      fetchFilterData(searchClassParams);
      fetchAllData();
      toggle();
    }
    console.log(data, err);
  };
  return (
    <>
      <Tooltip title="Import" placement="top" color="#E6533C" size="large">
        <div>
          <BaseButton
            variant="outline"
            nameTitle="mt-1 px-3 py-1"
            color="danger"
            icon={<UploadOutlined />}
            onClick={toggle}
          />
        </div>
      </Tooltip>
      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <form autoComplete="off">
          <ModalHeader toggle={toggle}>Import Issue</ModalHeader>
          <ModalBody className="row">
            <BaseUploadFile classId={classId} handleImport={handleImport} />
          </ModalBody>
        </form>
      </Modal>
    </>
  );
};
