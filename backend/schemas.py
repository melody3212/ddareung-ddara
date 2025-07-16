# 입력/출력 데이터 모양(파이딩) ← Pydantic 스키마(입출력 데이터 구조)
# schemas.py
# 서버로 올 데이터와 서버에서 내려줄 데이터의 모양을 검사

from typing import Optional, List    # ← Optional, List 추가
from pydantic import BaseModel, EmailStr

# 회원가입 
class UserCreate(BaseModel):
    username: str
    email: EmailStr  # 이메일 형식 자동 검증
    password: str

# 로그아웃
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    class Config:
        orm_mode = True  # DB 모델을 그대로 반환 가능

# Pydantic 스키마
class CourseOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    route_data: dict

    class Config:
        orm_mode = True