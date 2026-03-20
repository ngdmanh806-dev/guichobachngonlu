import React from "react";
import { useCharts } from "../hooks/useCharts";
import Card from "../components/common/Card";
import { Histogram } from "../components/charts/Histogram";
import Loading from "../components/common/Loading";
import { BarChart2, MapPin, Lightbulb, TrendingUp } from "lucide-react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  LinearScale,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Đăng ký các thành phần Chart.js
ChartJS.register(
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  ChartLegend,
);

const ChartsPage = () => {
  const { charts, loading } = useCharts();

  if (loading || !charts) return <Loading />;

  // --- 1. DỮ LIỆU HISTOGRAM (PHỔ ĐIỂM) ---
  const scoreDist = charts.score_distribution || {};
  const filteredData = (scoreDist.labels || [])
    .map((label, index) => ({
      label,
      value: scoreDist.datasets?.[0]?.data[index],
    }))
    .filter((item) => !item.label?.includes("-0.001"));

  const histogramData = {
    labels: filteredData.map((d) => d.label),
    datasets: [
      {
        label: "Số lượng sinh viên",
        data: filteredData.map((d) => d.value),
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  // --- 2. DỮ LIỆU TỈNH THÀNH ---
  const provinceData = (charts.provinces || []).slice(0, 10).map((p) => ({
    name: p.province,
    "Sinh viên": p.student_count,
  }));

  // --- 3. DỮ LIỆU RADAR ---
  const radarData = {
    labels: charts.thpt_subject_analysis?.labels || [],
    datasets: [
      {
        label: "Điểm xét tuyển trung bình",
        data: charts.thpt_subject_analysis?.datasets?.[0]?.data || [],
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderColor: "#4f46e5",
        borderWidth: 2,
        pointBackgroundColor: "#4f46e5",
        pointBorderColor: "#fff",
      },
    ],
  };

  // --- 4. TÌNH HÌNH NHẬP HỌC ---
  const admissionData = (charts.admission_by_major || []).map((item) => ({
    name: item.TenNganh || "N/A",
    "Chỉ tiêu": item.ChiTieu || 0,
    "Thực tế": item.so_luong_nhap_hoc || 0,
    rate: item.fulfillment_rate || 0,
  }));

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart2 className="text-indigo-600" />
          Phân tích Tuyển sinh & Đào tạo
        </h1>
        <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
          Năm học 2024 - 2025
        </span>
      </header>

      {/* ROW 1: Điểm số & Nhập học */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Phân phối điểm xét tuyển" icon={TrendingUp}>
          <div className="h-[320px]">
            <Histogram data={histogramData} stats={charts?.score_statistics} />
          </div>
        </Card>

        <Card title="Chỉ tiêu vs Thực tế theo Ngành" icon={BarChart2}>
          <div className="h-[320px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionData} margin={{ bottom: 50 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 9 }}
                  height={80}
                />
                <YAxis />
                <RechartsTooltip cursor={{ fill: "#f8fafc" }} />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar
                  name="Chỉ tiêu"
                  dataKey="Chỉ tiêu"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
                <Bar
                  name="Thực tế"
                  dataKey="Thực tế"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                >
                  {admissionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rate >= 100 ? "#10b981" : "#6366f1"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ROW 2: Tỉnh thành & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top 10 Tỉnh thành đông sinh viên nhất" icon={MapPin}>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={provinceData}
                layout="vertical"
                margin={{ left: 40, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fontWeight: 500 }}
                  width={80}
                />
                <RechartsTooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="Sinh viên"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                >
                  {provinceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#1d4ed8" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Năng lực theo Phương thức" icon={Lightbulb}>
          <div className="h-[350px] py-4 flex justify-center">
            <Radar
              data={radarData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  r: {
                    suggestedMin: 0,
                    suggestedMax: 30,
                    ticks: {
                      stepSize: 5,
                      display: true,
                      backdropColor: "transparent",
                    },
                    grid: { color: "#e2e8f0" },
                    pointLabels: {
                      font: { size: 11, weight: "bold" },
                      color: "#475569",
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => ` Điểm TB: ${context.raw.toFixed(2)}`,
                    },
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChartsPage;
