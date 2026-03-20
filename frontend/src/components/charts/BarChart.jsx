import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, font: { size: 12 } },
      },
      tooltip: { padding: 12, backgroundColor: "#1e293b" },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        // SỬA TẠI ĐÂY: Thiết lập thang điểm 4.0
        min: 0,
        max: 4.0,
        ticks: {
          stepSize: 0.5, // Hiển thị các nấc 0.5, 1.0, 1.5... cho dễ nhìn
        },
        grid: { borderDash: [5, 5] },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
