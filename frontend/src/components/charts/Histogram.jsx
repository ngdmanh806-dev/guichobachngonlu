import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Histogram = ({ data, stats }) => {
  const avgValue = stats?.mean || stats?.average || 0;

  const getLabelIndex = (value) => {
    if (!data || !data.labels || value === 0) return -1;
    return data.labels.findIndex((label) => {
      const parts = label.replace(/[()\]\s]/g, "").split(",");
      if (parts.length !== 2) return false;
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      return value > min && value <= max;
    });
  };

  const avgIndex = getLabelIndex(avgValue);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } },
    },
  };

  const customLinePlugin = {
    id: "customLine",
    afterDraw: (chart) => {
      if (avgIndex < 0 || !avgValue) return;
      const {
        ctx,
        scales: { x, y },
      } = chart;
      const xPos = x.getPixelForValue(data.labels[avgIndex]);
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(xPos, y.top);
      ctx.lineTo(xPos, y.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#f59e0b";
      ctx.stroke();
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`TB: ${avgValue.toFixed(2)}`, xPos + 8, y.top + 15);
      ctx.restore();
    },
  };

  return (
    <div className="h-full w-full">
      <Bar
        key={JSON.stringify(data?.datasets?.[0]?.data || [])}
        data={data}
        options={options}
        plugins={[customLinePlugin]}
      />
    </div>
  );
};

export { Histogram };
