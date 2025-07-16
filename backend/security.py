# 비밀번호 해싱 함수 ← 비밀번호 해싱/검증 함수
# 평문 비번을 암호화 -> DB에 저장
# 로그인 때는 암호화된 비번과 비교

from passlib.context import CryptContext

# bcrypt 알고리즘 사용
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """회원가입 시 평문 비밀번호를 해싱"""
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """로그인 시 평문 비밀번호와 해시를 비교"""
    return pwd_context.verify(plain, hashed)
