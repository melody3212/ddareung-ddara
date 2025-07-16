# DB 연결 설정 -> SQLAlchemy을 사용하여 SQLite 데베와 연결,
#  엔진/세션/베이스 설정
# 컴퓨터 안에 test.db 파일을 만들고, 그 파일과 대화를 주고받을 준비를 함 

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1) 데이터베이스 URL: 로컬 파일 기반 SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# 2) 엔진 생성: SQLite에 연결
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite 전용 옵션
)

# 3) 세션 팩토리: DB 작업 시마다 새 세션을 생성
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# 4) 모델(Base) 선언용 클래스
Base = declarative_base()
