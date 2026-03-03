import React from "react";

const KPICard = ({ title, value, icon, color }) => {
  const shadowColors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    teal: "bg-teal-50 text-teal-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div
        className={`p-4 rounded-lg ${shadowColors[color] || shadowColors.blue}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
};

export default KPICard;
