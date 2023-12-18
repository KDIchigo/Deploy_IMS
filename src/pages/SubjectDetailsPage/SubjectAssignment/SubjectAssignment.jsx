import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
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
import { FilterAssignment } from "./FilterAssignment/FilterAssignment";
import { NewAssignment } from "./NewAssignment/NewAssignment";
import "./SubjectAssignment.scss";
import { SubjectAssignmentTable } from "./SubjectAssignmentTable/SubjectAssignmentTable";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { encodeParam } from "src/utils/handleEnDecode";

// const searchAssignment = [
//   {
//     id: "assignment_name",
//     value: "Assignment Name",
//   },
// ];
const filter = {
  field: "",
  value: "",
  condition: ConditionEnum.Equal,
};
export const SubjectAssignment = ({
  searchAssignment,
  subjectId,
  subjectObj,
  setLoadingSelect,
  checkedStatus,
  setCheckedStatus,
  checkedSearchInput,
  setCheckedSearchInput,
  assignments,
  setAssignments,
  searchParams,
  setSearchParams,
  setSearchParamsURL,
}) => {
  // const [assignments, setAssignments] = useState({
  //   totalRecord: 0,
  //   data: [],
  //   summary: "",
  // });
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "",
  //   filterConditions: [
  //     {
  //       field: "subject_id",
  //       value: subjectId,
  //       condition: ConditionEnum.Equal,
  //     },
  //   ],
  // });
  // console.log(subjectId);
  const fetchData = async (searchParams) => {
    const { data: assignmentArr } = await axiosClient.post(
      "Assignment/GetByPaging",
      searchParams
    );
    setAssignments(assignmentArr);
    // console.log(assignmentArr);
    setLoading(false);
    setLoadingTable(false);
  };
  // const fetchDataSelect = async () => {
  //   const { data: subjectArr } = await axiosClient.post(
  //     "/Subject/GetFilterData?sortString=order by created_date ASC",
  //     []
  //   );
  //   setSubjects(subjectArr);
  // };

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
      assignments,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };

  const handleSaveFilter = () => {
    setLoadingTable(true);
    saveFilter(searchParams, setSearchParams, fetchData, setSearchParamsURL);
  };

  const onSearch = (filter) => {
    setLoadingTable(true);
    searchUtils(filter, searchParams, setSearchParams, fetchData);
  };
  const onSearchAll = (filter, options) => {
    setLoadingTable(true);
    searchAllUtils(
      filter,
      options,
      searchParams,
      setSearchParams,
      fetchData,
      setSearchParamsURL
    );
  };

  const onFilter = (filter) => {
    filterUtils(filter, searchParams, setSearchParams, fetchData);
  };

  const onReset = () => {
    setLoadingTable(true);
    const newSearchParams = {
      ...searchParams,
      filterConditions: [
        {
          field: "subject_id",
          value: subjectId,
          condition: ConditionEnum.Equal,
        },
      ],
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setCheckedStatus(null);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const onChangeStatus = (value) => {
    setCheckedStatus(value);
  };

  // useEffect(() => {
  //   fetchData(searchParams);
  //   // fetchDataSelect();
  // }, []);
  return (
    <>
      {/* {console.log(subjectObj)} */}
      <Box className="box w-100 d-flex flex-column flexGrow_1 flex_height">
        {/* <div className="card custom-card mb-0 flexGrow_1">
          <div className="  card-body d-flex flex-column"> */}
        <div className="row">
          <div className="row p-0 m-0  mb-4 align-items-center justify-content-between ">
            <h3 className="fw-bold m-0 px-3" style={{ paddingBottom: 20 }}>
            Assignments for Subject {subjectObj.subject_code} 
            </h3>
            <div className="col-lg-7 col-md-3 my-auto">
              {/* <BaseSearch
                className="col-lg-9 col-md-8 p-0 m-0"
                placeholderInput="Search here..."
                placeholderSelect="Search by"
                options={searchAssignment}
                onSearch={onSearch}
                checkedSearchSelect={checkedSearchSelect}
                onResetSearchSelect={onResetSearchSelect}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              /> */}
            </div>
            <div className="d-flex col-lg-7 col-md-8 p-0 m-0">
              <BaseFilter
                className="me-1 p-0 ms-3"
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
                        <FilterAssignment
                          assignments={assignments}
                          onFilter={onFilter}
                          fetchData={fetchData}
                          searchParams={searchParams}
                          onReset={onReset}
                          checkedStatus={checkedStatus}
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
                options={searchAssignment}
                onSearch={onSearchAll}
                checkedSearchSelect={checkedSearchSelect}
                onResetSearchSelect={onResetSearchSelect}
                checkedSearchInput={checkedSearchInput}
                onResetSearchInput={onResetSearchInput}
              />
            </div>
            <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 px-2 position-relative d-flex align-items-center justify-content-end">
              {/* <div
                          className=" align-items-center float-end "
                          style={{ marginRight: "10px" }}
                        > */}
              {/* </div> */}
              <div className="col-lg-7 float-end d-flex h-100 justify-content-end">
                <Tooltip
                  title="Reset"
                  placement="topLeft"
                  color="#845adf"
                  size="large"
                >
                  {loading ? (
                    <LoadingOutlined
                      className="filterIcon me-4 float-end"
                      disabled
                    />
                  ) : (
                    <ReloadOutlined
                      className="filterIcon me-4 float-end"
                      onClick={() => {
                        setLoading(true);
                        onReset();
                      }}
                    />
                  )}
                </Tooltip>
              </div>
              <NewAssignment
                fetchData={fetchData}
                searchParams={searchParams}
                subjectId={subjectId}
                assignments={assignments}
              />
            </div>
          </div>
        </div>
        <Grid container className="m-0 flexGrow_1">
          <Grid item md={12} sm={12} xs={12} className=" d-flex flex-column">
            <SubjectAssignmentTable
              fetchData={fetchData}
              searchParams={searchParams}
              subjectId={subjectId}
              assignments={assignments}
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
