# backend/db_check.py
import sqlite3

conn = sqlite3.connect("test.db")    # 또는 실제 .db 파일 이름
cur  = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables:", cur.fetchall())

cur.execute("SELECT * FROM users;")
print("Users:", cur.fetchall())

conn.close()
