from pydantic import BaseModel
from typing import Optional, Dict, List, Union

# Base schema chứa các trường chung
class AdmissionBase(BaseModel):
    student_name: str
    province: str
    school: str
    major_group: str
    math: float
    literature: float
    english: float
    total_score: float
    year: int

# Schema dùng khi tạo mới (Yêu cầu đầy đủ thông tin như Base)
class AdmissionCreate(AdmissionBase):
    pass

# Schema dùng khi update (Các trường có thể bỏ trống nếu không muốn sửa)
class AdmissionUpdate(BaseModel):
    student_name: Optional[str] = None
    province: Optional[str] = None
    school: Optional[str] = None
    major_group: Optional[str] = None
    math: Optional[float] = None
    literature: Optional[float] = None
    english: Optional[float] = None
    total_score: Optional[float] = None
    year: Optional[int] = None

# Schema dùng để trả kết quả về (Có thêm ID sinh ra từ DB)
class AdmissionResponse(AdmissionBase):
    id: int

    class Config:
        from_attributes = True  # Thay thế cho orm_mode = True trong Pydantic V2


class SummaryStats(BaseModel):
    total_students: int
    avg_score: float
    top_province: str
    total_schools: int


class ChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Union[str, int, float, List[Union[str, int, float]]]]]


class AnalyticsResponse(BaseModel):
    summary: SummaryStats
    charts: Dict[str, ChartData]


class AnalyticsSummary(BaseModel):
    total_students: int
    avg_thpt_total: float
    avg_hsa_total: float
    avg_tsa_total: float
    top_province: str
    total_majors: int
    hsa_admission_rate: float
    ielts_rate: float
    avg_ielts: float


class MajorAdmissionItem(BaseModel):
    major_name: str
    quota: int
    admitted: int
    fulfillment_rate: float


class ProvinceCountItem(BaseModel):
    province: str
    student_count: int


class DashboardCharts(BaseModel):
    admission_by_major: ChartData
    demographics_by_province: ChartData
    score_distribution: ChartData
    thpt_subject_analysis: ChartData


class DashboardAnalyticsResponse(BaseModel):
    year: int
    summary: AnalyticsSummary
    charts: DashboardCharts
    top_majors: List[MajorAdmissionItem]
    top_provinces: List[ProvinceCountItem]