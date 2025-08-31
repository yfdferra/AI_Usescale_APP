import os
import sqlite3
import json

for i in os.listdir('./database'):
    if i.endswith('.db'):
        os.remove('./database/'+i)
        print(f'removed {i}')

# Users
conn_users = sqlite3.connect("database/users.db")
cursor_users = conn_users.cursor()
cursor_users.execute("""
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
""")
cursor_users.executemany(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [("admin", "admin")]
)
conn_users.commit()

#Usescales
conn_usescales = sqlite3.connect("database/usescales.db")
cursor_usescales = conn_usescales.cursor()
cursor_usescales.execute("""
CREATE TABLE usescales (
    usescaleID INTEGER PRIMARY KEY AUTOINCREMENT,
    universityID INTEGER,
    version REAL,
    usescaleName TEXT,
    usescaleJson TEXT
)
""")

sample_usecases = [
    {
        "category": "Idea Generation",
        "description": "Permitted but needs to be declared",
        "comments": "Generate me a list of concerns about coral reef damage"
    },
    {
        "category": "Proofreading",
        "description": "Not permitted",
        "comments": "DO NOT SUBMIT PROMPTS FOR PROOFREADING"
    },
    {
        "category": "Research",
        "description": "Permitted; must cite sources",
        "comments": "Summarise the main points of this paper with citations"
    }
]

cursor_usescales.executemany(
    "INSERT INTO usescales (universityID, version, usescaleName, usescaleJson) VALUES (?, ?, ?, ?)",
    [
        (1, 1.0, "Mathematics", json.dumps(sample_usecases)),
        (1, 2.0, "Biology", json.dumps(sample_usecases))
    ]
)
conn_usescales.commit()

cursor_usescales.execute("SELECT * FROM usescales")
rows = cursor_usescales.fetchall()

# Convert rows to dictionary list
usescales_list = []
for row in rows:
    usescale_dict = {
        "usescaleID": row[0],
        "universityID": row[1],
        "version": row[2],
        "usescaleName": row[3],
        "usescaleJson": json.loads(row[4])
    }
    usescales_list.append(usescale_dict)

print(json.dumps(usescales_list, indent=4))

# Close connection
conn_usescales.close()


# TEMPLATES
conn_templates = sqlite3.connect("database/templates.db")
cursor_templates = conn_templates.cursor()

# Create templates table
cursor_templates.execute("""
CREATE TABLE templates (
    templateID INTEGER PRIMARY KEY AUTOINCREMENT,
    accountID INTEGER,
    templateName TEXT,
    templateJson TEXT
)
""")

# Sample template JSON
sample_template_json = [
    {
        "category": "Idea Generation",
        "description": "Permitted but needs to be declared",
        "comments": "Generate me a list of concerns about coral reef damage"
    },
    {
        "category": "Proofreading",
        "description": "Not permitted",
        "comments": "DO NOT SUBMIT PROMPTS FOR PROOFREADING"
    },
    {
        "category": "Research",
        "description": "Permitted; must cite sources",
        "comments": "Summarise the main points of this paper with citations"
    }
]

# Insert sample templates
cursor_templates.executemany(
    "INSERT INTO templates (accountID, templateName, templateJson) VALUES (?, ?, ?)",
    [
        (1, "Mathematics Template", json.dumps(sample_template_json)),
        (1, "Biology Template", json.dumps(sample_template_json))
    ]
)
conn_templates.commit()

# Fetch and print templates neatly
cursor_templates.execute("SELECT * FROM templates")
rows = cursor_templates.fetchall()

templates_list = []
for row in rows:
    templates_list.append({
        "templateID": row[0],
        "accountID": row[1],
        "templateName": row[2],
        "templateJson": json.loads(row[3])
    })

print(json.dumps(templates_list, indent=4))

# Close connection
conn_templates.close()