import React from "react";
import { Bell, UserCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* 1. Khối bên trái: Để trống hoặc chứa tiêu đề trang nếu Mạnh muốn */}
      <div className="flex-1">
        {/* Thanh Search đã được xóa theo yêu cầu trước đó của Mạnh */}
      </div>

      {/* 2. Khối bên phải: Chứa thông báo và Admin Profile */}
      <div className="flex items-center space-x-6">
        {/* Cụm Admin Profile */}
        <div className="flex items-center space-x-3 pl-6 border-l border-slate-100">
          <div className="text-right">
            <p className="text-xs text-slate-500 italic">Admin</p>
          </div>
          <div className="bg-slate-100 p-1 rounded-full">
            <UserCircle size={32} className="text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
