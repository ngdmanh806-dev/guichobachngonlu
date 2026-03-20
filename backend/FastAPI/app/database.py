from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Thông tin chuẩn của Manh
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:manh26042006@localhost:3306/neu_tuyensinh"

# SỬA Ở ĐÂY: Phải dùng đúng tên biến SQLALCHEMY_DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()