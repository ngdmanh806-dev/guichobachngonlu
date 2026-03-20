import { useState, useEffect } from "react";
import axios from "axios";

const useInsights = () => {
  const [data, setData] = useState({
    narratives: null,
    stats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllInsights = async () => {
      try {
        setLoading(true);
        // Chỉ giữ lại 2 API cần thiết
        const [insightsRes, dashboardRes] = await Promise.all([
          axios.get("http://localhost:8000/ui/insights"),
          axios.get("http://localhost:8000/analytics/dashboard"),
        ]);

        setData({
          narratives: insightsRes.data,
          stats: dashboardRes.data.summary,
        });

        setError(null);
      } catch (err) {
        console.error("Error loading insights:", err);
        setError("Không thể tải dữ liệu phân tích chuyên sâu.");
      } finally {
        setLoading(false);
      }
    };

    getAllInsights();
  }, []);

  return {
    insights: data.narratives,
    stats: data.stats,
    loading,
    error,
  };
};

export default useInsights;
