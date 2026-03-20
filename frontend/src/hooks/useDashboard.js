import { useState, useEffect } from "react";
import axios from "axios";

const useDashboard = () => {
  const [data, setData] = useState({
    kpis: {
      totalStudents: 0,
      averageGPA: 0,
      attendanceRate: "0%",
      excellentStudents: "0%",
    },
    gpaData: [],
    genderDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Lưu ý: Kiểm tra URL này có đúng với port backend của Mạnh không (thường là 8000)
        const response = await axios.get("http://localhost:8000/ui/dashboard");
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Không thể tải dữ liệu Dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};

export default useDashboard;
