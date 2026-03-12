from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Thay đổi user và password tại đây / Enter your user and password here
DB_USER = "YOUR_USERNAME"
DB_PASSWORD = "YOUR_PASSWORD"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "dulieusinhvien"

# Kết nối tới MySQL
# Notice there is nothing between root: and @localhost
DATABASE_URL = "mysql+pymysql://root:vuthebach@localhost:3306/dulieusinhvien"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency function để lấy database session cho FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
