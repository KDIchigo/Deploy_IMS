import React, { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { ConditionEnum } from "src/enum/Enum";
import { IssueTypeItem } from "../IssueTypeItem/IssueTypeItem";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Empty, Spin } from "antd";

export const IssueTypeStudent = ({
  onPageChange,
  issues,
  searchParams,
  fetchData,
  projectId,
  openBatchUpdate,
  handleUpdateMultiple,
  loadingTable,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (e) => {
    let isSelected = e.target.checked;
    let value = e.target.value;
    if (isSelected) {
      setSelectedRowKeys([...selectedRowKeys, value]);
      handleUpdateMultiple([...selectedRowKeys, value]);
    } else {
      setSelectedRowKeys((prevData) => {
        return prevData.filter((id) => {
          return id !== value;
        });
      });
      // console.log('test', selectedRowKeys.filter((id) => id !== value))
      handleUpdateMultiple(selectedRowKeys.filter((id) => id !== value));
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="d-flex flex-column flexGrow_1">
      <div className="d-flex flex-column flexGrow_1 justify-content-center">
        {loadingTable ? (
          issues.data.length !== 0 ? (
            issues.data.map((issue, i) => (
              <IssueTypeItem
                order={
                  (searchParams.pageNumber - 1) * searchParams.pageSize + i + 1
                }
                key={issue.issue_id}
                issue={issue}
                searchParams={searchParams}
                fetchData={fetchData}
                onPageChange={onPageChange}
                projectId={projectId}
                openBatchUpdate={openBatchUpdate}
                onSelectChange={onSelectChange}
                selectedRowKeys={selectedRowKeys}
              />
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )
        ) : (
          <Spin tip="Loading" size="large">
            {issues.data.length !== 0 ? (
              issues.data.map((issue, i) => (
                <IssueTypeItem
                  order={
                    (searchParams.pageNumber - 1) * searchParams.pageSize +
                    i +
                    1
                  }
                  key={issue.issue_id}
                  issue={issue}
                  searchParams={searchParams}
                  fetchData={fetchData}
                  onPageChange={onPageChange}
                  projectId={projectId}
                  openBatchUpdate={openBatchUpdate}
                  onSelectChange={onSelectChange}
                  selectedRowKeys={selectedRowKeys}
                />
              ))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Spin>
        )}
      </div>
    </div>
  );
};
