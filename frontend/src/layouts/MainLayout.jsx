import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar bên trái */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header trên cùng */}
        <Header />

        {/* Nội dung thay đổi theo Route */}
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
