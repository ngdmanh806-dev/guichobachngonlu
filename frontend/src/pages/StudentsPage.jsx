import React, { useState } from "react";
import { useStudents } from "../hooks/useStudents";

const StudentsPage = () => {
  const { allData, loading } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // 1. LOGIC TÌM KIẾM TRÊN TOÀN BỘ 3000 NGƯỜI
  const filteredResults = allData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.includes(searchTerm),
  );

  // 2. LOGIC PHÂN TRANG TRÊN KẾT QUẢ ĐÃ LỌC
  const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItems = filteredResults.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi gõ tìm kiếm
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quản lý Sinh viên</h1>

      {/* Thanh tìm kiếm toàn cục */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Tìm tên bất kỳ trong toàn bộ 3,000 sinh viên..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-4 pl-12 border-2 border-blue-100 rounded-2xl focus:border-blue-500 outline-none shadow-lg transition-all"
        />
        <span className="absolute left-4 top-4 text-xl text-gray-400">🔍</span>
        {loading && (
          <span className="absolute right-4 top-4 text-sm text-blue-500 animate-pulse">
            Đang tải dữ liệu...
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-500">Mã SV</th>
              <th className="p-4 text-sm font-bold text-gray-500">Họ và Tên</th>
              <th className="p-4 text-sm font-bold text-gray-500">Ngành</th>
              <th className="p-4 text-sm font-bold text-gray-500">Điểm thi</th>
            </tr>
          </thead>
          <tbody>
            {loading && allData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-20 text-gray-400">
                  Đang tải dữ liệu hệ thống...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-blue-50/50 transition-colors border-b last:border-0"
                >
                  <td className="p-4 font-mono text-gray-400">#{student.id}</td>
                  <td className="p-4 font-bold text-slate-700">
                    {student.name}
                  </td>
                  <td className="p-4 text-slate-600">{student.major}</td>
                  <td className="p-4 font-bold text-blue-600">
                    {(student.gpa * 7.5).toFixed(1)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-20 text-gray-400 italic"
                >
                  Không tìm thấy sinh viên nào khớp với từ khóa.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bộ phân trang Google trên kết quả tìm kiếm */}
        {!loading && totalPages > 1 && (
          <div className="p-4 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Tìm thấy <b>{filteredResults.length}</b> kết quả
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-30"
              >
                Trước
              </button>
              <span className="px-4 py-2 font-bold text-blue-600">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-30"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
