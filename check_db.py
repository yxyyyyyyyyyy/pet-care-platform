import sqlite3

conn = sqlite3.connect('backend/instance/pet_care.db')
cursor = conn.cursor()

print('=== 数据库表结构 ===')
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
for table in cursor.fetchall():
    print(f'  - {table[0]}')

print('\n=== user表结构 ===')
cursor.execute('PRAGMA table_info(user)')
for col in cursor.fetchall():
    print(f'  {col[1]} ({col[2]})')

print('\n=== 用户数据 ===')
cursor.execute('SELECT * FROM user')
for row in cursor.fetchall():
    print(f'  ID:{row[0]} 用户名:{row[1]} 邮箱:{row[3]}')

print('\n=== pet表结构 ===')
cursor.execute('PRAGMA table_info(pet)')
for col in cursor.fetchall():
    print(f'  {col[1]} ({col[2]})')

print('\n=== 宠物数据 ===')
cursor.execute('SELECT * FROM pet')
for row in cursor.fetchall():
    print(f'  ID:{row[0]} 名字:{row[2]} 品种:{row[3]} 年龄:{row[5]} 体重:{row[6]}')

print('\n=== care_record表结构 ===')
cursor.execute('PRAGMA table_info(care_record)')
for col in cursor.fetchall():
    print(f'  {col[1]} ({col[2]})')

print('\n=== 养护记录数据 ===')
cursor.execute('SELECT * FROM care_record')
for row in cursor.fetchall():
    print(f'  ID:{row[0]} 宠物ID:{row[1]} 类型:{row[2]} 日期:{row[4]}')

conn.close()
