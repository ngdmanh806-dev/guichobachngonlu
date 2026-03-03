from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analytics
from app.core.database import Base, engine

# Tạo bảng nếu chưa có (trong thực tế nên dùng Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Admission Analytics API")

# Cấu hình CORS để React gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Admission Analytics API"}