# DB 테이블 모델 -> ORM 모델(User 등) 정의

from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)        # 자동 번호
    username = Column(String, unique=True, index=True)        # 아이디
    email = Column(String, unique=True, index=True)           # 이메일
    hashed_password = Column(String)                          # 해싱 된 비번
