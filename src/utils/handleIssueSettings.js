import { ConditionEnum, FilterOperatorEnum } from "src/enum/Enum";

export const HandleIssueSettings = () => {
// const handleSubjectIssueSetting =(subjectId)=>{
//    const filterConditions = [
//         {
//           field: "subject_id",
//           value: subjectId,
//           condition: ConditionEnum.Equal,
//         },
//       ];
//       return{
//         filterConditions
//       }
// }
const handleClassIssueSetting =(classId,classObj)=>{
    const filterConditions = [
        {
          field: "class_id",
          value: classId,
          condition: ConditionEnum.Equal,
          // operator: FilterOperatorEnum.OR,
          // parenthesis:FilterOperatorEnum.CloseParenthesis
        },
        // {
        //   field: "subject_id",
        //   value: classObj.subject_id,
        //   condition: ConditionEnum.Equal,
        //   operator: FilterOperatorEnum.AND,
        //   parenthesis:FilterOperatorEnum.CloseParenthesis
        // },
      ];
      return{
        filterConditions
      }
 }
const handleProjectIssueSetting =(projectId,project)=>{
    const filterConditions = [
        {
          field: "project_id",
          value: projectId,
          condition: ConditionEnum.Equal,
          operator: FilterOperatorEnum.OR,
          parenthesis:FilterOperatorEnum.OpenParenthesis
        
        },
        {
          field: "class_id",
          value: project.class_id,
          condition: ConditionEnum.Equal,
          // operator: FilterOperatorEnum.OR,
          parenthesis:FilterOperatorEnum.CloseParenthesis
        },
        // {
        //   field: "subject_id",
        //   value: project.subject_id,
        //   condition: ConditionEnum.Equal,
        //   operator: FilterOperatorEnum.AND,
        //   parenthesis:FilterOperatorEnum.CloseParenthesis     
        // },
      ];
      return{
        filterConditions
      }
 }
 return {
    // handleSubjectIssueSetting,
    handleClassIssueSetting,
    handleProjectIssueSetting
 }

}