from sqlalchemy import create_engine

engine = create_engine(
    "mysql+pymysql://root:vuthebach@localhost:3306/dulieusinhvien"
)

with engine.connect() as conn:
    print("Connected!")
