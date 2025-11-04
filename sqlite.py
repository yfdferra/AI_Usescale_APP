import os

# Remove existing db files
for i in os.listdir('./database'):
    if i.endswith('.db'):
        os.remove('./database/'+i)
        print(f'removed {i}')

import sqlite3

# Create users database
connection = sqlite3.connect("database/users.db")
cursor = connection.cursor()


# Create users table and insert default users
cursor.execute("""
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    user_type TEXT
)""")
# Default user - Admin account
user_list = [
    ("admin", "admin", "admin")
]
# Insert default users
cursor.executemany("INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)", user_list)
connection.commit()

# Create subjects database and insert default subjects
connection = sqlite3.connect("database/subjects.db")
cursor = connection.cursor()
cursor.execute("""
CREATE TABLE subjects (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name TEXT,
    subject_year TEXT,
    subject_semester TEXT
)""")

# Default subject entries
entries = [
    ("English", "2025", "Semester 1"),
    ("Mathematics", "2025", "Semester 2"),
]

# Insert default subjects
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

# Create usescales table and insert default usescales
cursor.execute("""
CREATE TABLE usescales (
    usescale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    user_id INTEGER,
    title TEXT,
    template_type TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
)""")
# Default usescale entries
usescale_list = [
    (1, 1, "Essay Template", "base"),
    (2, 1, "Coding Assessment Template", "base"),
]
# Insert default usescales
cursor.executemany("INSERT INTO usescales (subject_id, user_id, title, template_type) VALUES (?, ?, ?, ?)", usescale_list)
connection.commit()

# Create usescale_entries database and insert default entries
connection = sqlite3.connect("database/usescale_rows.db")
cursor = connection.cursor()

# Create usescale_entries table and insert default usescale entries
cursor.execute("""
CREATE TABLE usescale_entries (
    row_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    usescale_id INTEGER,
    entry_id INTEGER,
    assessment_task TEXT,
    ai_title TEXT,
    instruction TEXT,
    example TEXT,
    declaration TEXT,
    version TEXT,
    purpose TEXT,
    key_prompts TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (usescale_id) REFERENCES usescales(usescale_id),
    FOREIGN KEY (entry_id) REFERENCES srep_entries(entry_id)
)""")

# Default usescale entries
entries = [
    (
        1,
        1, 
        4,
        "Idea Generation",
        "AI FOR LEARNING",  
        "For this written task, you may use AI for general learning: e.g. explaining concepts, creating revision quizzes",
        "Scenario 1 (AI appropriate)",
        None,
        "https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing",
        None,
        None
    ),
    (
        1,
        1,
        2,
        "Proofreading",
        "SOME AI",
        "For this written task, you may use AI tools only for: e.g. basic spelling and grammar checking",
        "Scenario 1 (AI appropriate)/Scenario 2 (AI inappropriate)",
        "Students MUST acknowledge the use of AI by adding a declaration at the end of their submission",
        "https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing",
        None,
        None
    ),
    (
        1,
        1,
        3,
        "Research",
        "MORE AI",
        "For this written task, you may use AI tools only for: e.g. understanding the broad context, rewording",
        "Scenario 1 (AI appropriate)/Scenario 2 (AI inappropriate)",
        "Students MUST acknowledge the use of AI by adding a declaration at the end of their submission",
        "https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing",
        None,
        None
    ),
    (
        2,
        2,
        5,
        "Problem Solving",
        "NO AI",
        "No AI use for this task is allowed",
        None,
        None,
        None,
        None,
        None
    ),
    (
        2,
        2,
        8,
        "Concept Explanation",
        "AI FOR LEARNING",
        "For this coding task, you may use AI for general learning: e.g. finding common coding techniques and processes",
        "Scenario 1 (AI appropriate)",
        None,
        "https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing",
        None,
        None
    ),
    (
        2,
        2,
        7,
        "Graph Interpretation",
        "MORE AI",
        "For this coding task, you may use AI tools only for: e.g. debugging code",
        "Scenario 1 (AI appropriate)/Scenario 2 (AI inappropriate)",
        "Students MUST acknowledge the use of AI by adding a declaration at the end of their submission",
        "https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing",
        None,
        None
    ),
]

# Insert default usescale entries
cursor.executemany(
    """
    INSERT INTO usescale_entries
    (subject_id, usescale_id, entry_id, assessment_task, ai_title, instruction, example, declaration, version, purpose, key_prompts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    entries
)

connection.commit()
connection.close()

# database for srep_entry_type
connection = sqlite3.connect("database/srep_entry_type.db")
cursor = connection.cursor()

# Create srep_entry_type table and insert default entry types
cursor.execute("""
CREATE TABLE srep_entry_type (
    entry_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_type_name TEXT
)
""")
# Default entry types
entry_types = [
    ("Written",),
    ("Coding",),
    ("Oral",),
    ("Presentation",),
]
# Insert default entry types
cursor.executemany("""
    INSERT INTO srep_entry_type (entry_type_name)
    VALUES (?)
""", entry_types)

connection.commit()
connection.close()

# database for srep_entries
connection = sqlite3.connect("database/srep_entries.db")
cursor = connection.cursor()

# Create srep_entries table and insert default srep entries
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

# Default srep entries
srep_entries = [
    # Written
    (1, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (1, 'LEVEL R-1', 'SOME AI', 'For this written task, you may use AI tools only for: e.g. basic spelling and grammar checking',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (1, 'LEVEL R-2', 'MORE AI', 'For this written task, you may use AI tools only for: e.g. understanding the broad context, rewording',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (1, 'LEVEL R-3', 'AI FOR LEARNING', 'For this written task, you may use AI for general learning: e.g. explaining concepts, creating revision quizzes',
     'Scenario 1 (AI appropriate)', None, 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),

    # Coding
    (2, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (2, 'LEVEL R-1', 'SOME AI', 'For this coding task, you may use AI tools only for: e.g. code planning, conceptualisation',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (2, 'LEVEL R-2', 'MORE AI', 'For this coding task, you may use AI tools only for: e.g. debugging code',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (2, 'LEVEL R-3', 'AI FOR LEARNING', 'For this coding task, you may use AI for general learning: e.g. finding common coding techniques and processes',
     'Scenario 1 (AI appropriate)', None, 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),

    # Oral
    (3, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (3, 'LEVEL R-1', 'SOME AI', 'For this oral task, you may use AI tools only for: e.g. basic grammar checking',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (3, 'LEVEL R-2', 'MORE AI', 'For this oral task, you may use AI tools only for: e.g. brainstorming, rewording speech',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (3, 'LEVEL R-3', 'AI FOR LEARNING', 'For this oral task, you may use AI for general learning: e.g. researching topic, speech planning steps',
     'Scenario 1 (AI appropriate)', None, 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),

    # Presentation
    (4, 'LEVEL N', 'NO AI', 'No AI use for this task is allowed', None, None, None, None, None),
    (4, 'LEVEL R-1', 'SOME AI', 'For this presentation task, you may use AI tools only for: e.g. basic spelling and grammar checking',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (4, 'LEVEL R-2', 'MORE AI', 'For this presentation task, you may use AI tools only for: e.g. brainstorming, layout ideas',
     'Scenario 1 (AI appropriate)\nScenario 2 (AI inappropriate)',
     'Students MUST acknowledge the use of AI by adding a declaration at the end of their submission', 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
    (4, 'LEVEL R-3', 'AI FOR LEARNING', 'For this presentation task, you may use AI for general learning: e.g. researching topic, presentation tips, presentation design',
     'Scenario 1 (AI appropriate)', None, 'https://students.unimelb.edu.au/academic-skills/resources/reading,-writing-and-referencing/referencing-and-research/paraphrasing', None, None),
]

# Insert default srep entries
cursor.executemany("""
    INSERT INTO srep_entries
    (entry_type_id, ai_level, ai_title, instruction, example, declaration, version, purpose, key_prompts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
""", srep_entries)


connection.commit()
connection.close()


# Create notifications database for tracking changes
connection = sqlite3.connect("database/notifications.db")
cursor = connection.cursor()

# Create notifications table
cursor.execute("""
CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    row_id INTEGER NOT NULL,
    prev_data TEXT NOT NULL,
    curr_data TEXT NOT NULL,
    FOREIGN KEY (entry_id) REFERENCES srep_entries(entry_id),
    FOREIGN KEY (row_id) REFERENCES usescale_rows(row_id)
)
""")

connection.commit()
connection.close()