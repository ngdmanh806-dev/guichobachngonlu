import React from "react";
import useInsights from "../hooks/useInsights";
import { Globe, TrendingUp } from "lucide-react";

const InsightsPage = () => {
  const { insights, stats, loading, error } = useInsights();

  if (loading)
    return (
      <div className="p-8 text-center text-blue-600 animate-pulse font-medium">
        Đang chạy phân tích dữ liệu tuyển sinh...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-red-500 text-center font-medium">{error}</div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Báo Cáo Phân Tích</h1>
      </div>

      {/* --- KPI CARDS (Mỗi card chiếm 1/2 dòng trên màn hình lớn) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card IELTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-6">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
            <Globe size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Tỉ lệ Sinh viên có IELTS
            </p>
            <h3 className="text-3xl font-black text-indigo-700">
              {stats?.ielts_rate || 0}%
            </h3>
            <p className="text-xs text-indigo-400 mt-1 italic">
              Mức độ hội nhập quốc tế
            </p>
          </div>
        </div>

        {/* Card HSA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-6">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Tỉ lệ Sinh viên trúng tuyển HSA, TSA
            </p>
            <h3 className="text-3xl font-black text-emerald-700">
              {stats?.hsa_admission_rate || 0}%
            </h3>
            <p className="text-xs text-emerald-400 mt-1 italic">
              Năng lực tư duy logic
            </p>
          </div>
        </div>
      </div>

      {/* --- PHẦN VĂN BẢN NHẬN XÉT --- */}
      <div className="grid grid-cols-1 gap-6">
        {/* Hiệu suất ngành */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-500">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg mr-4 text-2xl">🏆</div>
            <h2 className="text-xl font-bold text-gray-700">
              Phân Tích Hiệu Suất Ngành
            </h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed italic px-4">
            "{insights?.performanceAnalysis?.replace("Class ", "Ngành ")}"
          </p>
        </div>

        {/* Tương quan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-500">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg mr-4 text-2xl">📈</div>
            <h2 className="text-xl font-bold text-gray-700">
              Tương Quan Nhập Học & Điểm Số
            </h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed italic px-4">
            "{insights?.correlationInsight}"
          </p>
        </div>

        {/* Cải thiện */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-orange-500">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 rounded-lg mr-4 text-2xl">⚠️</div>
            <h2 className="text-xl font-bold text-gray-700">
              Cảnh Báo & Cải Thiện
            </h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed italic px-4">
            "{insights?.improvementArea?.replace("Class ", "Ngành ")}"
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-200/50 rounded-xl text-center text-gray-500 text-[10px] italic tracking-wider uppercase font-bold">
        * Dữ liệu phân tích được cập nhật tự động dựa trên thời gian thực từ
        database
      </div>
    </div>
  );
};

export default InsightsPage;
