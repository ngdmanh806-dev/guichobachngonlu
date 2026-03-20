from sqlalchemy import create_engine

engine = create_engine("mysql+pymysql://root:@localhost:3306/neu_tuyensinh")

with engine.connect() as conn:

    print("Connected!")

 