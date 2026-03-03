import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage";
// Các trang khác bạn có thể tạo file trống trước để tránh lỗi import
const StudentDataPage = () => (
  <div className="p-8 ml-64">Student Data Content</div>
);
const AnalyticsPage = () => (
  <div className="p-8 ml-64">Analytics Insights Content</div>
);

function App() {
  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="mt-16">
            {" "}
            {/* Cách ra để không bị Header đè */}
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/students" element={<StudentDataPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
