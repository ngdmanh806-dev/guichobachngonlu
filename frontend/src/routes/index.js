import DashboardPage from "../pages/DashboardPage";
import AnalyticsPage from "../pages/InsightsPage";
import StudentTable from "../pages/StudentsPage";

export const routes = [
  { path: "/", component: DashboardPage },
  { path: "/analytics", component: AnalyticsPage },
  { path: "/students", component: StudentTable },
];
