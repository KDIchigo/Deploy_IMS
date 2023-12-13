import {
  CaretDownOutlined,
  FilterOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { ConditionEnum } from "src/enum/Enum";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import "./ClassMilestones.scss";
import { FilterClassMilestone } from "./FilterClassMilestone/FilterClassMilestone";
import { NewClassMilestone } from "./NewClassMilestone/NewClassMilestone";
import { ClassMilestoneTable } from "./ClassMilestoneTable/ClassMilestoneTable";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { Tooltip } from "antd";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import moment from "moment";
import { encodeParam } from "src/utils/handleEnDecode";
const searchClassMilestones = [
  {
    id: "milestone_name",
    value: "Milestone Name",
  },
];
export const ClassMilestones = ({
  classId,
  classObj,
  milestones,
  setMilestones,
  setSearchParamsURL,
  searchClassMilestones,
  checkedSearchInput,
  setCheckedSearchInput,
  checkedSearchSelect,
  setCheckedSearchSelect,
  checkedFromDate,
  setCheckedFromDate,
  checkedToDate,
  setCheckedToDate,
  checkedStatus,
  setCheckedStatus,
  searchParams,
  setSearchParams,
}) => {
  const [loadingTable, setLoadingTable] = useState(false);
  // const [checkedFromDate, setCheckedFromDate] = useState(undefined);
  // const [checkedSearchSelect, setCheckedSearchSelect] = useState(null);
  // const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [milestones, setMilestones] = useState({
  //   totalRecord: 0,
  //   data: [],
  //   summary: "",
  // });

  const classFilter = [
    {
      field: "class_id",
      value: classId,
      condition: ConditionEnum.Equal,
    },
    {
      field: "project_id",
      value: "",
      condition: ConditionEnum.IsNull,
    },
  ];

  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "created_date ASC",
  //   filterConditions: classFilter,
  // });
  const onPageChange = (pageNumber, pageSize) => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    setSearchParams(newSearchParams);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
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
    setLoadingTable(true);
    let newFilterCondition = [
      {
        field: "class_id",
        value: classId,
        condition: ConditionEnum.Equal,
      },
    ];
    newFilterCondition.push({
      field: "project_id",
      value: "",
      condition: ConditionEnum.IsNull,
    });
    const newSearchParams = {
      ...searchParams,
      filterConditions: newFilterCondition,
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setCheckedFromDate(undefined);
    setCheckedToDate(undefined);
    setCheckedStatus(null);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  const onSearch = (filter) => {
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const handleSaveFilter = () => {
    setLoadingTable(true);
    saveFilter(searchParams, setSearchParams, fetchData,
      setSearchParamsURL);
  };

  const onSearchAll = (filter, options) => {
    setLoadingTable(true);
    searchAllUtils(filter, options, searchParams, setSearchParams, fetchData,
      setSearchParamsURL);
  };
  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
  };
  const onDateFilter = (filter) => {
    // setLoadingTable(true);
    console.log(filter);
    let newFilter = { ...filter };
    const filterConditions = searchParams.filterConditions.filter(
      (obj) => obj.field !== filter.field
    );
    if (filter.field === "from_date") {
      newFilter = { ...filter, condition: ConditionEnum.GreaterOrEqual };
    }
    if (filter.field === "to_date") {
      newFilter = { ...filter, condition: ConditionEnum.LessOrEqual };
    }
    if (filter.value !== "all") {
      filterConditions.unshift(newFilter);
    }
    // console.log(filter.field);
    const newSearchParams = {
      ...searchParams,
      filterConditions: filterConditions,
    };
    // console.log(newSearchParams);
    setSearchParams(newSearchParams);
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
  const fetchData = async (searchParams) => {
    const { data: milestoneArr } = await axiosClient.post(
      "/Milestone/GetClassMilestone?sortString=created_date ASC",
      searchParams
    );
    setMilestones(milestoneArr);
    setLoading(false);
    setLoadingTable(false);
  };

  // useEffect(() => {
  //   fetchData(searchParams);
  //   setMilestones(milestoneArr)
  // }, []);
  return (
    <>
      <Box className="box w-100 d-flex flex-column flexGrow_1 flex_height">
        {/* <div className="card custom-card mb-0 flexGrow_1">
          <div className="  card-body d-flex flex-column"> */}
        <div className="row">
          <div className="row p-0 m-0  mb-4 align-items-center justify-content-between ">
            <h3 className="fw-bold m-0 " style={{ paddingBottom: 20 }}>
              Milestone for {classObj.class_code}
            </h3>
            <div className="col-lg-7 col-md-3 my-auto">
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
                          <FilterClassMilestone
                            classId={classId}
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
                  options={searchClassMilestones}
                  onSearch={onSearchAll}
                  checkedSearchSelect={checkedSearchSelect}
                  onResetSearchSelect={onResetSearchSelect}
                  checkedSearchInput={checkedSearchInput}
                  onResetSearchInput={onResetSearchInput}
                />
              </div>
            </div>
            <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 px-2 position-relative align-items-center float-end ">
              <NewClassMilestone
                classId={classId}
                classObj={classObj}
                fetchData={fetchData}
                searchParams={searchParams}
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
              </div>
            </div>
          </div>
        </div>
        <Grid container className="m-0 flexGrow_1">
          <Grid item md={12} sm={12} xs={12} className=" d-flex flex-column">
            <ClassMilestoneTable
              milestones={milestones}
              classId={classId}
              fetchData={fetchData}
              searchParams={searchParams}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              loadingTable={loadingTable}
            />
          </Grid>
        </Grid>
        {/* </div>
        </div> */}
      </Box>
    </>
  );
};
