import { useState } from "react";
import { axiosClient } from "src/axios/AxiosClient";
import { SelectInputUser } from "src/components/Base/BaseSelectInput/SelectInputUser";
import { ConditionEnum, StatusEnum } from "src/enum/Enum";

const YourComponent = () => {
  const [users, setUsers] = useState([]);
  const [isCallUsers, setIsCallUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const onFilter = (field) => {
    console.log(field);
  };

  const fetchSelectData = async () => {
    if (!isCallUsers) {
      setLoading(true);
      const { data: roleArr } = await axiosClient.post(
        "/Setting/GetFilterData?sortString=display_order ASC",
        [
          {
            field: "setting_value",
            value: "Manager",
            condition: ConditionEnum.Equal,
          },
        ]
      );

      const { data: userArr } = await axiosClient.post(
        "/User/GetFilterData?sortString=created_date ASC",
        [
          {
            field: "setting_id",
            value: roleArr[0].setting_id,
            condition: ConditionEnum.Equal,
          },
          {
            field: "status",
            value: StatusEnum.Active,
            condition: ConditionEnum.Equal,
          },
        ]
      );
      setUsers(userArr);
      setLoading(false);
      setIsCallUsers(true);
    }
  };

  return (
    <SelectInputUser
      label="Subject Manager"
      id="assignee_id"
      loading={loading}
      loadingApi={loading}
      onClick={fetchSelectData}
      classNameDiv="col-11 mx-auto mt-3 p-0"
      placeholder="Subject Manager"
      options={users}
      // important="true"
      isFilter={true}
      onFilter={onFilter}
    />
  );
};
export default YourComponent;
