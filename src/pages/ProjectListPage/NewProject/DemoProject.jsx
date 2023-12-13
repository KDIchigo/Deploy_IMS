import { Select } from "antd";
import { useState } from "react";

const { Option } = Select;

export const DemoProject = ({ semesters, subjects, classes, projects }) => {
  console.log(semesters, subjects, classes, projects);
  const provinceData = [...semesters];
  const cityData = {
    Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou"],
    Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
  };
  const [cities, setCities] = useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);

  const handleProvinceChange = (value) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = (value) => {
    setSecondCity(value);
  };

  return (
    <div>
      <Select
        defaultValue={provinceData[0]}
        style={{ width: 120 }}
        onChange={handleProvinceChange}
      >
        {provinceData.map((province) => (
          <Option key={province}>{province}</Option>
        ))}
      </Select>
      <Select
        style={{ width: 120 }}
        value={secondCity}
        onChange={onSecondCityChange}
      >
        {cities.map((city) => (
          <Option key={city}>{city}</Option>
        ))}
      </Select>
    </div>
  );
};
