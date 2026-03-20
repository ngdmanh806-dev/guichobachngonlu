import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useCharts = () => {
  const [data, setData] = useState({
    insights: {
      performanceAnalysis: "",
      correlationInsight: "",
      improvementArea: "",
    },
    charts: {
      score_distribution: {},
      provinces: [],
      admission_by_major: [],
      thpt_subject_analysis: null,
      score_statistics: { average: 0, max: 0, min: 0 },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Bỏ api.getUICharts() vì không dùng đến dữ liệu GPA/Attendance cho Scatter nữa
    Promise.all([api.getUIInsights(), api.getRawAnalytics()])
      .then(([insightsRes, rawRes]) => {
        if (!isMounted) return;

        const rawData = rawRes.data;

        setData({
          insights: insightsRes.data || {},
          charts: {
            // Lấy trực tiếp object chứa labels và datasets từ backend
            thpt_subject_analysis: rawData?.charts?.thpt_subject_analysis || {
              labels: [],
              datasets: [],
            },

            score_distribution: rawData?.charts?.score_distribution || {},
            score_statistics: {
              average: rawData?.summary?.avg_thpt_total || 0,
              max: 30,
              min: 0,
            },

            provinces: (rawData?.top_provinces || []).map((p) => ({
              province: p.province,
              student_count: p.student_count,
            })),

            admission_by_major: (rawData?.top_majors || []).map((m) => ({
              TenNganh: m.major_name,
              ChiTieu: m.quota,
              so_luong_nhap_hoc: m.admitted,
              fulfillment_rate: m.fulfillment_rate,
            })),
          },
        });
      })
      .catch((err) => console.error("Lỗi dữ liệu:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { charts: data.charts, insights: data.insights, loading };
};
