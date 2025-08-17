import sqlite3

connection = sqlite3.connect("database/users.db")
cursor = connection.cursor()

for row in cursor.execute("select * from users"):
    print(row)

connection.close()