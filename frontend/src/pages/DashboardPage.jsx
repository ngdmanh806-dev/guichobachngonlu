import React from "react";
import useDashboard from "../hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Định nghĩa màu sắc cố định: Nam (Xanh), Nữ (Hồng)
const GENDER_COLORS = {
  Nam: "#3B82F6",
  Nữ: "#EC4899",
};

const DashboardPage = () => {
  const { data, loading, error } = useDashboard();

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  const { kpis, gpaData, genderDistribution } = data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Tổng Quan Tuyển Sinh
      </h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Tổng Thí Sinh"
          value={kpis.totalStudents}
          color="#3B82F6"
        />
        <KPICard
          title="Điểm trung bình Xét Tuyển"
          value={20.31}
          color="#3B82F6"
        />
        <KPICard
          title="Tỉ Lệ Nhập Học"
          value={kpis.attendanceRate}
          color="#3B82F6"
        />
        <KPICard
          title="Tỉ Lệ Thí Sinh Xuất Sắc"
          value={kpis.excellentStudents}
          color="#3B82F6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Chart - Điểm xét tuyển hệ 30 */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Top 3 Ngành Có Điểm Xét Tuyển Cao Nhất
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                {/* Đổi thang đo Y lên 30 */}
                <YAxis domain={[0, 30]} ticks={[0, 10, 20, 30]} />
                <Tooltip />
                <Bar
                  dataKey="gpa"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution - Chuyển sang Pie Chart đầy đủ */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Phân Bố Giới Tính Thí Sinh
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80} // Xóa innerRadius để làm Pie Chart đầy
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={GENDER_COLORS[entry.name] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, color }) => (
  <div
    className="bg-white p-6 rounded-xl shadow-sm border-l-4 transition-all hover:shadow-md"
    style={{ borderLeftColor: color }}
  >
    <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default DashboardPage;
