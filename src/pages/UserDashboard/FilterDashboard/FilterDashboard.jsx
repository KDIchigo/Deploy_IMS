import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select, Space } from "antd";
import { ConditionEnum } from "src/enum/Enum";
// const provinceData = ["Zhejiang", "Jiangsu"];
const { Option } = Select;

export const FilterDashboard = ({
  semesters,
  subjects,
  classes,
  projects,
  onFilter,
  setIsSelectClass,
  onProjectFilter,
  onClassFilter,
}) => {
  const dataSource = [];
  const handleDataSource = () => {
    semesters.map((semester) =>
      dataSource.push({
        setting_id: semester.setting_id,
        setting_value: semester.setting_value,
        classes: classes
          .filter((classItem) => semester.setting_id === classItem.semester_id)
          .map((classItem) => {
            return {
              class_id: classItem.class_id,
              class_code: classItem.class_code,
              projects: projects
                .filter((project) => classItem.class_id === project.class_id)
                .map((project) => {
                  // console.log(project, index)
                  return {
                    project_id: project.project_id,
                    project_code: project.project_code,
                    group_name: project.group_name,
                  };
                }),
              subjects: subjects
                .filter(
                  (subject) => classItem.subject_id === subject.subject_id
                )
                .map((subject) => {
                  return {
                    subject_id: subject.subject_id,
                    subject_code: subject.subject_code,
                  };
                }),
            };
          }),
      })
    );
  };
  handleDataSource();
  const empty = `undefined (undefined)`;
  // console.log(provinceData);
  // console.log(dataSource);
  // console.log(subjects);
  const [semesterSelect, setSemesterSelect] = useState(dataSource[0]);
  const [subjectSelect, setSubjectSelect] = useState(
    dataSource[0].classes.length === 0
      ? undefined
      : dataSource[0].classes[0].subjects.length === 0
      ? undefined
      : dataSource[0].classes[0].subjects[0].subject_code
  );
  const [classSelect, setClassSelect] = useState(
    dataSource[0].classes.length === 0 ? undefined : dataSource[0].classes[0]
  );
  // console.log(dataSource[2].classes[0]);
  const [projectSelect, setProjectSelect] = useState(
    dataSource[0].classes.length === 0
      ? undefined
      : dataSource[0].classes[0].projects.length === 0
      ? undefined
      : dataSource[0].classes[0].projects[0].project_code
  );
  const handleSemester = (value, obj) => {
    // console.log(obj);
    setSemesterSelect(dataSource[obj.index]);
    setSubjectSelect(
      dataSource[obj.index].classes.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].subjects.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].subjects[0].subject_code
    );
    setClassSelect(
      dataSource[obj.index].classes.length !== 0
        ? dataSource[obj.index].classes[0]
        : undefined
    );
    setProjectSelect(
      dataSource[obj.index].classes.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].projects.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].projects[0].project_code
    );
    onFilter({
      field: "class_id",
      value:
        dataSource[obj.index].classes.length === 0
          ? undefined
          : dataSource[obj.index].classes[0].class_id,
      condition: ConditionEnum.Equal,
    });
    // console.log(
    //   dataSource[value].classes.length === 0
    //     ? undefined
    //     : dataSource[value].classes[0].class_id
    // );
    setIsSelectClass(true);
  };

  const handleSubject = (value, obj) => {
    // console.log(obj);
    setSubjectSelect(
      classSelect === undefined
        ? undefined
        : classSelect.subjects.length === 0
        ? undefined
        : classSelect.subjects[obj.index].subject_code
    );

    // setSubjectSelect(semesterSelect.subjects[value].subject_code);
    // setClassSelect(
    //   dataSource[value].classes.length !== 0
    //     ? dataSource[value].classes[0]
    //     : undefined
    // );
    setIsSelectClass(false);
  };

  const handleClass = (value, obj) => {
    // console.log(
    //   semesterSelect.classes.length === 0
    //     ? undefined
    //     : semesterSelect.classes[value].projects.length === 0
    //     ? undefined
    //     : semesterSelect.classes[value].projects[0].project_code
    // );
    setClassSelect(semesterSelect.classes[obj.index]);
    setProjectSelect(
      semesterSelect.classes.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].projects.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].projects[0].project_code
    );
    setSubjectSelect(
      semesterSelect.classes.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].subjects.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].subjects[0].subject_code
    );
    onClassFilter({
      field: "class_id",
      value: obj.key,
      condition: ConditionEnum.Equal,
    });
    console.log({
      field: "class_id",
      value: obj.key,
      condition: ConditionEnum.Equal,
    });
    setIsSelectClass(true);
    // console.log({
    //   field: "class_id",
    //   value: obj.id,
    //   condition: ConditionEnum.Equal,
    // })
  };
  const handleProject = (value, obj) => {
    setProjectSelect(
      classSelect === undefined
        ? undefined
        : classSelect.projects.length === 0
        ? undefined
        : classSelect.projects[obj.index].project_code
    );
    onProjectFilter({
      field: "project_id",
      value: obj.key,
      condition: ConditionEnum.Equal,
    });
  };
  return (
    <>
      <div className="mb-3 row">
        <div className="col-6">
          <Select
            showSearch
            defaultValue={dataSource[0].setting_value}
            className="selectProjectDesign"
            onChange={handleSemester}
            placeholder="Semester"
          >
            {dataSource.map((data, index) => (
              <Option
                key={data.setting_id}
                index={index}
                value={data.setting_value}
              >
                {data.setting_value}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-6">
          <Select
            showSearch
            className="selectProjectDesign disableSelect"
            value={subjectSelect === undefined ? undefined : subjectSelect}
            placeholder="Subject Code"
            onChange={handleSubject}
            disabled
          >
            {classSelect === undefined
              ? ""
              : classSelect.subjects.length !== 0
              ? classSelect.subjects.map((subject, index) => (
                  <Option
                    key={subject.subject_id}
                    index={index}
                    value={subject.subject_code}
                  >
                    {subject.subject_code}
                  </Option>
                ))
              : undefined}
          </Select>
        </div>
        <div className="col-6 mt-4">
          <Select
            showSearch
            className="selectProjectDesign"
            value={
              classSelect === undefined ? undefined : classSelect.class_code
            }
            placeholder="Class Code"
            onChange={handleClass}
          >
            {semesterSelect.classes.length !== 0
              ? semesterSelect.classes.map((semester, index) => (
                  <Option
                    key={semester.class_id}
                    index={index}
                    value={semester.class_code}
                  >
                    {semester.class_code}
                  </Option>
                ))
              : undefined}
          </Select>
        </div>
        <div className="col-6 mt-4">
          <Select
            showSearch
            className="selectProjectDesign"
            value={projectSelect === empty ? undefined : projectSelect}
            placeholder="Project Code"
            onChange={handleProject}
          >
            {classSelect === undefined
              ? ""
              : classSelect.projects.length !== 0
              ? classSelect.projects.map((project, index) => (
                  <Option
                    key={project.project_id}
                    index={index}
                    value={project.project_code}
                  >
                    {project.group_name}
                    {project.project_code === ""
                      ? ""
                      : ` (${project.project_code})`}
                  </Option>
                ))
              : undefined}
          </Select>
        </div>
      </div>
    </>
  );
};
