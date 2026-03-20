# 📊 NEU Smart Admission Analytics System

> Hệ thống Dashboard phân tích dữ liệu tuyển sinh thông minh dành cho Trường Đại học Kinh tế Quốc dân (NEU).

Dự án cung cấp giải pháp Fullstack toàn diện giúp số hóa, phân tích và trực quan hóa các chỉ số tuyển sinh quan trọng. Hệ thống giúp nhà quản lý đưa ra quyết định dựa trên dữ liệu thực tế về phổ điểm, nguồn tuyển và năng lực sinh viên.

---

## Giao diện & Tính năng

Dưới đây là các phân hệ chính của hệ thống được xây dựng dựa trên dữ liệu thực tế:

### 1. Bảng điều khiển tổng quan (Dashboard Preview)

Hiển thị các chỉ số KPI cốt lõi và xu hướng tuyển sinh nhanh.
![Dashboard Overview]
_ **KPI Cards:** Tổng thí sinh (3000), Điểm TB xét tuyển (20.31), Tỷ lệ nhập học (100%), Thí sinh xuất sắc (4.0%).
_ **Biểu đồ Cột:** Top 3 Ngành có điểm xét tuyển cao nhất (Kinh doanh quốc tế, Kế toán). \* **Biểu đồ Tròn:** Phân bổ giới tính thí sinh (51% Nam - 49% Nữ).

### 2. Biểu đồ Thống kê Chi tiết (Statistics)

Tập trung vào phân tích sâu các khía cạnh điểm số và chỉ tiêu ngành.
![Statistics Charts 1]
_ **Phổ điểm (Histogram):** Trực quan hóa phân phối điểm xét tuyển theo các khoảng, tự động vẽ đường trung bình (Mean) net đứt màu cam đậm với Custom Canvas Plugin.
_ **Chỉ tiêu vs Thực tế:** Biểu đồ cột đôi so sánh kế hoạch tuyển sinh và số lượng nhập học thực tế theo từng ngành.

![Statistics Charts 2]
_ **Bản đồ Nguồn tuyển:** Biểu đồ thanh ngang hiển thị Top 10 Tỉnh thành có nhiều sinh viên nhập học nhất (Bắc Giang, Lai Châu...).
_ **Radar Chart năng lực:** So sánh điểm TB xét tuyển giữa các phương thức THPT, HSA (ĐGNL HN), TSA (ĐGNL Bách Khoa).

### 3. Báo cáo Phân tích Thông minh (Insights)

Sử dụng các thuật toán cơ bản để đưa ra nhận diện và cảnh báo sớm.

![Smart Insights]
_ **Chỉ số thông minh:** Tỷ lệ sinh viên có IELTS (0% - Mức độ hội nhập quốc tế thấp), Tỷ lệ sinh viên trúng tuyển HSA/TSA (30.67%).
_ **Phân tích hiệu suất:** Tự động nhận diện ngành dẫn đầu về điểm số và tỷ lệ nhập học. \* **Cảnh báo sớm:** Phát hiện các ngành có xu hướng giảm về tỷ lệ nhập học để đưa ra biện pháp cải thiện.

### 4. Quản lý Danh sách Sinh viên (Student List)

Giao diện quản lý chi tiết từng thí sinh.
![Student List]
_ **Bảng dữ liệu:** Hiển thị Mã SV, Họ và Tên, Ngành trúng tuyển, Điểm thi (hệ 30).
_ **Tìm kiếm:** Hỗ trợ tìm kiếm thời gian thực theo tên thí sinh.

---

## 🛠 Kiến trúc công nghệ

### Backend (Máy chủ dữ liệu)

- **FastAPI:** Framework Python hiệu năng cao.
- **MySQL / SQLAlchemy:** Hệ quản trị CSDL và ORM để quản lý dữ liệu tuyển sinh.

### Frontend (Giao diện & Biểu đồ)

- **React.js:** Thư viện xây dựng giao diện người dùng.
- **Tailwind CSS:** Framework thiết kế giao diện hiện đại.
- **Chart.js (react-chartjs-2):** Dùng cho biểu đồ Histogram và Radar (có tùy biến plugin).
- **Recharts:** Dùng cho biểu đồ Cột, Tròn, Thanh ngang.
- **Lucide Icons:** Hệ thống icon nhất quán.

---

## 📦 Hướng dẫn cài đặt

### 1. Cấu hình Backend

cd backend\FastAPI

python -m venv venv

pip install -r requirements.txt

# Cấu hình kết nối SQL Server trong file main.py hoặc .env

python -m uvicorn app.main:app --reload

### 2. Cấu hình Frontend

cd frontend

npm install

npm start
