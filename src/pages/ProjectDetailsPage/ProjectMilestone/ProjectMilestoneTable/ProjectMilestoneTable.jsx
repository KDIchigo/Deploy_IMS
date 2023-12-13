import { ConfigProvider, Table, Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BasePagination } from "src/components/Base/BasePagination/BasePagination";
import { Status } from "src/pages/UserListPage/components/UserTable/Status/Status";
import { ProjectMilestoneAction } from "../ProjectMilestoneAction/ProjectMilestoneAction";
import { ClassStatus } from "src/components/Status/ClassStatus";
import "./ProjectMilestoneTable.scss";
const sortOptions = [
  { key: "asc", value: "Price ASC" },
  { key: "desc", value: "Price DESC" },
];
export const ProjectMilestoneTable = ({
  onPageChange,
  milestones,
  fetchData,
  searchParams,
  projectId,
  classMilestones,
}) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
  //   const handleChangeStatus = async (optionId, status) => {
  //     const userIdArr = [];
  //     userIdArr.push(optionId);
  //     swalWithBootstrapButtons
  //       .fire({
  //         title: "Are you sure?",
  //         text: `Are you sure to update Class Milestone Status?`,
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonText: "Yes, update it!",
  //         cancelButtonText: "No, cancel!",
  //         reverseButtons: true,
  //       })
  //       .then(async (result) => {
  //         if (result.isConfirmed) {
  //           const { data, err } = await axiosClient.post(
  //             `/Milestone/UpdateStatus?status=${status}`,
  //             userIdArr
  //           );
  //           if (err) {
  //             toast.error("Change status fail!");
  //             return;
  //           } else {
  //             toast.success("Change status successful!");
  //             fetchData(searchParams);
  //           }
  //         }
  //       });
  //   };

  //   const handleChange = (value, status) => {
  //     {
  //       status === 1 ? setLoadingActive(true) : setLoadingInactive(true);
  //     }
  //     // ajax request after empty completing
  //     setTimeout(() => {
  //       setSelectedRowKeys([]);
  //       {
  //         status === 1 ? setLoadingActive(false) : setLoadingInactive(false);
  //       }
  //       handleChangeStatus(value, status);
  //     }, 1000);
  //   };

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
  for (let index = 0; index < milestones.data.length; index++) {
    const milestone = milestones.data[index];
    let i = index + 1;
    data.push({
      key: milestone.milestone_id,
      order: (searchParams.pageNumber - 1) * searchParams.pageSize + i,
      milestone_name: milestone.milestone_name,
      from_date: handleToDDMMYYYY(milestone.from_date),
      to_date: handleToDDMMYYYY(milestone.to_date),
      description: milestone.description,
      status: <ClassStatus status={milestone.status} />,
      action: (
        <ProjectMilestoneAction
          optionId={milestone.milestone_id}
          option={milestone}
          milestone={milestone}
          fetchData={fetchData}
          searchParams={searchParams}
          projectId={projectId}
          classMilestones={classMilestones}
        />
      ),
      // enable: milestone.is_inherited ? false : milestone.enable || false,
    });
  }
  const rowClassName = (record) => {
    if (record.is_inherited) {
      return "ant-table-row-inherited";
    } else {
      return "";
    }
  };
  const columns = [
    {
      title: "#",
      dataIndex: "order",
      key: "order",
      width: "5%",
      fixed: "left",
      align: "center",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Milestone Name",
      dataIndex: "milestone_name",
      key: "milestone_name",
      width: "20%",
      sorter: (a, b) => a.milestone_name.length - b.milestone_name.length,
      render: (milestone_name) => (
        <Tooltip placement="topLeft" title={milestone_name}>
          {milestone_name}
        </Tooltip>
      ),
    },
    {
      title: "From Date",
      dataIndex: "from_date",
      key: "from_date",
      width: "15%",
      align: "center",
      sorter: (a, b) => a.from_date.length - b.from_date.length,
      render: (from_date) => (
        <Tooltip placement="topLeft" title={from_date}>
          {from_date}
        </Tooltip>
      ),
    },
    {
      title: "To Date",
      dataIndex: "to_date",
      key: "to_date",
      width: "15%",
      align: "center",
      sorter: (a, b) => a.to_date.length - b.to_date.length,
      render: (to_date) => (
        <Tooltip placement="topLeft" title={to_date}>
          {to_date}
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "25%",
      sorter: (a, b) => a.description.length - b.description.length,
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
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
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          rowClassName={rowClassName}
          bordered
          scroll={{
            x: 1180,
            y: 330,
          }}
        />
        <BasePagination
          pageNumber={searchParams.pageNumber}
          onPageChange={(pageNumber) => {
            // setSearchParams({ ...searchParams, pageNumber: pageIndex });
            // console.log(searchParams, pageIndex);
            onPageChange(pageNumber);
          }}
          pageSize={searchParams.pageSize}
          totalRecord={milestones.totalRecord}
        />
      </ConfigProvider>
    </div>
  );
};
