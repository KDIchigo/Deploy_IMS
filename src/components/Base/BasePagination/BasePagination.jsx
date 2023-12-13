import { ConfigProvider, Pagination } from "antd";
import React from "react";

export const BasePagination = ({
  pageNumber,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalRecord,
}) => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ec8550f0",
          },
        }}
      >
        {" "}
        <Pagination
          className="text-center"
          defaultPageSize={pageSize}
          current={pageNumber}
          total={totalRecord}
          pageSizeOptions={["10", "20", "30", "40"]}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total: ${total} records`}
          onChange={(pageIndex, pageSize) => {
            onPageChange(pageIndex, pageSize);
            // console.log(pageSize);
            // fetchData()
          }}
          onShowSizeChange={(current, size) => {
            // console.log(size);
            onPageSizeChange(size)
            // Handle the pageSize change here
          }}
        />
      </ConfigProvider>
    </>
  );
};
