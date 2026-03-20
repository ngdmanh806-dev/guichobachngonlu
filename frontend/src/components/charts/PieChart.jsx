import React from "react";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector,
} from "recharts";

const PieChart = ({ data }) => {
  // Quản lý trạng thái hover để làm hiệu ứng phóng to miếng bánh
  const [activeIndex, setActiveIndex] = React.useState(null);
  // KIỂM TRA AN TOÀN: Tránh lỗi "Cannot read properties of undefined (reading 'map')"
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400 italic">
        Đang tải dữ liệu...
      </div>
    );
  }

  const COLORS = [
    "#3B82F6",
    "#EC4899",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#06B6D4",
    "#94A3B8",
  ];

  // Hàm vẽ miếng bánh khi được hover (Chức năng mới: Phóng to 8px)
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8} // Miếng bánh nở ra khi hover
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape} // Kích hoạt hiệu ứng phóng to
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0} // GIỮ NGUYÊN: innerRadius = 0 để là biểu đồ tròn đặc (Pie)
            outerRadius={90}
            dataKey="value"
            nameKey="name"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff" // Thêm viền trắng mỏng cho tách biệt các miếng
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} Sinh viên`, name]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Legend verticalAlign="bottom" align="center" iconType="circle" />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
