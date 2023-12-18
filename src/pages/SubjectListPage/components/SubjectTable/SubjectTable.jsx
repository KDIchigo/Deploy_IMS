import { ConfigProvider, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { useNavigate } from "react-router";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { BaseAction } from "src/components/Base/BaseAction/BaseAction";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";

const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const SubjectTable = ({
  users,
  subjects,
  searchParams,
  onPageChange,
  onPageSizeChange,
  fetchData,
  loadingTable,
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleChangeStatus = async (subjectId, status) => {
    const { data, err } = await axiosClient.post(
      `/Subject/UpdateStatus?status=${status}`,
      subjectId
    );
    if (err) {
      toast.error("Change status fail!");
      return;
    } else {
      toast.success("Change status Successful!");
      fetchData(searchParams);
    }
  };

  const handleChange = (value, status) => {
    {
      status === 1 ? setLoadingActive(true) : setLoadingInactive(true);
    }
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      {
        status === 1 ? setLoadingActive(false) : setLoadingInactive(false);
      }
      handleChangeStatus(value, status);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleDoubleClick = (subjectId) => {
    navigate(`/subject-details/${subjectId}`);
  };
  const hasSelected = selectedRowKeys.length > 0;

  const data = [];
  if (subjects.data.length !== 0) {
    for (let index = 0; index < subjects.data.length; index++) {
      const subject = subjects.data[index];
      let i = index + 1;
      data.push({
        key: subject.subject_id,
        order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
        subject_code: subject.subject_code,
        subject_name: subject.subject_name,
        assignee_name: subject.assignee_name,
        status: <Status status={subject.status} />,
        action: (
          <BaseAction
            optionId={subject.subject_id}
            option={subject}
            code={subject.subject_code}
            users={users}
            type="Subject"
            fetchData={fetchData}
            searchParams={searchParams}
            onClick={() => navigate(`/subject-details/${subject.subject_id}`)}
          />
        ),
      });
    }
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
      title: "Subject Code",
      dataIndex: "subject_code",
      key: "subject_code",
      ellipsis: true,
      width: "20%",
      sorter: (a, b) => a.subject_code.length - b.subject_code.length,
      render: (subject_code) => (
        <Tooltip placement="topLeft" title={subject_code}>
          {subject_code}
        </Tooltip>
      ),
    },
    {
      title: "Subject Name",
      dataIndex: "subject_name",
      key: "subject_name",
      width: "30%",
      ellipsis: true,
      sorter: (a, b) => a.subject_name.length - b.subject_name.length,
      render: (subject_name) => (
        <Tooltip placement="topLeft" title={subject_name}>
          {subject_name}
        </Tooltip>
      ),
    },
    {
      title: "Subject Manager",
      dataIndex: "assignee_name",
      key: "assignee_name",
      width: "30%",
      ellipsis: true,
      sorter: (a, b) => a.assignee_name - b.assignee_name,
      render: (assignee_name) => (
        <Tooltip placement="topLeft" title={assignee_name}>
          {assignee_name}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "10%",
      align: "center",
      fixed: "right",
      borderColor: "black",
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
              headerBg: "#edececd1",
              controlItemBgActiveHover: "rgba(0, 0, 0, 0.05)",
              controlItemBgActive: "rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <Table
          className="flexGrow_1"
          style={{ height: "50vh", overflow: "hidden" }}
          // rowSelection={rowSelection}
          loading={loadingTable}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          bordered
          scroll={{
            x: 1130,
            y: 362,
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleDoubleClick(record.key),
          })}
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
          totalRecord={subjects.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
