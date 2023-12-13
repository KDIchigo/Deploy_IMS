import {
  CaretDownOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseFilter } from "src/components/Base/BaseFilter/BaseFilter";
import { BaseSearchAll } from "src/components/Base/BaseSearch/BaseSearchAll";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavBarDashboard";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";
import {
  decodeParam,
  encodeParam,
  genDataStateParam,
} from "src/utils/handleEnDecode";
import {
  handlePageSizeChange,
  saveFilter,
  searchAllUtils,
} from "src/utils/handleSearchFilter";
import "./UserListPage.scss";
import { FilterUser } from "./components/FilterUser/FilterUser";
import { NewUser } from "./components/NewUser/NewUser";
import { UserTable } from "./components/UserTable/UserTable";
import { filterUtils, searchUtils } from "/src/utils/handleSearchFilter";
const searchUser = [
  {
    id: "fullname",
    value: "Fullname",
  },
  {
    id: "email",
    value: "Email",
  },
  {
    id: "phone_number",
    value: "Phone",
  },
];
const filter = {
  field: "",
  value: "",
  condition: ConditionEnum.Equal,
};

export const UserListPage = () => {
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const searchURLParams = new URLSearchParams(location.search);
  const param = searchURLParams.get("param");
  // const pageNumberURL = searchURLParams.get("pageNumber");
  // const pageSizeURL = searchURLParams.get("pageSize");
  // const sortStringURL = searchURLParams.get("sortString");
  // const filterConditionsJson = searchURLParams.get("filterConditions");
  // const filterConditions = filterConditionsJson
  //   ? JSON.parse(filterConditionsJson)
  //   : [];

  const [users, setUsers] = useState({
    totalRecord: 0,
    data: [],
    summary: "",
  });
  const [roles, setRoles] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkedSearchSelect, setCheckedSearchSelect] = useState(undefined);
  const [checkedSearchInput, setCheckedSearchInput] = useState(null);
  const [checkedSetting, setCheckedSetting] = useState(undefined);
  const [checkedStatus, setCheckedStatus] = useState(undefined);
  const [spin, setSpin] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSelectData, setLoadingSelectData] = useState(false);
  const dispatch = useDispatch();
  const [roleParams, setRoleParams] = useState([
    {
      field: "data_group",
      value: "1",
      condition: 1,
    },
    {
      field: "status",
      value: StatusEnum.Active,
      condition: ConditionEnum.Equal,
    },
  ]);
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: decodeParam(param) === null ? 1 : decodeParam(param).pageNumber,
  //   pageSize: decodeParam(param) === null ? 10 : decodeParam(param).pageSize,
  //   sortString:
  //     decodeParam(param) === null
  //       ? "created_date ASC"
  //       : decodeParam(param).sortString,
  //   filterConditions:
  //     decodeParam(param) === null ? [] : decodeParam(param).filterConditions,
  // });
  const [searchParams, setSearchParams] = useState(
    decodeParam(param) === null
      ? {
          pageNumber: 1,
          pageSize: 10,
          sortString: "created_date ASC",
          filterConditions: [],
        }
      : {
          pageNumber: decodeParam(param).pageNumber,
          pageSize: decodeParam(param).pageSize,
          sortString: decodeParam(param).sortString,
          filterConditions: decodeParam(param).filterConditions,
        }
  );
  // const [searchParams, setSearchParams] = useState({
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortString: "created_date ASC",
  //   filterConditions: [],
  // });
  // const searchParams = {
  //   pageNumber: 1,
  //   pageSize: 5,
  //   sortString: "",
  //   filterConditions: [],
  // };
  const fetchData = async (searchParams) => {
    const { data: userList } = await axiosClient.post(
      "/User/GetByPaging",
      searchParams
    );
    setUsers(userList);
    setLoading(false);
    setLoadingData(true);
    setLoadingTable(false);
  };

  const fetchDataSelect = async () => {
    const { data: roleArr } = await axiosClient.post(
      `/Setting/GetFilterData?sortString=display_order ASC`,
      roleParams
    );
    setRoles(roleArr);
    genDataStateParam(param, setCheckedSearchInput, "search", [], searchUser);
    genDataStateParam(param, setCheckedStatus, "status");
    genDataStateParam(param, setCheckedSetting, "role", roleArr);
    setLoadingSelectData(true);
  };

  const handleNewUser = async (values, toggle, formik) => {
    const { data, err } = await axiosClient.post(`/User`, values);
    if (err) {
      toast.error("Add fail!");
      return;
    } else {
      toast.success("Add Successful!");

      formik.resetForm();
      toggle();
      fetchData(searchParams);
    }
  };

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
      users,
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

  const onChangeSetting = (value) => {
    setCheckedSetting(value);
  };
  const onChangeStatus = (value) => {
    setCheckedStatus(value);
  };
  const onResetSearchSelect = (value) => {
    setCheckedSearchSelect(value);
  };

  const onResetSearchInput = (value) => {
    setCheckedSearchInput(value);
  };
  const onReset = () => {
    setLoadingTable(true);
    setLoading(true);
    const newSearchParams = {
      ...searchParams,
      filterConditions: [],
    };
    setSearchParams(newSearchParams);
    setCheckedSearchSelect(undefined);
    setCheckedSearchInput(null);
    setCheckedSetting(null);
    setCheckedStatus(null);
    setSearchParamsURL({ param: encodeParam(newSearchParams) });
    fetchData(newSearchParams);
  };

  // console.log(decodeParam(param))
  const fetchDataAndSelect = async () => {
    await Promise.all([fetchData(searchParams), fetchDataSelect()]);
  };
  useEffect(() => {
    // if (param !== null) {
    //   if (decodeParam(param).filterConditions.length !== 0) {
    //     if (
    //       decodeParam(param).filterConditions.filter(
    //         (ele) => ele.field === "status"
    //       )
    //     ) {
    //       setCheckedStatus(
    //         parseInt(decodeParam(param).filterConditions[0].value, 10) === StatusEnum.Active
    //           ? "Active"
    //           : "Inactive"
    //       );
    //     }
    //   }
    // }
    fetchDataAndSelect();
  }, []);

  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      <NavbarDashboard
        position="user"
        spin={loadingData && loadingSelectData}
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <h3 className="fw-bold m-0" style={{ paddingBottom: 20 }}>
                    User List
                  </h3>
                  {/* <MonthWeekSelectorDemo/> */}
                  <div className="row p-0 m-0 mb-4 align-items-center justify-content-between ">
                    <div className="col-lg-7 col-md-3 my-auto">
                      {/* {console.log(searchParams)} */}
                      {/* <BaseSearch
                        className="col-lg-9 col-md-8 p-0 m-0"
                        placeholderInput="Search here..."
                        placeholderSelect="Search by"
                        options={searchUser}
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
                            <div
                              className="cardDropdown"
                              style={{
                                zIndex: 1,
                              }}
                            >
                              <div className="card custom-card mb-0">
                                <div className="card-body filterCard">
                                  <FilterUser
                                    roles={roles}
                                    onFilter={onFilter}
                                    fetchData={fetchData}
                                    searchParams={searchParams}
                                    onReset={onReset}
                                    checkedStatus={checkedStatus}
                                    onChangeStatus={onChangeStatus}
                                    checkedSetting={checkedSetting}
                                    onChangeSetting={onChangeSetting}
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
                          options={searchUser}
                          onSearch={onSearchAll}
                          checkedSearchInput={checkedSearchInput}
                          onResetSearchInput={onResetSearchInput}
                        />
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-sm-0 mt-2 position-relative align-items-center float-end">
                      <NewUser roles={roles} handleNewUser={handleNewUser} />
                      <div className="col-lg-7 float-end me-4 mt-1  d-flex h-100 justify-content-end">
                        <Tooltip
                          title="Reset"
                          placement="top"
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
                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    className=" d-flex flex-column"
                  >
                    <UserTable
                      users={users}
                      roles={roles}
                      searchParams={searchParams}
                      onPageChange={onPageChange}
                      onPageSizeChange={onPageSizeChange}
                      fetchData={fetchData}
                      loadingTable={loadingTable}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};
