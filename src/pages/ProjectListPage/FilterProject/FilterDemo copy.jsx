import React, { useState } from "react";
import { Select, Space } from "antd";
// const provinceData = ["Zhejiang", "Jiangsu"];
const provinceData = [
  {
    name: "Zhejiang",
    city: [
      {
        name: "Hangzhou",
      },
      {
        name: "Ningbo",
      },
      {
        name: "Wenzhou",
      },
    ],
  },
  {
    name: "Jiangsu",
    city: [
      {
        name: "Nanjing",
      },
      {
        name: "Suzhou",
      },
      {
        name: "Zhenjiang",
      },
    ],
  },
];

const data = [];

export const FilterDemoCopy = ({ semesters, subjects, classes, projects }) => {
  //   const [cities, setCities] = useState(cityData[provinceData[0]].name);
  //   const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);
  const [selectFirst, setSelectFirst] = useState(provinceData[0].city);
  const [selectSecond, setSelectSecond] = useState(
    provinceData[0].city[0].name
  );

  const handleProvinceChange = (value, obj) => {
    setSelectFirst(provinceData[value].city);
    setSelectSecond(provinceData[value].city[0].name);
    console.log(provinceData[0].city[0]);
  };
  const onSecondCityChange = (value, obj) => {
    console.log(value, obj);
    setSelectSecond(selectFirst[value].name);
  };
  return (
    <Space wrap>
      <Select
        defaultValue={data[0].setting_value}
        style={{
          width: 120,
        }}
        onChange={handleProvinceChange}
        options={dataSource.map((province, index) => ({
          value: index,
          label: province.name,
        }))}
      />
      <Select
        style={{
          width: 120,
        }}
        value={selectSecond}
        onChange={onSecondCityChange}
        options={selectFirst.map((item, index) => ({
          value: index,
          label: item.name,
        }))}
      />
    </Space>
  );
};
