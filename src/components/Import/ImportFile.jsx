import React from "react";
import { read, utils } from "xlsx";

export const ImportFile = () => {
  const importFile = async (e) => {
    e.preventDefault();
    if (!e.target.files) {
      return console.log("file khong ton tai");
    }
    const file = e.target.files[0];
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return console.log("Chỉ nhận định dạng file excel");
    }
    if (file.size >= 1 * 1024 * 1024) {
      return console.log(
        "Bạn không nên nhập quá nhiều thẻ trong một bộ! Tối đa 1000 thẻ. File size max 1MB"
      );
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = utils.sheet_to_json(worksheet);
      console.log(JSON.stringify(json));
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };
  return <input type="file" onChange={importFile} />;
};
