import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const fetchDashboardData = (year = 2024) =>
  API.get(`/analytics/dashboard?year=${year}`);

export const fetchStudentList = () => API.get("/analytics/summary"); // Hoặc endpoint danh sách bạn tạo thêm
