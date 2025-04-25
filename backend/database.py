# DB 연결 설정 -> SQLAlchemy 엔진/세션/베이스 설정


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
