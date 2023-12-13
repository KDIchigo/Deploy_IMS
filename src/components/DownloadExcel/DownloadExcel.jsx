import { BaseButton } from "../Base/BaseButton/BaseButton";

export const DownloadExcelTemplate = ({ exceURL }) => {
  const downloadExcelTemplate = () => {
    // Đường dẫn tới tệp Excel mẫu
    const templateFileURL = `${exceURL}`;

    // Tạo một liên kết ảo
    const link = document.createElement("a");
    link.href = templateFileURL;
    link.download = "excel_template.xlsx"; // Tên của tệp khi tải về
    link.click();
  };

  return (
    <>
      <BaseButton
        nameTitle="w-25 flexGrow_1 me-5"
        type="button"
        value="Template"
        color="light"
        onClick={downloadExcelTemplate}
      />
    </>
  );
};
