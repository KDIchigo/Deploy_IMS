import { SettingEnum, StatusEnum } from "src/enum/Enum";
const findDuplicates = (array1, array2, key1, key2) => {
  const duplicates = [];

  // Tạo một Map để lưu trữ giá trị của array2 dựa trên key2
  const mapArray2 = new Map(array2.map((item) => [item[key2], item]));

  // Lặp qua từng phần tử trong array1
  for (const item1 of array1) {
    const value1 = item1[key1];

    // Kiểm tra xem có giá trị tương ứng trong array2 không
    const item2 = mapArray2.get(value1);

    if (item2) {
      // Nếu tìm thấy sự trùng lặp, thêm dữ liệu của array1 vào mảng duplicates
      duplicates.push(item1);
    }
  }

  return duplicates;
};

const encodeParam = (originalData) => {
  //   localStorage.setItem(
  //     "filterParam",
  //     encodeURIComponent(JSON.stringify(originalData))
  //   );
  return encodeURIComponent(JSON.stringify(originalData));
};

const decodeParam = (param) => {
  return JSON.parse(decodeURIComponent(param));
};

const setLocalParam = (param) => {
  localStorage.setItem(
    "filterParam",
    encodeURIComponent(JSON.stringify(param))
  );
};

const getLocalParam = () => {
  return localStorage.getItem("filterParam");
};

const genDataStateParam = (param, setChecked, type, arr, searchArr) => {
  if (param !== null) {
    if (decodeParam(param).filterConditions.length !== 0) {
      if (
        decodeParam(param).filterConditions.filter((ele) => ele.field === "all")
          .length !== 0
      ) {
        setChecked(undefined);
      }
      switch (type) {
        case "status":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "status"
            ).length !== 0
          ) {
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Active && setChecked("Active");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Inactive && setChecked("Inactive");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Pending && setChecked("Pending");
          }
          break;
        case "status_started":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "status"
            ).length !== 0
          ) {
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Active && setChecked("Started");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Inactive && setChecked("Cancelled");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Pending && setChecked("Pending");
            console.log(decodeParam(param).filterConditions[0].value);
          }
          break;
        case "status_inProgress":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "status"
            ).length !== 0
          ) {
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Active && setChecked("In Progress");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Inactive && setChecked("Closed");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "status"
              )[0].value,
              10
            ) === StatusEnum.Pending && setChecked("Pending");
            console.log(decodeParam(param).filterConditions[0].value);
          }
          break;
        case "setting_group":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "data_group"
            ).length !== 0
          ) {
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "data_group"
              )[0].value,
              10
            ) === SettingEnum.Role && setChecked("Role");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "data_group"
              )[0].value,
              10
            ) === SettingEnum.Domain && setChecked("Domain");
            parseInt(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "data_group"
              )[0].value,
              10
            ) === SettingEnum.Semester && setChecked("Semester");
          }
          break;
        case "issue_setting":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "issue_group"
            ).length !== 0
          ) {
            const item = arr.filter(
              (ele) =>
                ele.value ===
                parseInt(
                  decodeParam(param).filterConditions.filter(
                    (ele) => ele.field === "issue_group"
                  )[0].value,
                  10
                )
            );
            setChecked(item[0].label);
          }
          break;
        case "role":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "setting_id"
            ).length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.setting_id === decodeParam(param).filterConditions[0].value
            );
            setChecked(arr[index].setting_value);
          }
          break;
        case "semester":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "semester_id"
            ).length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.setting_id ===
                decodeParam(param).filterConditions.filter(
                  (ele) => ele.field === "semester_id"
                )[0].value
            );
            setChecked(arr[index].setting_value);
            // console.log(arr)
            // console.log(decodeParam(param).filterConditions.filter(
            //   (ele) => ele.field === "semester_id"
            // ))
          }
          break;
        case "subject":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "subject_id"
            ).length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.subject_id ===
                decodeParam(param).filterConditions.filter(
                  (ele) => ele.field === "subject_id"
                )[0].value
            );
            setChecked(arr[index].subject_code);
          }
          break;
        case "teacher":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "teacher_id"
            ).length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.user_id ===
                decodeParam(param).filterConditions.filter(
                  (ele) => ele.field === "teacher_id"
                )[0].value
            );
            setChecked(arr[index].fullname);
          }
          break;
        case "assignee":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "assignee_id"
            ).length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.user_id ===
                decodeParam(param).filterConditions.filter(
                  (ele) => ele.field === "assignee_id"
                )[0].value
            );
            setChecked(arr[index].fullname);
          }
          break;
        case "from_date":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "from_date"
            ).length !== 0
          ) {
            setChecked(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "from_date"
              )[0].value
            );
          }
          break;
        case "to_date":
          if (
            decodeParam(param).filterConditions.filter(
              (ele) => ele.field === "to_date"
            ).length !== 0
          ) {
            setChecked(
              decodeParam(param).filterConditions.filter(
                (ele) => ele.field === "to_date"
              )[0].value
            );
          }
          break;
        case "search":
          if (
            findDuplicates(
              decodeParam(param).filterConditions,
              searchArr,
              "field",
              "id"
            ).length !== 0
          ) {
            // console.log(findDuplicates(
            //   decodeParam(param).filterConditions,
            //   searchArr,
            //   "field",
            //   "id"
            // )[0])
            setChecked(
              findDuplicates(
                decodeParam(param).filterConditions,
                searchArr,
                "field",
                "id"
              )[0].value
            );
          }

          break;
      }
    }
  }
};

const genFilterDataStateParam = (param, setChecked, type, arr, searchArr) => {
  if (param !== null && (type !== "from_date" && type !== "to_date")) {
    if (decodeParam(param).length !== 0) {
      if (
        decodeParam(param).filter((ele) => ele.field === "all").length !== 0
      ) {
        setChecked(undefined);
      }
      switch (type) {
        case "status":
          if (
            decodeParam(param).filter((ele) => ele.field === "status")
              .length !== 0
          ) {
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Active && setChecked("Active");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Inactive && setChecked("Inactive");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Pending && setChecked("Pending");
          }
          break;
        case "status_started":
          if (
            decodeParam(param).filter((ele) => ele.field === "status")
              .length !== 0
          ) {
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Active && setChecked("Started");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Inactive && setChecked("Cancelled");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Pending && setChecked("Pending");
            console.log(decodeParam(param)[0].value);
          }
          break;
        case "status_inProgress":
          if (
            decodeParam(param).filter((ele) => ele.field === "status")
              .length !== 0
          ) {
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Active && setChecked("In Progress");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Inactive && setChecked("Closed");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "status")[0]
                .value,
              10
            ) === StatusEnum.Pending && setChecked("Pending");
            console.log(decodeParam(param)[0].value);
          }
          break;
        case "setting_group":
          if (
            decodeParam(param).filter((ele) => ele.field === "data_group")
              .length !== 0
          ) {
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "data_group")[0]
                .value,
              10
            ) === SettingEnum.Role && setChecked("Role");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "data_group")[0]
                .value,
              10
            ) === SettingEnum.Domain && setChecked("Domain");
            parseInt(
              decodeParam(param).filter((ele) => ele.field === "data_group")[0]
                .value,
              10
            ) === SettingEnum.Semester && setChecked("Semester");
          }
          break;
        case "issue_setting":
          if (
            decodeParam(param).filter((ele) => ele.field === "issue_group")
              .length !== 0
          ) {
            const item = arr.filter(
              (ele) =>
                ele.value ===
                parseInt(
                  decodeParam(param).filter(
                    (ele) => ele.field === "issue_group"
                  )[0].value,
                  10
                )
            );
            setChecked(item[0].label);
          }
          break;
        case "role":
          if (
            decodeParam(param).filter((ele) => ele.field === "setting_id")
              .length !== 0
          ) {
            const index = arr.findIndex(
              (ele) => ele.setting_id === decodeParam(param)[0].value
            );
            setChecked(arr[index].setting_value);
          }
          break;
        case "semester":
          if (
            decodeParam(param).filter((ele) => ele.field === "semester_id")
              .length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.setting_id ===
                decodeParam(param).filter(
                  (ele) => ele.field === "semester_id"
                )[0].value
            );
            setChecked(arr[index].setting_value);
            // console.log(arr)
            // console.log(decodeParam(param).filterConditions.filter(
            //   (ele) => ele.field === "semester_id"
            // ))
          }
          break;
        case "subject":
          if (
            decodeParam(param).filter((ele) => ele.field === "subject_id")
              .length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.subject_id ===
                decodeParam(param).filter(
                  (ele) => ele.field === "subject_id"
                )[0].value
            );
            setChecked(arr[index].subject_code);
          }
          break;
        case "teacher":
          if (
            decodeParam(param).filter((ele) => ele.field === "teacher_id")
              .length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.user_id ===
                decodeParam(param).filter(
                  (ele) => ele.field === "teacher_id"
                )[0].value
            );
            setChecked(arr[index].fullname);
          }
          break;
        case "assignee":
          if (
            decodeParam(param).filter((ele) => ele.field === "assignee_id")
              .length !== 0
          ) {
            const index = arr.findIndex(
              (ele) =>
                ele.user_id ===
                decodeParam(param).filter(
                  (ele) => ele.field === "assignee_id"
                )[0].value
            );
            setChecked(arr[index].fullname);
          }
          break;
        case "from_date":
          if (decodeParam(param) !== null) {
            setChecked(decodeParam(param));
          }
          break;
        case "to_date":
          if (decodeParam(param) !== null) {
            setChecked(decodeParam(param));
          }
          break;
        case "search":
          if (
            findDuplicates(decodeParam(param), searchArr, "field", "id")
              .length !== 0
          ) {
            // console.log(findDuplicates(
            //   decodeParam(param).filterConditions,
            //   searchArr,
            //   "field",
            //   "id"
            // )[0])
            setChecked(
              findDuplicates(decodeParam(param), searchArr, "field", "id")[0]
                .value
            );
          }

          break;
      }
    }
  }
};

const genFilterDateDataStateParam = (param, setChecked, type, arr, searchArr) => {
  if (param !== null) {
    if (decodeParam(param).length !== 0) {
      switch (type) {
        case "from_date":
          if (decodeParam(param) !== null) {
            setChecked(decodeParam(param));
          }
          break;
        case "to_date":
          if (decodeParam(param) !== null) {
            setChecked(decodeParam(param));
          }
          break;
        case "search":
          if (
            findDuplicates(decodeParam(param), searchArr, "field", "id")
              .length !== 0
          ) {
            // console.log(findDuplicates(
            //   decodeParam(param).filterConditions,
            //   searchArr,
            //   "field",
            //   "id"
            // )[0])
            setChecked(
              findDuplicates(decodeParam(param), searchArr, "field", "id")[0]
                .value
            );
          }

          break;
      }
    }
  }
};
export {
  encodeParam,
  decodeParam,
  setLocalParam,
  getLocalParam,
  genDataStateParam,
  genFilterDataStateParam,
  genFilterDateDataStateParam,
};
