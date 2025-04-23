# FastAPI 진입점 (app 정의 및 라우터)


from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import database, models, schemas, security, jwt_utils
from fastapi.security import OAuth2PasswordBearer

# DB 테이블 생성
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# DB 세션 주입 함수
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1) 회원가입
@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 중복체크
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="이미 등록된 사용자")
    hashed = security.hash_password(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed)
    db.add(db_user); db.commit(); db.refresh(db_user)
    return db_user

# 2) 로그인
@app.post("/login")
def login(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not db_user or not security.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="로그인 실패")
    token = jwt_utils.create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

# 3) 보호된 API 예시
@app.get("/me", response_model=schemas.UserOut)
def read_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt_utils.decode_access_token(token)
        username = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="토큰 오류")
    db_user = db.query(models.User).filter(models.User.username == username).first()
    return db_user