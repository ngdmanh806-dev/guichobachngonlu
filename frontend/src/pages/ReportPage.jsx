import React from "react";
import { FileText, CheckCircle, Download } from "lucide-react";

const ReportPage = () => {
  return (
    <div className="ml-64 p-8">
      <h2 className="text-2xl font-bold mb-8">Academic Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase py-1 px-2 bg-green-100 text-green-700 rounded">
              Ready
            </span>
          </div>
          <h4 className="font-bold text-gray-800 mb-2">
            Admission Summary 2024
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            Full statistical analysis of student scores, demographics, and major
            distribution.
          </p>
          <button className="w-full flex justify-center items-center gap-2 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
            <Download size={16} /> Download PDF
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm opacity-60">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase py-1 px-2 bg-gray-100 text-gray-500 rounded">
              Pending
            </span>
          </div>
          <h4 className="font-bold text-gray-800 mb-2">
            Semester Final Review
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            Comparison of student performance across all departments for the
            current semester.
          </p>
          <button className="w-full py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">
            Generating...
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
