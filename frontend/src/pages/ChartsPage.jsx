import React, { useState, useEffect } from "react";
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
  LineChart,
  Line,
  Legend,
} from "recharts";
import Legend from "recharts";
import API from "../services/api";

const ChartsPage = () => {
  const [data, setData] = useState([
    { name: "IT01", gpa: 3.8, attendance: 95 },
    { name: "IT02", gpa: 3.4, attendance: 88 },
    { name: "IT03", gpa: 3.2, attendance: 82 },
    { name: "EC01", gpa: 3.6, attendance: 90 },
  ]);

  useEffect(() => {
    API.get("/ui/charts")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const COLORS = ["#3b82f6", "#a855f7", "#14b8a6", "#f59e0b"];

  return (
    <div className="ml-64 p-8 min-h-screen">
      <h2 className="text-2xl font-bold mb-8">Data Visualization Section</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Row 1: Bar & Pie */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-semibold mb-6 text-gray-700">
            Average GPA by Class
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="gpa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-semibold mb-6 text-gray-700">
            Student Distribution by Gender
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Male", value: 12 },
                    { name: "Female", value: 8 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#a855f7" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Line & Bar Attendance */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-semibold mb-6 text-gray-700">
            GPA Trend Over Semesters
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-semibold mb-6 text-gray-700">
            Attendance Rate by Class (%)
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="attendance"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
