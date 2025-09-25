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
    password TEXT,
    user_type TEXT
)""")

user_list = [
    ("admin", "admin", "admin"),
    ("lulu", "lulu", "coordinator")
]
cursor.executemany("INSERT INTO users (username, password) VALUES (?, ?)", user_list)
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
    ("English", "2025", "Semester 1"),
    ("Mathematics", "2025", "Semester 2"),
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


#  Usescales
connection = sqlite3.connect("database/usescales.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE usescales (
    usescale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    title TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
)""")
usescale_list = [
    (1, "Essay Template"),
    (2, "Mathematics Template"),
]
cursor.executemany("INSERT INTO usescales (subject_id, title) VALUES (?, ?)", usescale_list)
connection.commit()


connection = sqlite3.connect("database/usescale_rows.db")
cursor = connection.cursor()
## THIS IS THE RELEVANT TABLE FOR IMPLEMENTATION OF USE CASES
cursor.execute("""
CREATE TABLE usescale_entries (
    row_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    usescale_id INTEGER,
    assessment_task TEXT,
    ai_title TEXT,
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
        None,
        None,
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
        None,
        None,
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
        None,
        None,
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
        None,
        None,
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
        None,
        None,
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
        None,
        None,
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
    (subject_id, usescale_id, assessment_task, ai_title, instruction, example, declaration, version, purpose, key_prompts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    entries
)

connection.commit()
connection.close()

# for the srep entry types
connection = sqlite3.connect("database/srep_entry_type.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE srep_entry_type (
    entry_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_type_name TEXT
)
""")

entry_types = [
    ("Written",),
    ("Coding",),
    ("Oral",),
    ("Presentation",),
]

cursor.executemany("""
    INSERT INTO srep_entry_type (entry_type_name)
    VALUES (?)
""", entry_types)

connection.commit()
connection.close()

# for the srep_entries 
connection = sqlite3.connect("database/srep_entries.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE srep_entries (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_type_id INTEGER,
    ai_level TEXT,
    ai_title TEXT,
    instruction TEXT,
    example TEXT,
    declaration TEXT,
    version TEXT,
    purpose TEXT,
    key_prompts TEXT
)
""")

srep_entries = [
    # Written
    (1, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (1, 'LEVEL R-1', 'SOME AI', 'For this written task, you may use AI tools only for: e.g. basic spelling and grammar checking',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (1, 'LEVEL R-2', 'MORE AI', 'For this written task, you may use AI tools only for: e.g. understanding the broad context, rewording',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (1, 'LEVEL R-3', 'GENERATIVE AI', 'For this written task, you may use AI for general learning: e.g. explaining concepts, creating revision quizzes',
     'Scenario 1 (AI appropriate)', None, None, None, None),

    # Coding
    (2, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (2, 'LEVEL R-1', 'SOME AI', 'For this coding task, you may use AI tools only for: e.g. code planning, conceptualisation',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (2, 'LEVEL R-2', 'MORE AI', 'For this coding task, you may use AI tools only for: e.g. debugging code',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (2, 'LEVEL R-3', 'GENERATIVE AI', 'For this coding task, you may use AI for general learning: e.g. finding common coding techniques and processes',
     'Scenario 1 (AI appropriate)', None, None, None, None),

    # Oral
    (3, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (3, 'LEVEL R-1', 'SOME AI', 'For this oral task, you may use AI tools only for: e.g. basic grammar checking',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (3, 'LEVEL R-2', 'MORE AI', 'For this oral task, you may use AI tools only for: e.g. brainstorming, rewording speech',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (3, 'LEVEL R-3', 'GENERATIVE AI', 'For this oral task, you may use AI for general learning: e.g. researching topic, speech planning steps',
     'Scenario 1 (AI appropriate)', None, None, None, None),

    # Presentation
    (4, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (4, 'LEVEL R-1', 'SOME AI', 'For this presentation task, you may use AI tools only for: e.g. basic spelling and grammar checking',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (4, 'LEVEL R-2', 'MORE AI', 'For this presentation task, you may use AI tools only for: e.g. brainstorming, layout ideas',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', None, None, None),
    (4, 'LEVEL R-3', 'GENERATIVE AI', 'For this presentation task, you may use AI for general learning: e.g. researching topic, presentation tips, presentation design',
     'Scenario 1 (AI appropriate)', None, None, None, None),
]

cursor.executemany("""
    INSERT INTO srep_entries
    (entry_type_id, ai_level, ai_title, instruction, example, declaration, version, purpose, key_prompts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
""", srep_entries)


connection.commit()
connection.close()


