import { useState, useEffect } from "react";
import axios from "axios";

export const useStudents = () => {
  const [allData, setAllData] = useState([]); // Lưu toàn bộ 3000 người
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        let allStudents = [];
        const pageSize = 100; // Mức tối đa an toàn của Backend

        // Bước 1: Gọi lần đầu để biết tổng số (Total)
        const firstResp = await axios.get("http://localhost:8000/ui/students", {
          params: { page: 1, pageSize: pageSize },
        });
        const total = firstResp.data.total;
        allStudents = [...firstResp.data.data];

        // Bước 2: Nếu còn dữ liệu, tự động gọi các trang tiếp theo
        const totalPages = Math.ceil(total / pageSize);
        const promises = [];

        for (let p = 2; p <= totalPages; p++) {
          promises.push(
            axios.get("http://localhost:8000/ui/students", {
              params: { page: p, pageSize: pageSize },
            }),
          );
        }

        const results = await Promise.all(promises);
        results.forEach((res) => {
          allStudents = [...allStudents, ...res.data.data];
        });

        setAllData(allStudents);
      } catch (err) {
        console.error("Lỗi tải toàn bộ dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { allData, loading };
};
