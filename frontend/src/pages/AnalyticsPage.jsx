import React, { useState, useEffect } from "react";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import API from "../services/api";

const AnalyticsPage = () => {
  const [insights, setInsights] = useState({
    performanceAnalysis: "Class IT01 leads with an average GPA of 3.73 and an attendance rate of 92.5%.",
    correlationInsight: "Students with attendance above 90% tend to have 15% higher GPAs than the average.",
    improvementArea: "Class IT03 shows a declining trend in attendance. Targeted intervention recommended."
  });

  useEffect(() => {
    API.get("/ui/insights")
      .then((res) => setInsights(res.data))
      .catch(console.error);
  }, []);
  return (
    <div className="ml-64 p-8">
      <h2 className="text-2xl font-bold mb-8">Data Insights & Findings</h2>

      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={20} />
            <h4 className="font-bold text-blue-900">
              Class Performance Analysis
            </h4>
          </div>
          <p className="text-blue-800">
            {insights.performanceAnalysis}
          </p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="text-purple-600" size={20} />
            <h4 className="font-bold text-purple-900">
              Attendance & Performance Correlation
            </h4>
          </div>
          <p className="text-purple-800">
            {insights.correlationInsight}
          </p>
        </div>

        <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-xl">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-teal-600" size={20} />
            <h4 className="font-bold text-teal-900">Areas for Improvement</h4>
          </div>
          <p className="text-teal-800">
            {insights.improvementArea}
          </p>
        </div>
      </div>
    </div>
  );
};
