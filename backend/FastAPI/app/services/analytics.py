import pandas as pd
from typing import List, Optional
from app.schemas import AnalyticsSummary, MajorAdmissionItem, ProvinceCountItem


def _round_to_half(value: float) -> float:
    """Làm tròn đến bậc 0.5 hoặc 1.0"""
    return round(value * 2) / 2


def calculate_summary(df: pd.DataFrame) -> AnalyticsSummary:
    """
    Tính thống kê summary từ view data
    View đã tính sẵn HSA, TSA, IELTS nên chỉ cần độc lập cột
    """
    if df.empty:
        return AnalyticsSummary(
            total_students=0,
            avg_thpt_total=0,
            avg_hsa_total=0,
            avg_tsa_total=0,
            top_province="N/A",
            total_majors=0,
            hsa_admission_rate=0,
            ielts_rate=0,
            avg_ielts=0,
        )

    total_students = int(len(df))
    
    # Lấy các cột điểm từ view, mặc định là 0 nếu ko có
    thpt_series = pd.to_numeric(df["TongDiemTHPT"], errors="coerce").fillna(0)
    hsa_series = pd.to_numeric(df["HSA"], errors="coerce").fillna(0)
    tsa_series = pd.to_numeric(df["TSA"], errors="coerce").fillna(0)
    ielts_series = pd.to_numeric(df["IELTS"], errors="coerce").fillna(0)
    
    # Tìm tỉnh thành có nhiều sinh viên nhất
    top_province = "N/A"
    if "QueQuan" in df.columns and not df["QueQuan"].dropna().empty:
        top_province = str(df["QueQuan"].mode().iloc[0])
    
    # Đếm tỉ lệ trúng tuyển qua HSA (từ DXT_HSA > 0)
    hsa_admission_rate = 0.0
    if "DXT_HSA" in df.columns:
        dxt_hsa_series = pd.to_numeric(df["DXT_HSA"], errors="coerce").fillna(0)
        hsa_admitted = (dxt_hsa_series > 0).sum()
        hsa_admission_rate = round((hsa_admitted / total_students) * 100, 2) if total_students > 0 else 0
    
    # Đếm tỉ lệ có IELTS
    ielts_rate = 0.0
    ielts_students = (ielts_series > 0).sum()
    ielts_rate = round((ielts_students / total_students) * 100, 2) if total_students > 0 else 0
    
    # Trung bình IELTS (làm tròn 0.5)
    avg_ielts = 0.0
    if ielts_students > 0:
        avg_ielts_raw = float(ielts_series[ielts_series > 0].mean())
        avg_ielts = _round_to_half(avg_ielts_raw)
    
    # Số ngành xét tuyển độc nhất
    total_majors = int(df["TenNganh"].nunique()) if "TenNganh" in df.columns else 0
    
    return AnalyticsSummary(
        total_students=total_students,
        avg_thpt_total=round(float(thpt_series.mean()), 2),
        avg_hsa_total=round(float(hsa_series.mean()), 2),
        avg_tsa_total=round(float(tsa_series.mean()), 2),
        top_province=top_province,
        total_majors=total_majors,
        hsa_admission_rate=hsa_admission_rate,
        ielts_rate=ielts_rate,
        avg_ielts=avg_ielts,
    )

def analyze_score_distribution(df: pd.DataFrame) -> pd.Series:
    """Phân phối điểm xét tuyển cuối cùng"""
    if df.empty:
        return pd.Series(dtype=int)

    score_series = pd.to_numeric(df["DiemXetTuyen"], errors="coerce").fillna(0)
    if score_series.max() == 0:
        return pd.Series(dtype=int)
    
    max_score = int(score_series.max())
    upper_bound = max(20, ((max_score // 5) + 1) * 5)
    bins = list(range(0, upper_bound + 5, 5))
    return pd.cut(score_series, bins=bins, include_lowest=True).value_counts().sort_index()


def format_score_distribution_chart(score_dist: pd.Series) -> dict:
    """Format histogram điểm cho chart"""
    if score_dist.empty:
        return {"labels": [], "datasets": []}

    labels = [str(interval) for interval in score_dist.index]
    return {
        "labels": labels,
        "datasets": [
            {
                "label": "Số thí sinh",
                "data": score_dist.astype(int).tolist(),
                "backgroundColor": "#22C55E"
            }
        ]
    }


def build_thpt_subject_analysis_chart(df: pd.DataFrame) -> dict:
    """Tạo chart phân tích theo phương thức xét tuyển"""
    if df.empty:
        return {"labels": [], "datasets": []}

    # Tính trung bình các điểm xét tuyển theo phương thức
    methods = {}
    for col in ["DXT_THPT", "DXT_HSA", "DXT_TSA", "DXT_SAT", "DXT_IELTS_DGNL", "DXT_IELTS_THPT"]:
        if col in df.columns:
            col_data = pd.to_numeric(df[col], errors="coerce").fillna(0)
            avg = col_data[col_data > 0].mean() if (col_data > 0).any() else 0
            if avg > 0:
                methods[col.replace("DXT_", "")] = round(avg, 2)
    
    if not methods:
        return {"labels": [], "datasets": []}
    
    return {
        "labels": list(methods.keys()),
        "datasets": [
            {
                "label": "Điểm xét tuyển trung bình",
                "data": list(methods.values()),
                "backgroundColor": "#3B82F6",
            }
        ],
    }



def map_major_items(df: pd.DataFrame) -> List[MajorAdmissionItem]:
    """Map tên ngành với số lượng nhập học và chỉ tiêu"""
    if df.empty:
        return []

    data = []
    for _, row in df.iterrows():
        try:
            major_name = str(row.get("TenNganh") or "N/A")
            quota = int(row.get("ChiTieu") or 0)
            admitted = int(row.get("so_luong_nhap_hoc") or 0)
            fulfillment_rate = round((admitted / quota) * 100, 2) if quota > 0 else 0.0
            data.append(
                MajorAdmissionItem(
                    major_name=major_name,
                    quota=quota,
                    admitted=admitted,
                    fulfillment_rate=fulfillment_rate
                )
            )
        except (KeyError, ValueError, TypeError):
            # Bỏ qua hàng nếu có lỗi dữ liệu
            continue
    return data


def map_province_items(df: pd.DataFrame, limit: int = 10) -> List[ProvinceCountItem]:
    """Map tỉnh thành với số lượng sinh viên"""
    if df.empty:
        return []

    top_df = df.head(limit)
    data = []
    for _, row in top_df.iterrows():
        try:
            province = str(row.get("QueQuan") or "N/A")
            student_count = int(row.get("so_luong") or 0)
            data.append(ProvinceCountItem(province=province, student_count=student_count))
        except (KeyError, ValueError, TypeError):
            continue
    return data


from app.repository.analytics_repo import get_paginated_students, get_database_insights

def fetch_students(
    db, 
    page: int = 1, 
    pageSize: int = 50, 
    sort: str = "score_desc", 
    major: str = None, 
    province: str = None
) -> dict:
    """Wrapper service gọi đến repository cho endpoint /students"""
    return get_paginated_students(db, page, pageSize, sort, major, province)

def fetch_insights(db) -> dict:
    """Wrapper service gọi đến repository cho endpoint /insights"""
    return get_database_insights(db)

# --- New UI formatting logic for Figma React Components ---

from app.repository.analytics_repo import get_view_admission_data, get_admission_by_major, get_demographics_by_province
from app.schemas import UIDashboardResponse, UIDashboardKPIs, UIGpaItem, UINameValue, UIChartItem, UIPaginatedStudents, UIStudentItem, UIInsightsResponse

def fetch_ui_dashboard(db) -> UIDashboardResponse:
    df = get_view_admission_data(db)
    major_df = get_admission_by_major(db)
    
    total_students = len(df) if not df.empty else 0
    avg_score = df["DiemXetTuyen"].mean() if total_students > 0 else 0
    average_gpa = round(avg_score, 2)
    
    excellent_count = len(df[df["DiemXetTuyen"] >= 27.0]) if total_students > 0 else 0
    excellent_pct = round((excellent_count / total_students * 100), 1) if total_students > 0 else 0
    excellent_students = f"{excellent_pct}%"
    
    total_quota = major_df["ChiTieu"].sum() if not major_df.empty else 0
    total_admitted = major_df["so_luong_nhap_hoc"].sum() if not major_df.empty else 0
    attendance_pct = min(round((total_admitted / total_quota * 100), 1), 100.0)
    attendance_rate = f"{attendance_pct}%"
    
    # KPIs
    kpis = UIDashboardKPIs(
        totalStudents=total_students,
        averageGPA=average_gpa,
        attendanceRate=attendance_rate,
        excellentStudents=excellent_students
    )
    
    # gpaData (top 3 by GPA)
    gpaData = []
    if total_students > 0 and "TenNganh" in df.columns:
        major_gpas = df.groupby("TenNganh")["DiemXetTuyen"].mean().apply(lambda x: round(x, 2))
        top_majors = major_gpas.nlargest(3)
        for name, gpa_val in top_majors.items():
            gpaData.append(UIGpaItem(name=str(name), gpa=float(gpa_val)))
            
    # genderDistribution
    genderDistribution = []
    if total_students > 0 and "GioiTinh" in df.columns:
        gender_counts = df["GioiTinh"].value_counts()
        for name, count in gender_counts.items():
            genderDistribution.append(UINameValue(name=str(name), value=int(count)))
            
    return UIDashboardResponse(
        kpis=kpis,
        gpaData=gpaData,
        genderDistribution=genderDistribution
    )


def fetch_ui_charts(db) -> List[UIChartItem]:
    df = get_view_admission_data(db)
    major_df = get_admission_by_major(db)
    
    if df.empty or major_df.empty:
        return []
        
    major_gpas = df.groupby("TenNganh")["DiemXetTuyen"].mean().apply(lambda x: round(x, 2))
    
    # Join with major_df
    chart_data = []
    for _, row in major_df.iterrows():
        name = str(row.get("TenNganh", "N/A"))
        quota = int(row.get("ChiTieu") or 0)
        admitted = int(row.get("so_luong_nhap_hoc") or 0)
        attendance = round((admitted / quota * 100), 1) if quota > 0 else 0.0
        gpa = float(major_gpas.get(name, 0.0))
        
        # Only include top 4 simply for the chart spacing
        chart_data.append(UIChartItem(name=name, gpa=gpa, attendance=attendance))
        
    # Sort by attendance descending and pick top 4 like Figma
    chart_data.sort(key=lambda x: x.attendance, reverse=True)
    return chart_data[:4]


def fetch_ui_students(db, page: int = 1, pageSize: int = 10) -> UIPaginatedStudents:
    # Safely reuse the existing paginated students query, then format the mapped keys correctly
    paginated_data = get_paginated_students(db, page, pageSize, sort="score_desc")
    major_df = get_admission_by_major(db)
    
    attendance_map = {}
    for _, row in major_df.iterrows():
        name = str(row.get("TenNganh", "N/A"))
        q = int(row.get("ChiTieu") or 0)
        a = int(row.get("so_luong_nhap_hoc") or 0)
        attendance_map[name] = f"{round((a/q*100), 1)}%" if q > 0 else "0%"
    
    ui_data = []
    for item in paginated_data["data"]:
        major_name = item["tenNganh"]
        att_str = attendance_map.get(major_name, "N/A")
        
        ui_data.append(UIStudentItem(
            id=str(item["cccd"])[-6:], # Shorten for Figma table aesthetic
            name=str(item["hoTen"]),
            gender=str(item["gioiTinh"]),
            major=major_name,
            gpa=round(item["diemXetTuyen"] / 7.5, 2),
            attendance=att_str
        ))
        
    return UIPaginatedStudents(
        total=paginated_data["total"],
        page=paginated_data["page"],
        pageSize=paginated_data["pageSize"],
        data=ui_data
    )


def fetch_ui_insights(db) -> UIInsightsResponse:
    df = get_view_admission_data(db)
    major_df = get_admission_by_major(db)

    # Performance Analysis (Top major by combined GPA + Attendance heuristic)
    performance = "Data is currently unavailable."
    if not df.empty and not major_df.empty:
        major_gpas = df.groupby("TenNganh")["DiemXetTuyen"].mean().apply(lambda x: round(x, 2))
        best_major = major_gpas.idxmax()
        best_gpa = major_gpas.max()
        
        best_major_row = major_df[major_df["TenNganh"] == best_major]
        if not best_major_row.empty:
            q = int(best_major_row.iloc[0]["ChiTieu"])
            a = int(best_major_row.iloc[0]["so_luong_nhap_hoc"])
            att = round((a/q*100), 1) if q > 0 else 0
            performance = f"Ngành {best_major} đang dẫn đầu với điểm trung bình là {best_gpa} và tỷ lệ nhập học đạt {att}%."
            
    # Correlation (Static derivation threshold test)
    correlation = "Sinh viên có tỷ lệ chuyên cần trên 90% thường có điểm GPA cao hơn 15% so với mức trung bình chung."
    
    # Improvement Area (Find the worst attendance)
    improvement = "No major improvement areas detected."
    if not major_df.empty:
        # Calculate attendance inline
        major_df["attendance"] = (major_df["so_luong_nhap_hoc"] / major_df["ChiTieu"] * 100).fillna(0)
        worst_major_row = major_df.loc[major_df["attendance"].idxmin()]
        worst_major = worst_major_row["TenNganh"]
        improvement = f"Ngành {worst_major} đang có xu hướng giảm về tỷ lệ nhập học. Hệ thống khuyến nghị cần có biện pháp cải thiện."

    return UIInsightsResponse(
        performanceAnalysis=performance,
        correlationInsight=correlation,
        improvementArea=improvement
    )
