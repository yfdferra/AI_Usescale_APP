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

#Subjects
connection = sqlite3.connect("database/subjects.db")
cursor = connection.cursor()
cursor.execute("""
CREATE TABLE subjects (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name TEXT,
    subject_year TEXT,
    subject_semester TEXT
)""")

entries = [
    ("Mathematics", "2025", "Semester 1"),
    ("Computer Science", "2025", "Semester 2"),
    ("History", "2024", "Semester 2"),
    ("Physics", "2025", "Semester 1"),
]

cursor.executemany(
    """
    INSERT INTO subjects (subject_name, subject_year, subject_semester)
    VALUES (?, ?, ?)
    """,
    entries
)

connection.commit()
connection.close()

connection = sqlite3.connect("database/usescale_rows.db")
cursor = connection.cursor()
## THIS IS THE RELEVANT TABLE FOR IMPLEMENTATION OF USE CASES
cursor.execute("""
CREATE TABLE usescale_entries (
    row_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    usescale_id INTEGER,
    instruction TEXT,
    example TEXT,
    declaration TEXT,
    version TEXT,
    purpose TEXT,
    key_prompts TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (usescale_id) REFERENCES usescales(usescale_id)
)""")

entries = [
    (
        1,
        1, 
        "Idea Generation",  
        "'Generate me a list of 10 concerns regarding coral reef sustainability'",
        "Allowed; all prompts must be submitted",
        "ChatGPT v4.0",
        "Brainstorm possible issues for research",
        "'Generate me a list of 10 concerns regarding coral reef sustainability'"
    ),
    (
        1,
        1,
        "Proofreading",
        "DO NOT SUBMIT PROMPTS FOR PROOFREADING",
        "Not permitted",
        None,
        "Ensure student work is entirely original",
        None
    ),
    (
        1,
        1,
        "Research",
        "'Prompt: summarise the main points of this paper with citations in the format (page number, line number, any figures references)'",
        "Allowed; must cite sources",
        "ChatGPT v4.0",
        "Assist with summarising external sources",
        "'Summarise the main points of this paper...'"
    ),
    (
        2,
        2,
        "Problem Solving",
        "'Solve the equation 2x + 3 = 7 and show all steps'",
        "Allowed; must show work",
        "Wolfram Alpha API",
        "Check problem-solving methodology",
        "'Solve 2x + 3 = 7...'"
    ),
    (
        2,
        2,
        "Concept Explanation",
        "'Explain the concept of derivatives in calculus with examples'",
        "Allowed; must be clear and concise",
        "ChatGPT v4.0",
        "Help explain complex topics",
        "'Explain the concept of derivatives in calculus...'"
    ),
    (
        2,
        2,
        "Graph Interpretation",
        "'Interpret the following graph showing the relationship between x and y coordinates'",
        "Allowed; must reference specific graphs",
        "ChatGPT v4.0",
        "Guide students in understanding graphs",
        "'Interpret the following graph...'"
    ),
]

cursor.executemany(
    """
    INSERT INTO usescale_entries
    (subject_id, usescale_id, instruction, example, declaration, version, purpose, key_prompts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """,
    entries
)

connection.commit()
connection.close()