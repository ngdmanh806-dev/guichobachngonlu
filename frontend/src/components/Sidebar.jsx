import React from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  PieChart,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Student Data", path: "/students", icon: <Users size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
    { name: "Charts", path: "/charts", icon: <PieChart size={20} /> },
    { name: "Report", path: "/report", icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-8">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">
          Student Analytics
        </h1>
      </div>
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
