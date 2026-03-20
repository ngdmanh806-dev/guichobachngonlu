from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
from app.models import ViewPhanTichTuyenSinh, HoSoNhapHoc, Nganh, ThiSinh


def clean_admission_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Làm sạch dữ liệu trước phân tích
    - Thay thế NULL/NaN của cột điểm bằng trung bình cột đó
    - Thay thế giá trị 0 bằng trung bình cột đó
    - Trung bình được tính bỏ qua cả NULL và 0
    - Đảm bảo các cột điểm là numeric
    
    Returns:
        DataFrame đã được làm sạch với thống kê cleaning trong df.attrs["cleaning_stats"]
    """
    df = df.copy()
    cleaning_stats = {}
    
    # Danh sách các cột điểm cần làm sạch
    score_columns = [
        "TongDiemTHPT", "HSA", "TSA", "IELTS", "SAT",
        "DiemXetTuyen",
        "DXT_THPT", "DXT_HSA", "DXT_TSA", "DXT_SAT", 
        "DXT_IELTS_DGNL", "DXT_IELTS_THPT"
    ]
    
    for col in score_columns:
        if col in df.columns:
            # Chuyển sang numeric, các giá trị không phải số thành NaN
            df[col] = pd.to_numeric(df[col], errors="coerce")
            
            # Đếm NULL và 0 trước làm sạch
            null_count = df[col].isna().sum()
            zero_count = (df[col] == 0).sum()
            
            # Tính trung bình bỏ qua cả NULL và 0 (chỉ lấy giá trị > 0)
            valid_values = df[col][(df[col].notna()) & (df[col] > 0)]
            mean_value = valid_values.mean() if len(valid_values) > 0 else None
            
            # Thay thế NULL và 0 bằng trung bình
            if pd.notna(mean_value) and mean_value > 0:
                # Thay NULL
                df[col].fillna(mean_value, inplace=True)
                # Thay 0
                df.loc[df[col] == 0, col] = mean_value
            else:
                # Nếu không có giá trị > 0, set NULL thành 0, giữ 0 như cũ
                df[col].fillna(0, inplace=True)
            
            # Ghi lại thống kê nếu có xử lý
            if null_count > 0 or zero_count > 0:
                cleaning_stats[col] = {
                    "null_count": int(null_count),
                    "zero_count": int(zero_count),
                    "total_replaced": int(null_count + zero_count),
                    "mean_value": round(mean_value, 2) if pd.notna(mean_value) else 0,
                    "valid_data_count": len(valid_values)
                }
    
    # Lưu thống kê vào attribute của DataFrame
    df.attrs["cleaning_stats"] = cleaning_stats
    
    return df



def get_view_admission_data(db: Session) -> pd.DataFrame:
    """
    Lấy toàn bộ dữ liệu phân tích từ view VW_PHAN_TICH_TUYENSINH + QueQuan từ ThiSinh
    View đã tính sẵn: HSA, TSA, IELTS, điểm xét tuyển theo phương thức
    Tự động làm sạch dữ liệu NULL/NaN và giá trị 0 trước khi trả về
    
    **Quy trình làm sạch:**
    - Chuyển all cột điểm sang kiểu numeric
    - Tính trung bình bỏ qua cả NULL và 0 (chỉ lấy giá trị > 0)
    - Thay thế NULL bằng trung bình cột
    - Thay thế giá trị 0 bằng trung bình cột
    - Nếu cột toàn NULL/0, set thành 0
    - Thống kê cleaning được lưu trong `df.attrs["cleaning_stats"]`
    """
    query = (
        db.query(ViewPhanTichTuyenSinh, ThiSinh.QueQuan)
        .join(ThiSinh, ViewPhanTichTuyenSinh.CCCD == ThiSinh.CCCD)
    )
    df = pd.read_sql(query.statement, db.bind)
    
    # Áp dụng làm sạch dữ liệu ngay sau khi lấy từ DB
    if not df.empty:
        df = clean_admission_data(df)
    
    return df


def get_data_quality_stats(db: Session) -> dict:
    """
    Lấy thống kê chất lượng dữ liệu - bao gồm tổng số NULL được thay thế
    """
    df = get_view_admission_data(db)
    
    if df.empty:
        return {"total_records": 0, "cleaning_stats": {}}
    
    cleaning_stats = df.attrs.get("cleaning_stats", {})
    
    return {
        "total_records": len(df),
        "total_columns": len(df.columns),
        "columns_cleaned": len(cleaning_stats),
        "cleaning_details": cleaning_stats
    }



def get_admitted_students_exam_scores(db: Session, nam_tuyen_sinh: int = 2024) -> pd.DataFrame:
    """
    Wrapper của view data (đã làm sạch) cho tương thích API
    """
    return get_view_admission_data(db)


def get_admitted_students_scores(db: Session, nam_tuyen_sinh: int = 2024) -> pd.DataFrame:
    """
    Lấy dữ liệu điểm của thí sinh nhập học từ view (đã làm sạch)
    View đã chuẩn bị: TongDiemTHPT, HSA, TSA, IELTS, DiemXetTuyen
    """
    df = get_view_admission_data(db)
    if df.empty:
        return pd.DataFrame(
            columns=[
                "CCCD",
                "HoTen",
                "TenNganh",
                "TongDiemTHPT",
                "HSA",
                "TSA",
                "IELTS",
                "DiemXetTuyen",
            ]
        )
    
    # Đổi tên cột cho phù hợp API schema
    df = df.rename(
        columns={
            "TongDiemTHPT": "thpt_total",
            "HSA": "hsa_total",
            "TSA": "tsa_total",
            "IELTS": "ielts_score",
            "DiemXetTuyen": "total_score",
        }
    )
    
    # Đảm bảo dữ liệu numeric (đã làm sạch nhưng chắc thêm lần nữa)
    for col in ["thpt_total", "hsa_total", "tsa_total", "ielts_score", "total_score"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
    
    return df


def get_admission_by_major(db: Session, nam_tuyen_sinh: int = 2024) -> pd.DataFrame:
    """
    Thống kê số lượng nhập học so với chỉ tiêu từng ngành từ bảng NGANH và HO_SO_NHAP_HOC
    """
    query = (
        db.query(
            Nganh.TenNganh,
            Nganh.ChiTieu,
            func.count(HoSoNhapHoc.CCCD).label("so_luong_nhap_hoc")
        )
        .outerjoin(HoSoNhapHoc, (Nganh.MaNganh == HoSoNhapHoc.MaNganh) & (HoSoNhapHoc.NamTuyenSinh == nam_tuyen_sinh))
        .group_by(Nganh.MaNganh, Nganh.TenNganh, Nganh.ChiTieu)
        .order_by(Nganh.TenNganh)
    )
    
    df = pd.read_sql(query.statement, db.bind)
    return df if not df.empty else pd.DataFrame(columns=["TenNganh", "ChiTieu", "so_luong_nhap_hoc"])


def get_demographics_by_province(db: Session, nam_tuyen_sinh: int = 2024) -> pd.DataFrame:
    """
    Lấy thông tin phân bố địa lý theo quê quán từ bảng ThiSinh
    """
    query = (
        db.query(
            ThiSinh.QueQuan,
            func.count(ThiSinh.CCCD).label("so_luong")
        )
        .join(HoSoNhapHoc, ThiSinh.CCCD == HoSoNhapHoc.CCCD)
        .filter(HoSoNhapHoc.NamTuyenSinh == nam_tuyen_sinh)
        .group_by(ThiSinh.QueQuan)
        .order_by(func.count(ThiSinh.CCCD).desc())
    )
    
    df = pd.read_sql(query.statement, db.bind)
    return df if not df.empty else pd.DataFrame(columns=["QueQuan", "so_luong"])


def get_paginated_students(
    db: Session,
    page: int = 1,
    pageSize: int = 50,
    sort: str = "score_desc",
    major: str = None,
    province: str = None
) -> dict:
    """
    Lấy danh sách sinh viên phân trang phục vụ frontend (StudentTable.jsx)
    """
    limit = min(pageSize, 100)
    offset = (page - 1) * limit
    
    query = db.query(
        ViewPhanTichTuyenSinh.CCCD.label("cccd"),
        ViewPhanTichTuyenSinh.HoTen.label("hoTen"),
        ViewPhanTichTuyenSinh.GioiTinh.label("gioiTinh"),
        ViewPhanTichTuyenSinh.QueQuan.label("queQuan"),
        ViewPhanTichTuyenSinh.TenNganh.label("tenNganh"),
        ViewPhanTichTuyenSinh.DiemXetTuyen.label("diemXetTuyen")
    )
    
    if major:
        query = query.filter(ViewPhanTichTuyenSinh.TenNganh == major)
    if province:
        query = query.filter(ViewPhanTichTuyenSinh.QueQuan == province)
        
    ALLOWED_SORT = {
        "score_desc": ViewPhanTichTuyenSinh.DiemXetTuyen.desc(),
        "score_asc": ViewPhanTichTuyenSinh.DiemXetTuyen.asc()
    }
    
    sort_column = ALLOWED_SORT.get(sort, ViewPhanTichTuyenSinh.DiemXetTuyen.desc())
    
    total = query.count()
    query = query.order_by(sort_column).limit(limit).offset(offset)
    
    rows = query.all()
    
    data = []
    for row in rows:
        data.append({
            "cccd": row.cccd if row.cccd else "",
            "hoTen": row.hoTen if row.hoTen else "",
            "gioiTinh": row.gioiTinh if row.gioiTinh else "",
            "queQuan": row.queQuan if row.queQuan else "",
            "tenNganh": row.tenNganh if row.tenNganh else "",
            "diemXetTuyen": float(row.diemXetTuyen) if row.diemXetTuyen is not None else 0.0
        })
        
    return {
        "total": total,
        "page": page,
        "pageSize": pageSize,
        "data": data
    }


def get_database_insights(db: Session) -> dict:
    """
    Thống kê tổng quan dựa theo schema SQL 
    Chứa top major, top province, min/max score, histogram bằng SQL CASE
    """
    from sqlalchemy import case
    
    # Top major bằng Average score
    top_major_query = (
        db.query(
            ViewPhanTichTuyenSinh.TenNganh.label("tenNganh"),
            func.avg(ViewPhanTichTuyenSinh.DiemXetTuyen).label("average_score")
        )
        .group_by(ViewPhanTichTuyenSinh.TenNganh)
        .order_by(func.avg(ViewPhanTichTuyenSinh.DiemXetTuyen).desc())
        .limit(1)
        .first()
    )
    top_major = {
        "tenNganh": top_major_query.tenNganh if top_major_query else "N/A",
        "average_score": float(top_major_query.average_score) if top_major_query and top_major_query.average_score is not None else 0.0
    }
    
    # Top province
    top_province_query = (
        db.query(
            ViewPhanTichTuyenSinh.QueQuan.label("queQuan"),
            func.count(ViewPhanTichTuyenSinh.CCCD).label("student_count")
        )
        .group_by(ViewPhanTichTuyenSinh.QueQuan)
        .order_by(func.count(ViewPhanTichTuyenSinh.CCCD).desc())
        .limit(1)
        .first()
    )
    top_province = {
        "queQuan": top_province_query.queQuan if top_province_query else "N/A",
        "student_count": int(top_province_query.student_count) if top_province_query else 0
    }
    
    # Score statistics
    stats_query = (
        db.query(
            func.avg(ViewPhanTichTuyenSinh.DiemXetTuyen).label("average"),
            func.max(ViewPhanTichTuyenSinh.DiemXetTuyen).label("max"),
            func.min(ViewPhanTichTuyenSinh.DiemXetTuyen).label("min")
        )
        .filter(ViewPhanTichTuyenSinh.DiemXetTuyen > 0)
        .first()
    )
    score_statistics = {
        "average": float(stats_query.average) if stats_query and stats_query.average is not None else 0.0,
        "max": float(stats_query.max) if stats_query and stats_query.max is not None else 0.0,
        "min": float(stats_query.min) if stats_query and stats_query.min is not None else 0.0
    }
    
    # Score distribution histogram theo SQL CASE
    distribution_query = (
        db.query(
            case(
                (ViewPhanTichTuyenSinh.DiemXetTuyen.between(18, 20), '18-20'),
                ((ViewPhanTichTuyenSinh.DiemXetTuyen > 20) & (ViewPhanTichTuyenSinh.DiemXetTuyen <= 22), '20-22'),
                ((ViewPhanTichTuyenSinh.DiemXetTuyen > 22) & (ViewPhanTichTuyenSinh.DiemXetTuyen <= 24), '22-24'),
                ((ViewPhanTichTuyenSinh.DiemXetTuyen > 24) & (ViewPhanTichTuyenSinh.DiemXetTuyen <= 26), '24-26'),
                else_='26-30'
            ).label("range"),
            func.count(ViewPhanTichTuyenSinh.CCCD).label("count")
        )
        .group_by("range")
        .all()
    )
    
    score_distribution = []
    for row in distribution_query:
        score_distribution.append({
            "range": row.range,
            "count": int(row.count)
        })
        
    return {
        "top_major": top_major,
        "top_province": top_province,
        "score_statistics": score_statistics,
        "score_distribution": score_distribution
    }
