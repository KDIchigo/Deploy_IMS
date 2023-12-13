import React from "react";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";

export const FilterProject = ({
  semesters,
  subjects,
  classes,
  projects,
  projectOpt,
  onFilter,
  loadingClass,
  classCode,
}) => {
  return (
    <>
      <div className="d-flex row">
        <div className="col-md-3 col-sm-6 px-3">
          <BaseSelectInput
            id="semester_id"
            type="setting"
            placeholder="Semester"
            defaultValue={
              semesters.length === 0 ? undefined : semesters[0].setting_value
            }
            options={semesters}
            isFilterBasic={true}
            onFilter={onFilter}
          />
        </div>
        <div className="col-md-3 col-sm-6 px-3">
          <BaseSelectInput
            id="subject_id"
            type="subject"
            placeholder="Subject Code"
            defaultValue={
              subjects.length === 0 ? undefined : subjects[0].subject_code
            }
            options={subjects}
            isFilterBasic={true}
            onFilter={onFilter}
            checked={
              subjects.length === 0 ? undefined : subjects[0].subject_code
            }
          />
        </div>
        <div className="col-md-3 col-sm-6 px-3">
          <BaseSelectInput
            id="class_id"
            type="class"
            loading={!loadingClass}
            placeholder="Class Code"
            defaultValue={
              classes.length === 0 ? undefined : classes[0].class_code
            }
            options={classes}
            isFilterBasic={true}
            onFilter={onFilter}
            checked={classCode}
          />
        </div>
        <div className="col-md-3 col-sm-6 px-3">
          <BaseSelectInput
            id="project_id"
            type="project"
            placeholder="Project Code"
            defaultValue={
              projects.length === 0 ? undefined : projects[0].project_code
            }
            options={projectOpt}
            isFilterBasic={true}
            onFilter={onFilter}
          />
        </div>
      </div>
    </>
  );
};
