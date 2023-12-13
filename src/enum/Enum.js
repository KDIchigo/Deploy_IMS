const ConditionEnum = {
  Equal: 1,
  NotEqual: 2,
  Like: 3,
  NotLike: 4,
  In: 5,
  NotIn: 6,
  IsNull: 7,
  IsNotNull: 8,
  StartsWith: 9,
  EndsWith: 10,
  IsTrue: 11,
  IsFalse: 12,
  GreaterOrEqual: 13,
  LessOrEqual: 14,
};

const FilterOperatorEnum = {
  AND: 0,
  OR: 1,
  OpenParenthesis: 2,
  CloseParenthesis: 3,
};

const StatusEnum = {
  Inactive: 0,
  Active: 1,
  Pending: 2,
};

const UserEnum = {
  Register: 1,
  Add: 2,
};

const SettingEnum = {
  Role: 1,
  Semester: 2,
  Domain: 3,
};

const IssueSettingEnum = {
  IssueType: 1,
  IssueStatus: 2,
  WorkProcess: 3,
  Others: 4,
};

const InheritedEnum = {
  Subject: 1,
  Class: 2,
  Project: 3,
};

const ImportStudentEnum = {
  ImportIntoClass: 5,
  ImportIntoProject: 6,
};

const IssueHistoryDataType = {
  due_date: 1,
  issue_type: 2,
  issue_status: 3,
  work_process: 4,
  issue_title: 5,
  description: 6,
  milestone_id: 7,
  assignee: 8,
  estimate_time: 9,
  actual_time: 10,
};

const AsyncEnum = {
  AsyncFollowGitlab: 1,
  AsyncFollowIms: 2,
  AsyncProject: 3,
  AsyncClass: 4,
};

const MilestoneActionEnum = {
  AddClassMilestone: 1,
  AddProjectMilestone: 2,
  UpdateClassMilestone: 3,
  UpdateProjectMilestone: 4,
  DeleteClassMilestone: 5,
  DeleteProjectMilestone: 6,
};

const StatusCodeEnum = {
  Success: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Error: 500,
  Reference: 1,
};

export {
  ConditionEnum,
  FilterOperatorEnum,
  StatusEnum,
  UserEnum,
  SettingEnum,
  IssueSettingEnum,
  InheritedEnum,
  ImportStudentEnum,
  IssueHistoryDataType,
  AsyncEnum,
  MilestoneActionEnum,
  StatusCodeEnum,
};
