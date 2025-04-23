# DB 연결 설정 -> SQLAlchemy 엔진/세션/베이스 설정

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite 파일로 DB 저장
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# 커넥션(접속) 만들기
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# 세션팩토리(=DB 다루는 창구) 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 모델 클래스의 베이스
Base = declarative_base()
