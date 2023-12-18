import * as XLSX from "xlsx";

// const exportToExcel = (data, filename) => {
//   const ws = XLSX.utils.json_to_sheet(data);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//   XLSX.writeFile(wb, filename);
// };

const exportToExcelTemplate = (exportExcel) => {
  const blob = new Blob([exportExcel], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Tạo liên kết tải về
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2Fexcel%2FDanhsachsinhvien.xlsx?alt=media&token=af8c527f-ec43-4bdb-ad72-7701267e2114");
  document.body.appendChild(link);
  link.click();

  // Giải phóng URL khi không cần thiết nữa
  window.URL.revokeObjectURL(url);
}

const exportToExcel = (exportExcel, filename) => {
  const blob = new Blob([exportExcel], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  console.log(blob)

  // Tạo liên kết tải về
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Giải phóng URL khi không cần thiết nữa
  window.URL.revokeObjectURL(url);
}

const importToExcel = async (e) => {
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
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    console.log(JSON.stringify(json));
  };
  reader.readAsArrayBuffer(e.target.files[0]);
};
export { exportToExcel, importToExcel };
