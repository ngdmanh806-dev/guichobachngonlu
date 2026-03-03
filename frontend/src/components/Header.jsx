import React from "react";
import { Search, Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Quick search..."
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <select className="text-xs border-none bg-transparent font-medium text-gray-500 focus:ring-0 cursor-pointer">
            <option>Year: 2024</option>
            <option>Year: 2023</option>
          </select>
        </div>
        <Bell
          size={20}
          className="text-gray-400 cursor-pointer hover:text-blue-600"
        />
        <div className="flex items-center gap-2 border-l pl-6">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            AD
          </div>
          <span className="text-sm font-semibold text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
