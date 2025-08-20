import os
for i in os.listdir('./database'):
    if i.endswith('.db'):
        os.remove('./database/'+i)
        print(f'removed {i}')

import sqlite3

connection = sqlite3.connect("database/users.db")
cursor = connection.cursor()


# Accounts
cursor.execute("create table users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)")
user_list = [
    ("admin", "admin"),
]
cursor.executemany("INSERT INTO users (username, password) VALUES (?, ?)", user_list)
connection.commit()



#  Usescales
connection = sqlite3.connect("database/usescales.db")
cursor = connection.cursor()

cursor.execute("create table usescales (usescale_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)")
usescale_list = [
    ("Essay Template",),
    ( "Mathematics Template",),
]
cursor.executemany("INSERT INTO usescales (title) VALUES (?)", usescale_list)
connection.commit()

# for row in cursor.execute("select * from users"):
#     print(row)

connection.close()