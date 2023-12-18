import { ConfigProvider, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { useNavigate } from "react-router";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { BaseAction } from "src/components/Base/BaseAction/BaseAction";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import moment from "moment";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const ProjectDashBoardTable = ({
  commits,
  project,
  searchParams,
  onPageChange,
  onPageSizeChange,
  fetchData,
  loadingTable,
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const data = [];
  for (let index = 0; index < commits.data.length; index++) {
    const commit = commits.data[index];
    let i = index + 1;
    data.push({
      key: commit.id,
      order: i,
      title: commit.title,
      committer_name: commit.committer_name,
      author_email: commit.author_email,
      committed_date: moment(commit.committed_date).format('DD/MM/YYYY'),
      comments: commit.message,
    });
  }
  const columns = [
    {
      title: "#",
      dataIndex: "order",
      key: "order",
      width: "5%",
      fixed: "left",
      ellipsis: true,
      align: "center",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: "20%",
      sorter: (a, b) => a.title.length - b.title.length,
      render: (title) => (
        <Tooltip placement="top" title={title}>
          {title}
        </Tooltip>
      ),
    },

    {
      title: "Committer Name",
      dataIndex: "committer_name",
      key: "committer_name",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.committer_name.length - b.committer_name.length,
      render: (committer_name) => (
        <Tooltip placement="top" title={committer_name}>
          {committer_name}
        </Tooltip>
      ),
    },
    {
      title: "Committer Email",
      dataIndex: "author_email",
      key: "author_email",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.author_email - b.author_email,
      render: (author_email) => (
        <Tooltip placement="top" title={author_email}>
          {author_email}
        </Tooltip>
      ),
    },
    {
      title: "Commit Time",
      dataIndex: "committed_date",
      key: "committed_date",
      width: "15%",
      ellipsis: true,
      render: (committed_date) => (
        <Tooltip committed_date="top" title={committed_date}>
          {committed_date}
        </Tooltip>
      ),
    },

    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: "20%",
      fixed: "right",
      ellipsis: true,
      render: (comments) => (
        <Tooltip placement="top" title={comments}>
          {comments}
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="d-flex flex-column flexGrow_1">
      {/* <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            handleChange(selectedRowKeys, 1);
          }}
          disabled={!hasSelected}
          loading={loadingActive}
        >
          Active
        </Button>
        <Button
          type="primary"
          onClick={() => {
            handleChange(selectedRowKeys, 0);
          }}
          disabled={!hasSelected}
          loading={loadingInactive}
          danger
        >
          Inactive
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div> */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "rgba(0, 0, 0, 0.1)",
              headerBorderRadius: "4px",
              controlItemBgActiveHover: "rgba(0, 0, 0, 0.05)",
              controlItemBgActive: "rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <Table
          className="flexGrow_1"
          // rowSelection={rowSelection}
          loading={loadingTable}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: 336,
          }}
        />
        <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber, pageSize) => {
            onPageChange(pageNumber, pageSize);
          }}
          onPageSizeChange={(pageSize) => {
            onPageSizeChange(pageSize);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={commits.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
