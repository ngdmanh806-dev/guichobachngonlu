from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.routers import analytics, ui
import traceback
import sys

app = FastAPI(title="Admission Analytics API")

# 1. CẤU HÌNH CORS (Cho phép cả cổng 3000 và 3001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. HÀM CATCH ERROR (Bắt mọi lỗi và in ra Terminal)
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        err_type, err_value, err_traceback = sys.exc_info()
        full_error = traceback.format_exception(err_type, err_value, err_traceback)
        
        print("\n" + "="*50)
        print("🚨 PHÁT HIỆN LỖI BACKEND:")
        print(f"📍 Path: {request.url.path}")
        print(f"📝 Lỗi: {str(e)}")
        print("🔍 Chi tiết dòng code bị lỗi:")
        print("".join(full_error[-3:])) 
        print("="*50 + "\n")
        
        return JSONResponse(
            status_code=500,
            content={"detail": f"Lỗi hệ thống: {str(e)}", "path": request.url.path}
        )

# 3. KẾT NỐI ROUTERS
app.include_router(analytics.router)
app.include_router(ui.router)

# 4. CÁC ĐƯỜNG DẪN PHỤ (Để Dashboard hiện biểu đồ, tránh lỗi 404)
@app.get("/analytics/majors")
@app.get("/analytics/provinces")
@app.get("/analytics/gender")
@app.get("/analytics/scores")
@app.get("/analytics/trends")
def get_charts_proxy(year: int = 2024, db: Session = Depends(analytics.get_db)):
    # Trỏ thẳng về hàm xử lý biểu đồ trong file analytics của bạn
    return analytics.get_chart_analytics(year, db)

@app.get("/students")
def get_students_proxy(page: int = 1, pageSize: int = 50, db: Session = Depends(analytics.get_db)):
    # Trỏ về hàm lấy danh sách sinh viên
    return analytics.get_students(page, pageSize, db=db)

@app.get("/")
def read_root():
    return {"message": "Welcome to Admission Analytics API - NEU"}