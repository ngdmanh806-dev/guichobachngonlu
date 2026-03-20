import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">
        Đang tải dữ liệu...
      </p>
    </div>
  );
};

export default Loading;
