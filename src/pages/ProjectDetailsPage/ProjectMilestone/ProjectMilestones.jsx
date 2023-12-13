import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import {
  AsyncEnum,
  ConditionEnum,
  FilterOperatorEnum,
  InheritedEnum,
  StatusEnum,
} from "src/enum/Enum";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";

import { Tooltip } from "antd";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { FilterProjectMilestone } from "./FilterProjectMilestone/FilterProjectMilestone";
import { NewProjectMilestone } from "./NewProjectMilestone/NewProjectMilestone";
import { ProjectMilestoneTable } from "./ProjectMilestoneTable/ProjectMilestoneTable";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { toast } from "react-toastify";
import { ProjectMilestoneCollapse } from "./ProjectMilestoneCollapse/ProjectMilestoneCollapse";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { showErrorMessage } from "src/utils/HandleErrorMessage";
import moment from "moment";
import { decodeParam, encodeParam } from "src/utils/handleEnDecode";

export const ProjectMilestones = ({
  projectId,
  project,
  milestones,
  setMilestones,
  classMilestones,
  searchParams,
  setSearchParams,
  checkedFromDate,
  setCheckedFromDate,
  checkedToDate,
  setCheckedToDate,
  checkedStatus,
  setCheckedStatus,
  checkedSearchSelect,
  setCheckedSearchSelect,
  checkedSearchInput,
  setCheckedSearchInput,
  searchProjectMilestones,
  setSearchParamsURL,
  // fetchData,
}) => {
  console.log(milestones);
  console.log(searchParams);
  const [dropdown, setDropdown] = useState(false);
  // const [checkedFromDate, setCheckedFromDate] = useState(undefined);
  // const [checkedToDate, setCheckedToDate] = useState(undefined);
  // const [checkedStatus, setCheckedStatus] = useState();
  // const [classMilestones, setClassMilestones] = useState([]);
  // const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  // const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  // const [milestones, setMilestones] = useState({
  //   totalRecord: 0,
  //   data: [],
  //   summary: "",
  // });
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "from_date ASC",
  //   filterConditions: [
  //     {
  //       field: "project_id",
  //       value: projectId,
  //       condition: ConditionEnum.Equal,
  //     },
  //   ],
  // });
  // const [milestones, setMilestones] = useState([]);
  const ProjectFilter = {
    field: "project_id",
    value: projectId,
    condition: ConditionEnum.Equal,
  };
  // const [searchParams, setSearchParams] = useState([]);
  const onPageChange = (pageNumber, pageSize) => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    setSearchParams(newSearchParams);
    fetchData(newSearchParams);
  };

  const onPageSizeChange = (pageSize) => {
    handlePageSizeChange(
      setLoadingTable,
      searchParams,
      pageSize,
      milestones,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };

  const onReset = () => {
    const newSearchParams = [];
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(null);
    setCheckedSearchInput(null);
    setCheckedFromDate(undefined);
    setCheckedToDate(undefined);
    setCheckedStatus(null);
    fetchData(newSearchParams, true);
  };

  const onSearch = (filter) => {
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };
  const handleSaveFilter = () => {
    setLoadingTable(true);
    // console.log(searchParams)
    setSearchParamsURL({
      param: encodeParam(searchParams),
      from_date: encodeParam(checkedFromDate),
      to_date: encodeParam(checkedFromDate),
    });
    fetchData(searchParams);
  };

  const onFilter = (filter) => {
    setLoadingTable(true);
    const newSearchParams = searchParams.filter(
      (obj) => obj.field !== filter.field
    );
    if (filter.value !== "all") {
      newSearchParams.unshift(filter);
    }
    // console.log(filter.field);
    // const newSearchParams = {
    //   ...searchParams,
    //   filterConditions: filterConditions,
    // };
    // console.log(newSearchParams);
    setSearchParams(newSearchParams);
  };

  const onDateFilter = (filter) => {
    setLoadingTable(true);
    // const newSearchParams = searchParams.filter(
    //   (obj) => obj.field !== filter.field
    // );
    // if (filter.value !== "all") {
    //   newSearchParams.unshift(filter);
    // }

    // if (filter.field === "from_date") {
    //   setCheckedFromDate(filter);
    // } else if (filter.field === "to_date") {
    //   setCheckedToDate(filter);
    // }
    // setCheckedFromDate(filter)
    // const newSearchParams = {
    //   ...searchParams,
    //   filterConditions: filterConditions,
    // };
    console.log(filter);
    // setSearchParams(newSearchParams);
  };

  const onSearchAll = (filter, options) => {
    setLoadingTable(true);
    const newSearchParams = searchParams.filter(
      (obj) => obj.condition !== ConditionEnum.Like
    );
    if (options.length === 1) {
      newSearchParams.push({
        field: options[0].id,
        value: filter,
        condition: ConditionEnum.Like,
      });
    } else {
      options.map((ele, index) => {
        if (index === 0) {
          newSearchParams.push({
            field: ele.id,
            value: filter,
            condition: ConditionEnum.Like,
            operator: FilterOperatorEnum.OR,
            parenthesis: FilterOperatorEnum.OpenParenthesis,
          });
        }
        if (index > 0 && index < options.length - 1) {
          newSearchParams.push({
            field: ele.id,
            value: filter,
            condition: ConditionEnum.Like,
            operator: FilterOperatorEnum.OR,
          });
        }
        if (index === options.length - 1) {
          newSearchParams.push({
            field: ele.id,
            value: filter,
            condition: ConditionEnum.Like,
            parenthesis: FilterOperatorEnum.CloseParenthesis,
          });
        }
      });
    }
    // const newSearchParams = {
    //   ...searchParams,
    //   pageNumber: 1,
    //   filterConditions: filterConditions,
    // };
    setSearchParams(newSearchParams);
    // console.log(encodeParam(newSearchParams))
    // console.log(searchParams)
    // console.log(newSearchParams)
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const onChangeFromDate = (value) => {
    setCheckedFromDate(value);
  };
  const onChangeToDate = (value) => {
    setCheckedToDate(value);
  };
  const onChangeStatus = (value) => {
    setCheckedStatus(value);
  };
  const disabledFromDate = (current) => {
    // Disable dates that are before the selected "from" date
    if (checkedToDate === undefined) {
      return undefined;
    }
    return current && current >= moment(checkedToDate).startOf("day");
  };

  const disabledToDate = (current) => {
    // Disable dates that are before the selected "from" date
    if (checkedFromDate === undefined) {
      return undefined;
    }
    return current && current < moment(checkedFromDate).endOf("day");
  };
  const fetchData = async (searchParams, isReset) => {
    // const { data: milestoneArr } = await axiosClient.post(
    //   "/Milestone/GetByPaging",
    //   searchParams
    // );
    let filterDate = "";
    if (!isReset) {
      if (checkedFromDate !== undefined) {
        filterDate += `&from=${checkedFromDate}`;
      }
      if (checkedToDate !== undefined) {
        filterDate += `&to=${checkedToDate}`;
      }
    }

    const { data: milestoneArr } = await axiosClient.post(
      `/Milestone/GetProjectMilestone?class_id=${project.class_id}&project_id=${projectId}&sortString=created_date ASC${filterDate}`,
      searchParams
    );
    setMilestones(milestoneArr);
    setLoading(false);
    setLoadingTable(false);
  };
  // console.log(milestones);
  // const fetchDataSelect = async () => {
  //   const { data: milestoneArr } = await axiosClient.post(
  //     "/Milestone/GetFilterData?sortString=created_date ASC",
  //     [
  //       {
  //         field: "class_id",
  //         value: project.class_id,
  //         condition: ConditionEnum.Equal,
  //       },
  //       {
  //         field: "is_editable",
  //         value: 0,
  //         condition: ConditionEnum.Equal,
  //       },
  //       {
  //         field: "project_id",
  //         value: projectId,
  //         condition: ConditionEnum.Equal,
  //       },
  //       // {
  //       //   field: "is_customized",
  //       //   value: 1,
  //       //   condition: ConditionEnum.Equal,
  //       // },
  //     ]
  //   );
  //   setClassMilestones(milestoneArr);
  // };

  const handleMilestonesSynchronize = async (project) => {
    let convertId = project.project_convert_id;
    let bearToken = project.project_convert_token;
    let id = project.project_id;
    let action = AsyncEnum.AsyncProject;

    if (convertId !== null && bearToken !== null) {
      setLoadingTable(true);
      const { data, err } = await axiosClient.post(
        `/Milestone/AsyncMilestones?convertId=${convertId}&bearToken=${bearToken}&id=${id}&action=${action}`
      );
      if (err) {
        toast.error(`Synchronize milestone project fail!`);
        setLoadingTable(false);
        return;
      } else {
        toast.success(`Synchronize milestone project successfully!`);
        setLoadingTable(false);
        fetchData(searchParams);
      }
    } else {
      let toastErr = "";
      convertId === null && (toastErr = toastErr + "convert ID");
      convertId === null &&
        bearToken === null &&
        (toastErr = toastErr + " and ");
      bearToken === null && (toastErr = toastErr + "bearToken");
      toast.error(
        `Synchronize milestone project fail!!! Because the ${project.project_code} project does not have ${toastErr} yet.`
      );
      setLoadingTable(false);
    }
  };

  const handleMilestoneChangeStatus = async (
    optionId,
    status,
    setLoadingStatus,
    code
  ) => {
    const userIdArr = [];
    userIdArr.push(optionId);
    const statusLabel =
      status === 0
        ? "closed"
        : status === 1
        ? "in progress"
        : status === 2
        ? "pending"
        : "unknown";
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to ${statusLabel} ${code} milestone ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          if (status === StatusEnum.Inactive) {
            // Set loading status to true
            setLoadingStatus(0);
          } else if (status === StatusEnum.Pending) {
            setLoadingStatus(2);
          } else if (status === StatusEnum.Active) {
            setLoadingStatus(1);
          }
          const { data, err } = await axiosClient.post(
            `/Milestone/UpdateStatus?status=${status}`,
            userIdArr
          );

          if (err) {
            toast.error(`The ${code} milestone was ${statusLabel} fail`);
            setLoadingStatus(-1);
            return;
          } else {
            toast.success(
              `The ${code} milestone was ${statusLabel} successfully`
            );
            setLoadingStatus(-1);
            fetchData(searchParams);
          }
        }
      });
  };

  const handleMilestoneDelete = async (id, code, setLoadingData) => {
    const classStudentId = [];
    classStudentId.push(id);
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to delete the ${code} milestone ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { data, err } = axiosClient.delete("Milestone/DeleteMultiple", {
            data: classStudentId,
          });

          if (err) {
            // toast.error(`The ${code} milestone was deleted fail`);
            showErrorMessage(err);
            setLoadingData(false);
            return;
          }
          toast.success(`The ${code} milestone was deleted successfully`);
          setLoadingData(false);
          fetchData(searchParams);
        }
      });
    // console.log(classStudentId);
  };

  const handleMilestoneUpdate = async (
    values,
    setLoadingData,
    milestone,
    code,
    toggle
  ) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Are you sure to update the milestone named ${code}?`,
        icon: "warning",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Yes,update it!",
        cancelButtonText: "No, cancel!",
      })
      .then(async (result) => {
        // console.log(result);
        const newValues = { ...values, action: InheritedEnum.Project };
        if (result.isConfirmed) {
          setLoadingData(true);
          const { err } = await axiosClient.put(
            `/Milestone/${milestone.milestone_id}`,
            newValues
          );

          if (err) {
            // toast.error("Update fail!");
            showErrorMessage(err);
            setLoadingData(false);
          } else {
            toast.success(
              `The milestone named ${code} was updated successfully!`
            );
            setLoadingData(false);
            fetchData(searchParams);
          }
          toggle();

          // console.log("values", values);
        }
      });
  };

  // useEffect(() => {
  // fetchData(searchParams);
  // fetchDataSelect();
  // setMilestones(milestoneArr);
  // }, []);
  return (
    <>
      {/* {console.log(classMilestones)} */}
      {/* {console.log(project.class_id)} */}
      <Box className="box w-100 d-flex flex-column flexGrow_1 flex_height">
        {/* <div className="card custom-card mb-0 flexGrow_1">
            <div className="  card-body d-flex flex-column"> */}
        <div className="row">
          <div className="row p-0 m-0  mb-4 align-items-center justify-content-between ">
            <h3 className="fw-bold m-0 " style={{ paddingBottom: 20 }}>
              Milestone for Project {project.project_code}
            </h3>
            <div className="col-lg-7 col-md-3 my-auto">
              {/* <BaseSearch
                className="col-lg-9 col-md-8 p-0 m-0"
                placeholderInput="Search here..."
                placeholderSelect="Search by"
                options={searchProjectMilestones}
                onSearch={onSearch}
                checkedSearchSelect={checkedSearchSelect}
                onResetSearchSelect={onResetSearchSelect}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              /> */}
              <div className="d-flex p-0 m-0">
                <BaseFilter
                  className="me-1 p-0"
                  icon={
                    <BaseButton
                      value="Filter"
                      color="light"
                      nameTitle="btnFilter"
                      icon={<CaretDownOutlined />}
                    />
                  }
                  filterBody={
                    <div className="cardDropdown" style={{ zIndex: 1 }}>
                      <div className="card custom-card mb-0">
                        <div className="card-body filterCard">
                          <FilterProjectMilestone
                            projectId={projectId}
                            onFilter={onFilter}
                            onDateFilter={onDateFilter}
                            fetchData={fetchData}
                            searchParams={searchParams}
                            onReset={onReset}
                            checkedFromDate={checkedFromDate}
                            checkedToDate={checkedToDate}
                            checkedStatus={checkedStatus}
                            onChangeFromDate={onChangeFromDate}
                            onChangeToDate={onChangeToDate}
                            onChangeStatus={onChangeStatus}
                            disabledFromDate={disabledFromDate}
                            disabledToDate={disabledToDate}
                            handleSaveFilter={handleSaveFilter}
                          />
                        </div>
                      </div>
                    </div>
                  }
                />
                <BaseSearchAll
                  className="col-lg-7 p-0 m-0"
                  placeholderInput="Search here..."
                  options={searchProjectMilestones}
                  onSearch={onSearchAll}
                  checkedSearchSelect={checkedSearchSelect}
                  onResetSearchSelect={onResetSearchSelect}
                  checkedSearchInput={checkedSearchInput}
                  onResetSearchInput={onResetSearchInput}
                />
              </div>
            </div>
            <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 px-2 position-relative align-items-center float-end ">
              {/* <div
                    className=" align-items-center float-end "
                    style={{ marginRight: "10px" }}
                  > */}
              <NewProjectMilestone
                classMilestones={classMilestones}
                projectId={projectId}
                fetchData={fetchData}
                searchParams={searchParams}
                project={project}
              />
              {/* </div> */}
              <div className="col-lg-7 float-end me-4 mt-1 d-flex h-100 justify-content-end">
                <Tooltip
                  title="Reset"
                  placement="top"
                  color="#845adf"
                  size="large"
                >
                  {loading ? (
                    <LoadingOutlined
                      className="filterIcon me-4 mx-4 float-end"
                      disabled
                    />
                  ) : (
                    <ReloadOutlined
                      className="filterIcon me-4 mx-4 float-end"
                      onClick={() => {
                        setLoading(true);
                        onReset();
                      }}
                    />
                  )}
                </Tooltip>
                <div>
                  <BaseButton
                    nameTitle="float-start "
                    color="primary"
                    isIconLeft={true}
                    value="Sync"
                    icon={<SyncOutlined size={30} />}
                    onClick={() => handleMilestonesSynchronize(project)}
                  />
                </div>
                {/* <BaseFilter
                  icon={
                    <BaseButton
                      value="Filter"
                      color="light"
                      nameTitle="btnFilter"
                      icon={<CaretDownOutlined />}
                    />
                  }
                  filterBody={
                    <div className="cardDropdown" style={{ zIndex: 1 }}>
                      <div className="card custom-card mb-0">
                        <div className="card-body filterCard">
                          <FilterProjectMilestone
                            projectId={projectId}
                            onFilter={onFilter}
                            fetchData={fetchData}
                            searchParams={searchParams}
                            onReset={onReset}
                            checkedFromDate={checkedFromDate}
                            checkedToDate={checkedToDate}
                            checkedStatus={checkedStatus}
                            onChangeFromDate={onChangeFromDate}
                            onChangeToDate={onChangeToDate}
                            onChangeStatus={onChangeStatus}
                          />
                        </div>
                      </div>
                    </div>
                  }
                /> */}
              </div>
            </div>
          </div>
        </div>
        <Grid container className="m-0 flexGrow_1">
          <Grid item md={12} sm={12} xs={12} className=" d-flex flex-column">
            <ProjectMilestoneCollapse
              projectId={projectId}
              milestones={milestones}
              loading={loading}
              classMilestones={classMilestones}
              handleMilestoneChangeStatus={handleMilestoneChangeStatus}
              handleMilestoneDelete={handleMilestoneDelete}
              handleMilestoneUpdate={handleMilestoneUpdate}
            />
          </Grid>
        </Grid>
        {/* <ProjectMilestoneTable
              milestones={milestones}
              classMilestones={classMilestones}
              projectId={projectId}
              fetchData={fetchData}
              searchParams={searchParams}
              onPageChange={onPageChange}
            /> */}
        {/* </div>
          </div> */}
      </Box>
    </>
  );
};
