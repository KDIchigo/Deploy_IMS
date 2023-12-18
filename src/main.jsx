import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app/store";
import { Role } from "./enum/Role";
import { Layout } from "./layout/Layout";
import { ClassDetailsGeneral } from "./pages/ClassDetailsPage/ClassDetailsGeneral";
import { ClassDetailsMilestone } from "./pages/ClassDetailsPage/ClassDetailsMilestone";
import { ClassDetailsPage } from "./pages/ClassDetailsPage/ClassDetailsPage";
import { ClassDetailsSettings } from "./pages/ClassDetailsPage/ClassDetailsSettings";
import { ClassDetailsStudents } from "./pages/ClassDetailsPage/ClassDetailsStudents";
import { ImportClassStudent } from "./pages/ClassDetailsPage/ClassStudents/ImportClassStudent/ImportClassStudent";
import { ClassListPage } from "./pages/ClassListPage/ClassListPage";
import { AccessDenied } from "./pages/ErrorPage/AccessDenied";
import { Error } from "./pages/ErrorPage/Error";
import { NotFound } from "./pages/ErrorPage/NotFound";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import { IssueDetailsPage } from "./pages/IssueDetailsPage/IssueDetailsPage";
import { FilterIssue } from "./pages/IssueListPage/FilterIssue/FilterIssue";
import { IssueListPage } from "./pages/IssueListPage/IssueListPage";
import { IssueNewPage } from "./pages/IssueNewPage/IssueNewPage";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import ProjectDashboard from "./pages/ProjectDashboard/ProjectDashboard";
import { ProjectDetailsMember } from "./pages/ProjectDetailsPage/ProjectDetailsMember";
import { ProjectDetailsMilestone } from "./pages/ProjectDetailsPage/ProjectDetailsMilestone";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage/ProjectDetailsPage";
import { ProjectDetailsSetting } from "./pages/ProjectDetailsPage/ProjectDetailsSetting";
import { ImportProject } from "./pages/ProjectListPage/ImportProject/ImportProject";
import { ProjectListPage } from "./pages/ProjectListPage/ProjectListPage";
import { SubjectDetailsAssignment } from "./pages/SubjectDetailsPage/SubjectDetailsAssignment";
import { SubjectDetailsGeneral } from "./pages/SubjectDetailsPage/SubjectDetailsGeneral";
import { SubjectDetailsSetting } from "./pages/SubjectDetailsPage/SubjectDetailsSetting";
import { SubjectListPage } from "./pages/SubjectListPage/SubjectListPage";
import SystemSettingListPage from "./pages/SystemSettingListPage/SystemSettingListPage";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import { UserListPage } from "./pages/UserListPage/UserListPage";
import YourComponent from "./pages/UserListPage/YourComponent";
import UserLoginPage from "./pages/UserLoginPage/UserLoginPage";
import { UserProfilePage } from "./pages/UserProfilePage/UserProfilePage";
import UserRegisterPage from "./pages/UserRegisterPage/UserRegisterPage";
import { AuthoRoutes } from "./routes/AuthoRoutes";
import { PrivateRoute } from "./routes/PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/sign-in" element={<UserLoginPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/error" element={<Error />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route index element={<LandingPage />} />
        {/* <Route path="/filter" element={<FilterIssue />} /> */}
        {/* <Route path="/demo" element={<YourComponent />} /> */}
        <Route path="/" element={<PrivateRoute />}>
          <Route
            path="/user-list"
            element={
              <AuthoRoutes element={<UserListPage />} listRole={[Role.Admin]} />
            }
          />
          <Route
            path="/subject-list"
            element={
              <AuthoRoutes
                element={<SubjectListPage />}
                listRole={[Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/subject-details/:subjectId"
            element={
              <AuthoRoutes
                element={<SubjectDetailsGeneral />}
                listRole={[Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/subject-details-general/:subjectId"
            element={
              <AuthoRoutes
                element={<SubjectDetailsGeneral />}
                listRole={[Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/subject-details-assignment/:subjectId"
            element={
              <AuthoRoutes
                element={<SubjectDetailsAssignment />}
                listRole={[Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/subject-details-setting/:subjectId"
            element={
              <AuthoRoutes
                element={<SubjectDetailsSetting />}
                listRole={[Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/class-list"
            element={
              <AuthoRoutes
                element={<ClassListPage />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/class-details/:classId"
            element={
              <AuthoRoutes
                element={<ClassDetailsPage />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/class-details-general/:classId"
            element={
              <AuthoRoutes
                element={<ClassDetailsGeneral />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/class-details-students/:classId"
            element={
              <AuthoRoutes
                element={<ClassDetailsStudents />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/class-details-milestones/:classId"
            element={
              <AuthoRoutes
                element={<ClassDetailsMilestone />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/class-details-settings/:classId"
            element={
              <AuthoRoutes
                element={<ClassDetailsSettings />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/class-import-student/:classId"
            element={
              <AuthoRoutes
                element={<ImportClassStudent />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/project-list"
            element={
              <AuthoRoutes
                element={<ProjectListPage />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/project-details/:projectId"
            element={
              <AuthoRoutes
                element={<ProjectDetailsPage />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/project-details-milestones/:projectId"
            element={
              <AuthoRoutes
                element={<ProjectDetailsMilestone />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/project-details-settings/:projectId"
            element={
              <AuthoRoutes
                element={<ProjectDetailsSetting />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/project-details-member/:projectId"
            element={
              <AuthoRoutes
                element={<ProjectDetailsMember />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/project-import-student/:classId"
            element={
              <AuthoRoutes
                element={<ImportProject />}
                listRole={[Role.Teacher, Role.Manager, Role.Admin]}
              />
            }
          />
          <Route
            path="/issue-list"
            element={
              <AuthoRoutes
                element={<IssueListPage />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/issue-list/:projectId/:issueTypeId"
            element={
              <AuthoRoutes
                element={<IssueListPage />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/new-issue/:projectId"
            element={
              <AuthoRoutes
                element={<IssueNewPage />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/new-issue/:projectId/:issueTypeId"
            element={
              <AuthoRoutes
                element={<IssueNewPage />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route
            path="/issue-details/:issueId/:projectId"
            element={
              <AuthoRoutes
                element={<IssueDetailsPage />}
                listRole={[
                  Role.Student,
                  Role.Teacher,
                  Role.Manager,
                  Role.Admin,
                ]}
              />
            }
          />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route
            path="/system-setting-list"
            element={
              <AuthoRoutes
                element={<SystemSettingListPage />}
                listRole={[Role.Admin]}
              />
            }
          />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route
            path="/project-dashboard/:projectId"
            element={<ProjectDashboard />}
          />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
