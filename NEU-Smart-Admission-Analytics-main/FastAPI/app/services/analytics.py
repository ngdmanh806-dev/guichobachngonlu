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
