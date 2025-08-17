import sqlite3

connection = sqlite3.connect("database/users.db")
cursor = connection.cursor()

cursor.execute("create table users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)")

user_list = [
    ("admin", "admin"),
]

cursor.executemany("INSERT INTO users (username, password) VALUES (?, ?)", user_list)
connection.commit()

for row in cursor.execute("select * from users"):
    print(row)

connection.close()