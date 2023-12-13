import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select, Space } from "antd";
import { ConditionEnum } from "src/enum/Enum";
import { encodeParam } from "src/utils/handleEnDecode";
// const provinceData = ["Zhejiang", "Jiangsu"];
const { Option } = Select;

export const FilterDemo = ({
  semesters,
  subjects,
  classes,
  projects,
  onFilter,
  setIsSelectClass,
  onProjectFilter,
  onClassFilter,
  checkedSemester,
  checkedSubject,
  checkedClass,
  checkedProject,
  setSearchParamsURL,
}) => {
  // console.log(checkedSemester);
  // console.log(checkedSubject);
  // console.log(checkedClass);
  // console.log(checkedProject);
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
              projects: [
                {
                  project_id: "all",
                  project_code: "all",
                  group_name: "All",
                },
              ].concat(
                projects
                  .filter((project) => classItem.class_id === project.class_id)
                  .map((project) => {
                    // console.log(project, index)
                    return {
                      project_id: project.project_id,
                      project_code: project.project_code,
                      group_name: project.group_name,
                    };
                  })
              ),
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
  // console.log(provinceData);
  // console.log(dataSource);
  // console.log(subjects);
  const [semesterSelect, setSemesterSelect] = useState(
    checkedSemester === null ? dataSource[0] : checkedSemester
  );
  const [subjectSelect, setSubjectSelect] = useState(
    checkedSubject === null
      ? dataSource[0].classes.length === 0
        ? undefined
        : dataSource[0].classes[0].subjects.length === 0
        ? undefined
        : dataSource[0].classes[0].subjects[0]
      : checkedSubject
  );
  const [classSelect, setClassSelect] = useState(
    checkedClass === null
      ? dataSource[0].classes.length === 0
        ? undefined
        : dataSource[0].classes[0]
      : checkedClass
  );
  // console.log(dataSource[2].classes[0]);
  const [projectSelect, setProjectSelect] = useState(
    checkedProject === null
      ? dataSource[0].classes.length === 0
        ? undefined
        : dataSource[0].classes[0].projects.length === 0
        ? undefined
        : dataSource[0].classes[0].projects[0].project_code
      : checkedProject.project_code
  );
  const handleSemester = (value, obj) => {
    // console.log(obj);
    setSemesterSelect(dataSource[obj.index]);
    setSubjectSelect(
      dataSource[obj.index].classes.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].subjects.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].subjects[0]
    );
    // let { classes, ...semesterItem } = dataSource[obj.index];
    let semesterItem = dataSource[obj.index];
    let subjectItem =
      dataSource[obj.index].classes.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].subjects.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].subjects[0];
    let classItem =
      dataSource[obj.index].classes.length !== 0
        ? dataSource[obj.index].classes[0]
        : undefined;
    // if (classItem !== "") {
    //   let { projects, subjects, ...newClassItem } = classItem;
    //   classItem = { ...newClassItem };
    // }
    let projectItem =
      dataSource[obj.index].classes.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].projects.length === 0
        ? undefined
        : dataSource[obj.index].classes[0].projects[0];
    setSearchParamsURL({
      semester: encodeParam(semesterItem),
      subject: encodeParam(subjectItem),
      class: encodeParam(classItem),
      project: encodeParam(projectItem),
    });
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
    }, semesterItem, subjectItem, classItem, projectItem);
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
        : semesterSelect.classes[obj.index].subjects[0]
    );

    let semesterItem = semesterSelect;
    let subjectItem =
      semesterSelect.classes.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].subjects.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].subjects[0];
    let classItem = semesterSelect.classes[obj.index];
    console.log(semesterSelect.classes[obj.index])
    let projectItem =
      semesterSelect.classes.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].projects.length === 0
        ? undefined
        : semesterSelect.classes[obj.index].projects[0];

    setSearchParamsURL({
      semester: encodeParam(semesterItem),
      subject: encodeParam(subjectItem),
      class: encodeParam(classItem),
      project: encodeParam(projectItem),
    });

    onClassFilter({
      field: "class_id",
      value: obj.key,
      condition: ConditionEnum.Equal,
    }, semesterItem, subjectItem, classItem, projectItem);
    // console.log({
    //   field: "class_id",
    //   value: obj.key,
    //   condition: ConditionEnum.Equal,
    // });
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
    let semesterItem = semesterSelect;
    let subjectItem = subjectSelect;
    let classItem = classSelect;
    let projectItem =
      classSelect === undefined
        ? undefined
        : classSelect.projects.length === 0
        ? undefined
        : classSelect.projects[obj.index];

    setSearchParamsURL({
      semester: encodeParam(semesterItem),
      subject: encodeParam(subjectItem),
      class: encodeParam(classItem),
      project: encodeParam(projectItem),
    });
    onProjectFilter({
      field: "project_id",
      value: obj.key,
      condition: ConditionEnum.Equal,
    }, semesterItem, subjectItem, classItem, projectItem);
  };
  return (
    <>
      <div className="d-flex flex-row flexGrow_1">
        <div className="flexGrow_1 me-2">
          <Select
            showSearch
            defaultValue={semesterSelect.setting_value}
            className="selectProjectDesign"
            onChange={handleSemester}
            placeholder="Semester"
            // options={dataSource.map((data, index) => ({
            //   value: index,
            //   label: data.setting_value,
            //   id: data.setting_id,
            // }))}
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
        <div className="flexGrow_1 me-2">
          <Select
            showSearch
            className="selectProjectDesign disableSelect"
            value={
              subjectSelect === undefined
                ? undefined
                : subjectSelect.subject_code
            }
            placeholder="Subject Code"
            onChange={handleSubject}
            disabled
            // options={
            //   classSelect === undefined
            //     ? ""
            //     : classSelect.subjects.length !== 0
            //     ? classSelect.subjects.map((subject, index) => ({
            //         value: index,
            //         label: subject.subject_code,
            //         id: subject.subject_id,
            //       }))
            //     : undefined
            // }
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
        <div className="flexGrow_1 me-2">
          <Select
            showSearch
            className="selectProjectDesign"
            value={
              classSelect === undefined ? undefined : classSelect.class_code
            }
            placeholder="Class Code"
            onChange={handleClass}
            // options={
            //   semesterSelect.classes.length !== 0
            //     ? semesterSelect.classes.map((semester, index) => ({
            //         value: index,
            //         label: semester.class_code,
            //         id: semester.class_id,
            //       }))
            //     : undefined
            // }
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
        <div className="flexGrow_1 me-2">
          <Select
            showSearch
            className="selectProjectDesign"
            value={projectSelect === undefined ? undefined : projectSelect}
            placeholder="Project Code"
            onChange={handleProject}
            // options={
            //   classSelect === undefined
            //     ? ""
            //     : classSelect.projects.length !== 0
            //     ? classSelect.projects.map((project, index) => ({
            //         value: index,
            //         label: project.project_code,
            //         id: project.project_id,
            //       }))
            //     : undefined
            // }
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
                      : index === 0
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
