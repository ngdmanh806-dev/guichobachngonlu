import axios from "./axios";

export const api = {
  // Dữ liệu cho DashboardPage
  getUIDashboard: () => axios.get("/ui/dashboard"),

  // Dữ liệu biểu đồ cho ChartsPage/AnalyticsPage
  getUICharts: () => axios.get("/ui/charts"),

  // Dữ liệu nhận xét/phân tích
  getUIInsights: () => axios.get("/ui/insights"),

  // Danh sách sinh viên phân trang cho StudentTable
  getUIStudents: (page = 1, pageSize = 50, filters = {}) =>
    axios.get(`/ui/students`, {
      params: {
        page: page,
        pageSize: pageSize, // Khuyên Mạnh nên để 50-100 để web mượt hơn
        ...filters,
      },
    }),

  // API gốc nếu cần dữ liệu thô (Dùng template string cho đồng bộ)
  getRawAnalytics: (year = 2024) =>
    axios.get(`/analytics/dashboard`, { params: { year } }),
};
