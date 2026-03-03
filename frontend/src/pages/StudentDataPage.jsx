import React from "react";
import StudentTable from "../components/StudentTable";
import { Search, Filter, Download } from "lucide-react";

const StudentDataPage = () => {
  return (
    <div className="ml-64 p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Student Database</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search ID or Name..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <StudentTable />

        <div className="p-6 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1 to 10 of 20 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              Prev
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDataPage;
