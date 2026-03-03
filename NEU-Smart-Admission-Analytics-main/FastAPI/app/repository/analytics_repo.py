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
