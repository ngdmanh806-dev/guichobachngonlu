export const ChartColors = {
  primary: "#3B82F6", // Blue
  secondary: "#10B981", // Green
  warning: "#F59E0B", // Orange
  danger: "#EF4444", // Red
  info: "#6366F1", // Indigo
  gray: "#94A3B8",
  lightGray: "#E2E8F0",
};

export const CommonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        font: { family: "'Inter', sans-serif", size: 12, weight: "500" },
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "#1e293b",
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 14, weight: "bold" },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { borderDash: [4, 4], color: "#f1f5f9" },
    },
    x: {
      grid: { display: false },
    },
  },
};
