# 토큰 만들고 검증하는 함수 ← JWT 토큰 생성·검증 로직

# jwt_utils.py

from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status

SECRET_KEY = "여기에-매우-긴-비밀-문자열"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1일

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """
    JWT 토큰을 디코딩하여 payload를 반환.
    실패 시 HTTPException을 발생시켜 401로 처리합니다.
    """
    try:
        # 여기서 payload에 'exp' 체크, 서명 검증까지 모두 수행됩니다.
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        # 디코딩 또는 검증 실패 시 401 Unauthorized
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다."
        )
