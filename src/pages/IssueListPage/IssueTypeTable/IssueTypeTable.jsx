import { Button, ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { IssueTypeAction } from "src/components/Base/BaseAction/IssueTypeAction";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { swalWithBootstrapButtons } from "src/enum/swal";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];

function handleToDDMMYYYY(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: Months are zero-based
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

  return formattedDate;
}

export const IssueTypeTable = ({
  searchParams,
  fetchData,
  onSearch,
  handleReset,
  loading,
  onPageChange,
  issues,
  students,
  issueType,
  milestones,
  isIssueAll,
  handleUpdateMultiple,
  projectId,
  issueSettings,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loadingActive, setLoadingActive] = useState([]);
  const [loadingInactive, setLoadingInactive] = useState([]);

  const handleChangeStatus = async (userId, status) => {
    const { data, err } = await axiosClient.post(
      `/User/UpdateStatus?status=${status}`,
      userId
    );
    if (err) {
      toast.error("Change status fail!");
      return;
    } else {
      toast.success("Change  status successfully!");
      fetchData(searchParams);
    }
  };
  // const handleUpdateMultiple = async () => {
  //   // window.alert("submit");
  //   swalWithBootstrapButtons
  //     .fire({
  //       title: "Are you sure?",
  //       text: "Are you sure to add new user?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, add it!",
  //       cancelButtonText: "No, cancel!",
  //       reverseButtons: true,
  //     })
  //     .then(async (result) => {
  //       if (result.isConfirmed) {
  //         const value = [];
  //         for (let select of selectedRowKeys) {
  //           value.push({ student_id: select, class_id: "1" });
  //         }
  //         console.log("value", value);
  //         // const { data, err } = await axiosClient.post(
  //         //   "/ClassStudent/InsertMultiple",
  //         //   value
  //         // );
  //         // if (err) {
  //         //   toast.error("Add fail!");
  //         //   return;
  //         // } else {
  //         //   toast.success("Add Successful!");
  //         //   swalWithBootstrapButtons.fire(
  //         //     "Updated!",
  //         //     "User has been added!.",
  //         //     "success"
  //         //   );
  //         //   fetchData(searchParams);
  //         //   fetchDataSubject(subjectsParams);
  //         //   toggle();
  //         // }
  //       } else {
  //         {
  //           swalWithBootstrapButtons.fire(
  //             "Cancelled",
  //             "Your imaginary file is safe :)",
  //             "error"
  //           );
  //         }
  //       }
  //     });
  // };
  // const handleChange = (value, status) => {
  //   {
  //     status === 1 ? setLoadingActive(true) : setLoadingInactive(true);
  //   }
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     {
  //       status === 1 ? setLoadingActive(false) : setLoadingInactive(false);
  //     }
  //     handleChangeStatus(value, status);
  //   }, 1000);
  // };

  // const start = () => {
  //   setLoading(true);
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
  //   }, 1000);
  // };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    isIssueAll ? handleUpdateMultiple(newSelectedRowKeys) : "";
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const data = [];
  for (let index = 0; index < issues.data.length; index++) {
    const issue = issues.data[index];
    let i = index + 1;
    isIssueAll
      ? data.push({
          key: JSON.stringify(issue),
          order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
          issue_title: issue.issue_title,
          work_process_value: issue.work_process_value,
          assignee_name: issue.assignee_name,
          milestone_name: issue.milestone_name,
          issue_type_value: issue.issue_type_value,
          due_date: handleToDDMMYYYY(issue.due_date),
          description: issue.description,
          // status: <Status status={issue_setting.status} />,
          status: issue.issue_status_value,
          action: (
            <IssueTypeAction
              fetchData={fetchData}
              searchParams={searchParams}
              optionId={issue.issue_id}
              // status={issue_setting.status}
              option={issue}
              issueType={issueType}
              students={students}
              issues={issues}
              milestones={milestones}
              issueSettings={issueSettings}
              projectId={projectId}
            />
          ),
        })
      : data.push({
          key: issue.issue_id,
          order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
          issue_title: issue.issue_title,
          work_process_value: issue.work_process_value,
          assignee_name: issue.assignee_name,
          milestone_name: issue.milestone_name,
          project_code: issue.project_code,
          due_date: handleToDDMMYYYY(issue.due_date),
          description: issue.description,
          // status: <Status status={issue_setting.status} />,
          status: issue.issue_status_value,
          action: (
            <IssueTypeAction
              fetchData={fetchData}
              searchParams={searchParams}
              optionId={issue.issue_id}
              // status={issue_setting.status}
              option={issue}
              issueType={issueType}
              students={students}
              issues={issues}
              milestones={milestones}
              issueSettings={issueSettings}
              projectId={projectId}
            />
          ),
        });
  }

  const columns = [
    {
      title: "#",
      dataIndex: "order",
      key: "order",
      width: "5%",
      fixed: "left",
      align: "center",
      ellipsis: true,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Issue Title",
      dataIndex: "issue_title",
      key: "issue_title",
      width: "20%",
      ellipsis: true,
      sorter: (a, b) => a.issue_title.length - b.issue_title.length,
      render: (issue_title) => (
        <Tooltip placement="top" title={issue_title}>
          {issue_title}
        </Tooltip>
      ),
    },
    {
      title: "Work Process",
      dataIndex: "work_process_value",
      key: "work_process_value",
      width: "10%",
      ellipsis: true,
      sorter: (a, b) =>
        a.work_process_value.length - b.work_process_value.length,
      render: (work_process_value) => (
        <Tooltip placement="top" title={work_process_value}>
          {work_process_value}
        </Tooltip>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee_name",
      key: "assignee_name",
      width: "13%",
      ellipsis: true,
      sorter: (a, b) => a.assignee_name.length - b.assignee_name.length,
      render: (assignee_name) => (
        <Tooltip placement="top" title={assignee_name}>
          {assignee_name}
        </Tooltip>
      ),
    },
    {
      title: "Milestone",
      dataIndex: "milestone_name",
      key: "milestone_name",
      align: "center",
      width: "10%",
      ellipsis: true,
      sorter: (a, b) => a.milestone_name.length - b.milestone_name.length,
      render: (milestone_name) => (
        <Tooltip placement="top" title={milestone_name}>
          {milestone_name}
        </Tooltip>
      ),
    },
    {
      title: isIssueAll ? "Issue Type" : "Project Code",
      dataIndex: isIssueAll ? "issue_type_value" : "project_code",
      key: isIssueAll ? "issue_type_value" : "project_code",
      width: "10%",
      ellipsis: true,
      sorter: (a, b) =>
        isIssueAll
          ? a.issue_type_value.length - b.issue_type_value.length
          : a.project_code.length - b.project_code.length,
      render: (value) => (
        <Tooltip placement="top" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      align: "center",
      width: "10%",
      ellipsis: true,
      sorter: (a, b) => a.due_date.length - b.due_date.length,
      render: (due_date) => (
        <Tooltip placement="top" title={due_date}>
          {due_date}
        </Tooltip>
      ),
    },
    {
      title: "Issue Status",
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
      {/* <div>
        <Button
          type="primary"
          onClick={() => handleUpdateMultiple(selectedRowKeys)}
          disabled={!hasSelected}
          loading={loading}
          style={{ borderRadius: "4px" }}
        >
          Add
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
          style={{ paddingTop: 20 }}
          rowSelection={rowSelection}
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
          onPageChange={(pageNumber) => {
            onPageChange(pageNumber);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={issues.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
