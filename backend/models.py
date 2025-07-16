# DB 테이블 모델 구조 -> 파이썬 클래스(User)로 선언
#  SQLAlchemy가 이 클래스를 기반으로 테이블을 생성·조회
# 사이트에 가입한 사람들의 정보를 저장할 테이블 모양을 정함

from sqlalchemy import Column, Integer, String, JSON
from database import Base

# user data
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)        # 자동 번호
    username = Column(String, unique=True, index=True)        # 아이디
    email = Column(String, unique=True, index=True)           # 이메일
    hashed_password = Column(String)                          # 해싱 된 비번


# course data
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    route_data = Column(JSON)  # 지도용 경로 정보
