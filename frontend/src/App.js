import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Import 4 trang từ thư mục pages của Mạnh
import DashboardPage from "./pages/DashboardPage";
import ChartsPage from "./pages/ChartsPage";
import InsightsPage from "./pages/InsightsPage";
import StudentsPage from "./pages/StudentsPage";

import { FilterProvider } from "./context/FilterContext";

function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* 1. Mặc định vào là DashboardPage */}
            <Route index element={<DashboardPage />} />

            {/* 2. Trang biểu đồ */}
            <Route path="charts" element={<ChartsPage />} />

            {/* 3. Trang phân tích AI */}
            <Route path="analytics" element={<InsightsPage />} />

            {/* 4. Trang danh sách sinh viên */}
            <Route path="students" element={<StudentsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FilterProvider>
  );
}

export default App;
