import pandas as pd
from typing import Dict, Any

def format_major_admission_chart(df: pd.DataFrame) -> Dict[str, Any]:
    """Tạo biểu đồ cột kép (Grouped Bar Chart) so sánh Chỉ tiêu vs Thực tế"""
    if df.empty:
        return {"labels": [], "datasets": []}
        
    return {
        "labels": df["TenNganh"].tolist(),
        "datasets": [
            {
                "label": "Chỉ tiêu",
                "data": df["ChiTieu"].tolist(),
                "backgroundColor": "#D1D5DB" # Màu xám
            },
            {
                "label": "Đã nhập học",
                "data": df["so_luong_nhap_hoc"].tolist(),
                "backgroundColor": "#3B82F6" # Màu xanh dương
            }
        ]
    }

def format_province_pie_chart(df: pd.DataFrame) -> Dict[str, Any]:
    """Tạo biểu đồ tròn (Pie chart) cho top 5 tỉnh thành, phần còn lại gộp vào 'Khác'"""
    if df.empty:
        return {"labels": [], "datasets": []}
    
    # Gom nhóm nếu có quá nhiều tỉnh (lấy top 5, còn lại là "Khác")
    if len(df) > 5:
        top_5 = df.head(5)
        others = pd.DataFrame({
            "QueQuan": ["Khác"], 
            "so_luong": [df["so_luong"][5:].sum()]
        })
        df = pd.concat([top_5, others], ignore_index=True)

    return {
        "labels": df["QueQuan"].tolist(),
        "datasets": [{
            "label": "Số lượng",
            "data": df["so_luong"].tolist(),
            "backgroundColor": ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#E7E9ED"]
        }]
    }