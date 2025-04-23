# 입력/출력 데이터 모양(파이딩) ← Pydantic 스키마(입출력 데이터 구조)

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True  # DB 모델을 그대로 반환 가능