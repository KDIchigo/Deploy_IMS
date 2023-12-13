import {
  CaretDownOutlined,
  CloudSyncOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseSearch } from "src/components/Base/BaseSearch/BaseSearch";
import { AsyncEnum, ConditionEnum } from "src/enum/Enum";
import {
  filterUtils,
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
  searchUtils,
} from "src/utils/handleSearchFilter";
import { BaseButton } from "../Base/BaseButton/BaseButton";
import { BaseFilter } from "../Base/BaseFilter/BaseFilter";
import { FilterMilestone } from "./FilterMilestone/FilterMilestone";
import "./Milestone.scss";
import { MilestoneTable } from "./MilestoneTable/MilestoneTable";
import { NewMilestone } from "./NewMilestone/NewMilestone";
import { toast } from "react-toastify";
import { Tooltip } from "antd";
import { BaseSearchAll } from "../Base/BaseSearch/BaseSearchAll";
const searchClassMilestones = [
  {
    id: "milestone_name",
    value: "Milestone Name",
  },
];
export const Milestone = ({ id, typeMilestone, option }) => {
  const selectType = (typeMilestone) => {
    let field = "";
    switch (typeMilestone) {
      case "class":
        field = "class_id";
        break;
      case "project":
        field = "project_id";
        break;
      default:
        field = undefined;
        break;
    }
    return field;
  };

  const [checkedFromDate, setCheckedFromDate] = useState();
  const [loadingTable, setLoadingTable] = useState(false);
  const [checkedToDate, setCheckedToDate] = useState();
  const [checkedStatus, setCheckedStatus] = useState();
  const [classMilestones, setClassMilestones] = useState([]);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  let milestoneFilter = [];

  if (typeMilestone === "class") {
    milestoneFilter = [
      {
        field: "class_id",
        value: id,
        condition: ConditionEnum.Equal,
      },
      {
        field: "project_id",
        value: "",
        condition: ConditionEnum.IsNull,
      },
    ];
  }
  if (typeMilestone === "project") {
    milestoneFilter = [
      {
        field: "project_id",
        value: id,
        condition: ConditionEnum.Equal,
      },
    ];
  }
  const handleMilestonesSynchronize = async (option) => {
    let convertId = 0;
    let bearToken = "";
    let id = "";
    let action = 0;
    switch (typeMilestone) {
      case "class":
        convertId = option.class_convert_id;
        bearToken = option.class_convert_token;
        id = option.class_id;
        action = AsyncEnum.AsyncClass;
        break;
      case "project":
        convertId = option.project_convert_id;
        bearToken = option.project_convert_token;
        id = option.project_id;
        action = AsyncEnum.AsyncProject;
        break;
      default:
        convertId = 0;
        bearToken = "";
        id = "";
        action = 0;
        break;
    }

    if (convertId !== null && bearToken !== null) {
      setLoadingTable(true);
      const { data, err } = await axiosClient.post(
        `/Milestone/AsyncMilestones?convertId=${convertId}&bearToken=${bearToken}&id=${id}&action=${action}`
      );
      if (err) {
        toast.error(`Synchronize milestone ${typeMilestone} fail!`);
        setLoadingTable(false);
        return;
      } else {
        toast.success(`Synchronize milestone ${typeMilestone} successfully!`);
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
        `Synchronize milestone ${typeMilestone} fail!!! Because the ${option.project_code} project does not have ${toastErr} yet.`
      );
      setLoadingTable(false);
    }
  };
  const [searchParams, setSearchParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortString: "from_date ASC",
    filterConditions: milestoneFilter,
  });

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
      fetchData
    );
  };

  const onReset = () => {
    setLoadingTable(true);
    let newFilterCondition = [
      {
        field: selectType(typeMilestone),
        value: id,
        condition: ConditionEnum.Equal,
      },
    ];
    typeMilestone === "class" &&
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
    setCheckedFromDate(null);
    setCheckedToDate(null);
    setCheckedStatus(null);
    fetchData(newSearchParams);
  };

  const handleSaveFilter = () => {
    setLoadingTable(true);
    saveFilter(searchParams, setSearchParams, fetchData);
  };
  const onSearch = (filter) => {
    setLoadingTable(true);
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };
  const onSearchAll = (filter, options) => {
    setLoadingTable(true);
    searchAllUtils(filter, options, searchParams, setSearchParams, fetchData);
  };
  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
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

  const fetchData = async (searchParams) => {
    const { data: milestoneArr } = await axiosClient.post(
      "/Milestone/GetByPaging",
      searchParams
    );
    setMilestones(milestoneArr);
    setLoading(false);
    setLoadingTable(false);
  };
  const fetchDataSelect = async () => {
    const { data: milestoneArr } = await axiosClient.post(
      "/Milestone/GetFilterData?sortString=created_date ASC",
      [
        {
          field: "class_id",
          value: typeMilestone === "project" ? option.class_id : "",
          condition: ConditionEnum.Equal,
        },
        {
          field: "is_customized",
          value: 1,
          condition: ConditionEnum.Equal,
        },
        {
          field: "project_id",
          value: "",
          condition: ConditionEnum.IsNull,
        },
      ]
    );
    setClassMilestones(milestoneArr);
  };

  useEffect(() => {
    fetchData(searchParams);
    fetchDataSelect();
  }, []);
  return (
    <>
      <Box className="box w-100 d-flex flex-column flexGrow_1 flex_height">
        {/* <div className="card custom-card mb-0 flexGrow_1">
          <div className="  card-body d-flex flex-column"> */}
        <div className="row">
          <div className="row p-0 m-0  mb-4 align-items-center justify-content-between ">
            <h3 className="fw-bold m-0 " style={{ paddingBottom: 20 }}>
              Milestone for{" "}
              {typeMilestone === "class" ? " Class " + option.class_code : ""}
              {typeMilestone === "project"
                ? " Project " + option.project_code
                : ""}
            </h3>
            <div className="col-lg-7 col-md-3 my-auto">
              {/* <BaseSearch
                className="col-lg-9 col-md-8 p-0 m-0 me-2"
                placeholderInput="Search here..."
                placeholderSelect="Search by"
                options={searchClassMilestones}
                onSearch={onSearch}
                checkedSearchSelect={checkedSearchSelect}
                onResetSearchSelect={onResetSearchSelect}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              /> */}

              {/* <BaseButton
                nameTitle="float-start ms-2"
                type="button"
                value="Gitlab"
                color="purple"
                isIconLeft={true}
                icon={<CloudSyncOutlined size={10} />}
                  onClick={() =>
                    handleMilestonesSynchronize(
                      option,
                    )
                  }
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
                        <FilterMilestone
                          id={id}
                          typeMilestone={typeMilestone}
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
              {/* <div
                  className=" align-items-center float-end "
                  style={{ marginRight: "10px" }}
                > */}
              <NewMilestone
                id={id}
                typeMilestone={typeMilestone}
                selectType={selectType}
                fetchData={fetchData}
                option={option}
                searchParams={searchParams}
                classMilestones={classMilestones}
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
                {typeMilestone === "project" && (
                  // <Tooltip
                  //   title="Synchronize"
                  //   placement="top"
                  //   color="rgb(137, 32, 173)"
                  //   size="large"
                  // >
                  <div>
                    <BaseButton
                      nameTitle="float-start me-4"
                      color="primary"
                      isIconLeft={true}
                      value="Sync"
                      icon={<SyncOutlined size={30} />}
                      onClick={() => handleMilestonesSynchronize(option)}
                    />
                  </div>
                  // </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
        <Grid container className="m-0 flexGrow_1">
          <Grid item md={12} sm={12} xs={12} className=" d-flex flex-column">
            <MilestoneTable
              milestones={milestones}
              id={id}
              typeMilestone={typeMilestone}
              selectType={selectType}
              fetchData={fetchData}
              searchParams={searchParams}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              classMilestones={classMilestones}
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
