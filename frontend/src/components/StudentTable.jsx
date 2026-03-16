import React, { useState, useEffect } from "react";
import API from "../services/api";

const StudentTable = ({ students: externalStudents }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (externalStudents) {
      setStudents(externalStudents);
    } else {
      API.get("/ui/students?page=1&pageSize=5")
        .then(res => setStudents(res.data.data))
        .catch(console.error);
    }
  }, [externalStudents]);

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
        <tr>
          <th className="px-6 py-4">Student ID</th>
          <th className="px-6 py-4">Name</th>
          <th className="px-6 py-4">Major</th>
          <th className="px-6 py-4">GPA</th>
          <th className="px-6 py-4">Attendance</th>
          <th className="px-6 py-4 text-right">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {students.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 font-medium text-gray-900">#NEU{s.id}</td>
            <td className="px-6 py-4">{s.name}</td>
            <td className="px-6 py-4">{s.major}</td>
            <td className="px-6 py-4">
              <span className="font-semibold text-blue-600">{s.gpa}</span>
            </td>
            <td className="px-6 py-4">{s.attendance}</td>
            <td className="px-6 py-4 text-right">
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${s.gpa >= 3.6 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {s.gpa >= 3.6 ? "Excellent" : "Good"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
