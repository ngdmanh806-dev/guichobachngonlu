import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Users,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Bảng điều khiển", path: "/", icon: LayoutDashboard }, // Dashboard là mặc định
    { name: "Biểu đồ thống kê", path: "/charts", icon: BarChart3 },
    { name: "Phân tích", path: "/analytics", icon: TrendingUp },
    { name: "Danh sách sinh viên", path: "/students", icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Analytics System
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">
          Welcome Admin
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase mb-2">
          Menu chính
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
