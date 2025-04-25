# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import database
import models
import schemas
import security
import jwt_utils

# 1) FastAPI 앱 생성
app = FastAPI()

# 2) CORS 미들웨어 설정: Vite 개발 서버(5173)에서 오는 모든 요청 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 허용할 출처
    allow_credentials=True,
    allow_methods=["*"],                      # OPTIONS, GET, POST 등 모두 허용
    allow_headers=["*"],                      # 모든 헤더 허용
)

# 3) 데이터베이스 테이블 자동 생성
models.Base.metadata.create_all(bind=database.engine)

# 4) OAuth2PasswordBearer 인스턴스 (토큰 URL 지정)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# 5) DB 세션 제공 함수
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 6) 회원가입 엔드포인트
@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 6.1) 사용자명 중복 체크
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="이미 등록된 사용자입니다.")
    # 6.2) 비밀번호 해싱
    hashed_pw = security.hash_password(user.password)
    # 6.3) DB에 새 사용자 저장
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 7) 로그인 엔드포인트
@app.post("/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                           db: Session = Depends(get_db)): #로그인 폼은 따로 요청 (회원가입과 다름)
    # 7.1) 사용자 조회
    db_user = db.query(models.User).filter(models.User.username == form_data.username).first()
    # 7.2) 비밀번호 검증
    if not db_user or not security.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="로그인 정보가 올바르지 않습니다.")
    # 7.3) 액세스 토큰 생성
    access_token = jwt_utils.create_access_token({"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# 8) 보호된 API 예시: 내 정보 조회
@app.get("/me", response_model=schemas.UserOut)
def read_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # 8.1) 토큰 디코딩 및 사용자명 추출
        payload = jwt_utils.decode_access_token(token)
        username = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 토큰입니다.")
    # 8.2) DB에서 사용자 조회
    db_user = db.query(models.User).filter(models.User.username == username).first()
    return db_user
