import os
for i in os.listdir('./database'):
    if i.endswith('.db'):
        os.remove('./database/'+i)
        print(f'removed {i}')

import sqlite3

connection = sqlite3.connect("database/users.db")
cursor = connection.cursor()


# Accounts
cursor.execute("""
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)""")

user_list = [
    ("admin", "admin"),
]
cursor.executemany("INSERT INTO users (username, password) VALUES (?, ?)", user_list)
connection.commit()


#  Usescales
connection = sqlite3.connect("database/usescales.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE usescales (
    usescale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT
)""")
usescale_list = [
    ("Essay Template",),
    ( "Mathematics Template",),
]
cursor.executemany("INSERT INTO usescales (title) VALUES (?)", usescale_list)
connection.commit()


connection = sqlite3.connect("database/usescale_rows.db")
cursor = connection.cursor()
## THIS IS THE RELEVANT TABLE FOR IMPLEMENTATION OF USE CASES
cursor.execute("""
CREATE TABLE usescale_entries (
    row_id INTEGER PRIMARY KEY AUTOINCREMENT,
    usescale_id INTEGER,
    category TEXT,
    description TEXT,
    comments TEXT,
    FOREIGN KEY (usescale_id) REFERENCES usescales(usescale_id)
)""")

entries = [
    (1, "Idea Generation", "Allowed; all prompts must be submitted", "'Generate me a list of 10 concerns regarding coral reef sustainability'"),
    (1, "Proofreading", "Not permitted", "DO NOT SUBMIT PROMPTS FOR PROOFREADING"),
    (1, "Research", "Allowed; must cite sources", "'Prompt: summarise the main points of this paper with citations in the format (page number, line number, any figures references)'"),
    (2, "Problem Solving", "Allowed; must show work", "'Solve the equation 2x + 3 = 7 and show all steps'"),
    (2, "Concept Explanation", "Allowed; must be clear and concise", "'Explain the concept of derivatives in calculus with examples'"),
    (2, "Graph Interpretation", "Allowed; must reference specific graphs", "'Interpret the following graph showing the relationship between x and y coordinates'"),
]

cursor.executemany(
    "INSERT INTO usescale_entries (usescale_id, category, description, comments) VALUES (?, ?, ?, ?)",
    entries
)

connection.commit()
connection.close()

# for row in cursor.execute("select * from users"):
#     print(row)

connection.close()