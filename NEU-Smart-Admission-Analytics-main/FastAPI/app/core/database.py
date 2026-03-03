from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Chuỗi kết nối MySQL (mật khẩu có ký tự @28 đã được encode thành %4028)
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:manhwillnotxuixeo%4028@127.0.0.1:3306/neu_tuyensinh"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
