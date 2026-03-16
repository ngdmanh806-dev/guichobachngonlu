import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, GraduationCap, Clock, Award } from "lucide-react";
import StudentTable from "../components/StudentTable";
import API from "../services/api";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    kpis: { totalStudents: 20, averageGPA: 3.44, attendanceRate: "88.8%", excellentStudents: "40%" },
    gpaData: [
      { name: "IT01", gpa: 3.8 },
      { name: "IT02", gpa: 3.4 },
      { name: "IT03", gpa: 3.2 },
    ],
    genderDistribution: []
  });

  useEffect(() => {
    API.get("/ui/dashboard")
      .then((res) => setDashboardData(res.data))
      .catch(console.error);
  }, []);

  const { kpis, gpaData, genderDistribution } = dashboardData;

  return (
    <div className="ml-64 p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm bg-white">
            <option>All Classes</option>
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm bg-white">
            <option>All Genders</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="kpi-card flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Students</p>
            <h3 className="text-2xl font-bold">{kpis.totalStudents}</h3>
          </div>
        </div>
        <div className="kpi-card flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Average GPA</p>
            <h3 className="text-2xl font-bold">{kpis.averageGPA}</h3>
          </div>
        </div>
        <div className="kpi-card flex items-center gap-4">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Attendance Rate</p>
            <h3 className="text-2xl font-bold">{kpis.attendanceRate}</h3>
          </div>
        </div>
        <div className="kpi-card flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Excellent Students</p>
            <h3 className="text-2xl font-bold">{kpis.excellentStudents}</h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-semibold mb-6 text-gray-700">
            Average GPA by Class
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="gpa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <h4 className="font-semibold mb-6 text-gray-700 text-left">
            Student Distribution by Gender
          </h4>
          {/* Pie chart logic tương tự Recharts... */}
          <div className="flex justify-center items-center h-64 text-gray-400 italic">
            [Pie Chart: {genderDistribution.map(g => `${g.name} ${g.value}`).join(", ")}]
          </div>
        </div>
      </div>

      {/* Student Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h4 className="font-semibold text-gray-700">Recent Student Data</h4>
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="border rounded-lg px-4 py-2 text-sm w-64"
          />
        </div>
        <StudentTable />
      </div>
    </div>
  );
};

export default DashboardPage;
