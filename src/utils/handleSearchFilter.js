import { ConditionEnum, FilterOperatorEnum } from "src/enum/Enum";
import { encodeParam } from "./handleEnDecode";

const searchUtils = (filter, searchParams, setSearchParams, fetchData) => {
  if (filter.field === "") {
    return;
  }
  // console.log(filter);
  // const objIndex = searchParams.filterConditions.findIndex(obj => obj.field === filter.field)
  const filterConditions = searchParams.filterConditions.filter(
    (obj) => obj.condition !== ConditionEnum.Like
  );
  filterConditions.push(filter);
  const newSearchParams = {
    ...searchParams,
    pageNumber: 1,
    filterConditions: filterConditions,
  };
  // console.log(newSearchParams);
  setSearchParams(newSearchParams);
  fetchData(newSearchParams);
};

const searchAllUtils = (
  filter,
  options,
  searchParams,
  setSearchParams,
  fetchData,
  setSearchParamsURL
) => {
  // if (filter === "") {
  //   return;
  // }
  // const objIndex = searchParams.filterConditions.findIndex(obj => obj.field === filter.field)
  const filterConditions = searchParams.filterConditions.filter(
    (obj) => obj.condition !== ConditionEnum.Like
  );
  if (options.length === 1) {
    filterConditions.push({
      field: options[0].id,
      value: filter,
      condition: ConditionEnum.Like,
    });
  } else {
    options.map((ele, index) => {
      if (index === 0) {
        filterConditions.push({
          field: ele.id,
          value: filter,
          condition: ConditionEnum.Like,
          operator: FilterOperatorEnum.OR,
          parenthesis: FilterOperatorEnum.OpenParenthesis,
        });
      }
      if (index > 0 && index < options.length - 1) {
        filterConditions.push({
          field: ele.id,
          value: filter,
          condition: ConditionEnum.Like,
          operator: FilterOperatorEnum.OR,
        });
      }
      if (index === options.length - 1) {
        filterConditions.push({
          field: ele.id,
          value: filter,
          condition: ConditionEnum.Like,
          parenthesis: FilterOperatorEnum.CloseParenthesis,
        });
      }
    });
  }
  const newSearchParams = {
    ...searchParams,
    pageNumber: 1,
    filterConditions: filterConditions,
  };
  setSearchParamsURL({param: encodeParam(newSearchParams)});
  setSearchParams(newSearchParams);
  fetchData(newSearchParams);
};

const filterUtils = (filter, searchParams, setSearchParams, fetchData) => {
  // console.log(searchParams);
  const filterConditions = searchParams.filterConditions.filter(
    (obj) => obj.field !== filter.field
  );
  if (filter.value !== "all") {
    filterConditions.unshift(filter);
  }
  // console.log(filter.field);
  const newSearchParams = {
    ...searchParams,
    filterConditions: filterConditions,
  };
  // console.log(newSearchParams);
  setSearchParams(newSearchParams);
  // fetchData(newSearchParams);
};

const saveFilter = (searchParams, setSearchParams, fetchData, setSearchParamsURL) => {
  const newSearchParams = { ...searchParams, pageNumber: 1 };
  setSearchParams(newSearchParams);
  // console.log(encodeURI(newSearchParams.filterConditions))
  // console.log(newSearchParams)
  setSearchParamsURL({param: encodeParam(newSearchParams)});
  fetchData(newSearchParams);
};

const filterBasicUtils = (filter, searchParams, setSearchParams, fetchData) => {
  // console.log(searchParams);
  let filterConditions = [];
  filterConditions = searchParams.filter((obj) => obj.field !== filter.field);
  if (filter.value !== "all") {
    filterConditions.push(filter);
  }
  // console.log(filter.field);
  const newSearchParams = [...filterConditions];
  setSearchParams(newSearchParams);
  // console.log(newSearchParams)
  fetchData(newSearchParams);
};

const handlePageSizeChange = (
  setLoadingTable,
  searchParams,
  pageSize,
  classes,
  setSearchParams,
  fetchData,
  setSearchParamsURL
) => {
  setLoadingTable(true);
  let pageNumber = searchParams.pageNumber;
  if (searchParams.pageNumber * pageSize > classes.totalRecord) {
    pageNumber = 1;
  }
  const newSearchParams = {
    ...searchParams,
    pageNumber: pageNumber,
    pageSize: pageSize,
  };
  setSearchParams(newSearchParams);
  const filterConditions = JSON.stringify(newSearchParams.filterConditions);
  // if (setSearchParamsURL !== undefined) {
  //   // console.log(filterConditions);
  //   // setSearchParamsURL("filterConditions", filterConditions);
  //   const queryString = qs.stringify(newSearchParams);
  //   setSearchParams(queryString, { method: 'replace' });
  // }
  // Set the 'myArray' query parameter in the URL
  setSearchParamsURL({ param: encodeParam(newSearchParams) });
  setSearchParams(newSearchParams);
  fetchData(newSearchParams);
};
export {
  searchUtils,
  searchAllUtils,
  filterUtils,
  saveFilter,
  filterBasicUtils,
  handlePageSizeChange,
};
