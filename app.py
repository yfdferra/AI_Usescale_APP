from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return render_template("home/index.html")

# returns the user's use scales
@app.route("/usecase")
def usecase():
    connection = sqlite3.connect("database/usescale_rows.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    subject_id = request.args.get("usescale_id")
    cursor.execute("SELECT * FROM usescale_entries WHERE usescale_id = (?)", (subject_id,))
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]

    connection.close()
    return jsonify(data)




@app.route("/get_subject_info", methods=["GET"])
def get_subject_info():
    subject_id = request.args.get("subject_id")
    if not subject_id:
        return jsonify({"error": "No subject_id provided"}), 400

    connection = sqlite3.connect("database/subjects.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM subjects WHERE subject_id = ?", (subject_id,)
    )
    row = cursor.fetchone()
    connection.close()

    if row:
        return jsonify(dict(row))
    else:
        return jsonify({"error": "Subject not found"}), 404



# modified this function to save the title
@app.route('/save_template', methods=['POST'])
def save_template():
    data = request.get_json()
    usescale_id = data.get('usescale_id')
    subject_id = data.get('subject_id')
    title = data.get('title')
    rows = data.get('rows')

    try:
        # first update the title in the usescales table
        connection = sqlite3.connect("database/usescales.db") 
        cursor = connection.cursor()
        cursor.execute(
            # update the use scale title in db
            "UPDATE usescales SET title = ? WHERE usescale_id = ?",
            (title, usescale_id)
        )
        connection.commit()
        connection.close()

        

        connection = sqlite3.connect("database/usescale_rows.db")
        cursor = connection.cursor()
        cursor.execute(
            "DELETE FROM usescale_entries WHERE usescale_id = ? AND subject_id = ?",
            (usescale_id, subject_id)
        )

        # Insert new rows
        for row in rows:
            cursor.execute(
                """
                INSERT INTO usescale_entries (
                    subject_id, usescale_id, assessment_task, ai_title, instruction, example, declaration,
                    version, purpose, key_prompts
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    subject_id,
                    usescale_id,
                    row.get('assessment_task'),
                    row.get('ai_title'),
                    row.get('instruction'),
                    row.get('example'),
                    row.get('declaration'),
                    row.get('version'),
                    row.get('purpose'),
                    row.get('key_prompts'),
                )
            )

        connection.commit()
        connection.close()

        return jsonify({"success": True, "message": "Template saved successfully!"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


# just editting title
@app.route('/update_title', methods=["POST"])
def update_title():
    data = request.get_json()
    usescale_id = data.get('usescale_id')
    title = data.get('title')

    if not usescale_id or not title:
        return jsonify({"success": False, "error":  "missing usescale id or title"})
    
    try:
        connection = sqlite3.connect("database/usescales.db")
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE usescales SET title = ? WHERE usescale_id = ?",
            (title, usescale_id)
        )

        connection.commit()
        connection.close()

        return jsonify({"success": True, "message": "Title updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


# deleting templates from homepage
@app.route('/delete_template', methods=["POST"])
def delete_template():
    data = request.get_json()
    usescale_id = data.get('usescale_id')

    if not usescale_id:
        return jsonify({"success": False, "error": "missing usescale id"})
    
    try:
        # delete from usescales db
        connection = sqlite3.connect("database/usescales.db")
        cursor = connection.cursor()
        cursor.execute("DELETE FROM usescales WHERE usescale_id = ?", (usescale_id,))
        connection.commit()
        connection.close()

        # also delete associated rows in usescale_rows
        connection_rows = sqlite3.connect("database/usescale_rows.db")
        cursor_rows = connection_rows.cursor()
        cursor_rows.execute("DELETE FROM usescale_entries WHERE usescale_id = ?", (usescale_id,))
        connection_rows.commit()
        connection_rows.close()

        return jsonify({"success": True, "message": "template deleted successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    

# makeing a copy of templates from homepage
@app.route('/copy_template', methods=["POST"])
def copy_template():
    data = request.get_json()
    usescale_id = data.get('usescale_id')

    if not usescale_id:
        return jsonify({"success": False, "error": "missing usescale id"})
    
    try:
        # copy template title
        connection = sqlite3.connect("database/usescales.db")
        cursor = connection.cursor()
        cursor.execute("SELECT title FROM usescales WHERE usescale_id=?", (usescale_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"success": False, "error": "template not found"})
        
        old_title = row[0]
        new_title = f"{old_title} (Copy)"

        cursor.execute(
            "INSERT INTO usescales (title) VALUES (?)",
            (new_title,)
        )
        new_usescale_id = cursor.lastrowid
        connection.commit()
        connection.close()

        # copy associated rows
        connection_rows = sqlite3.connect("database/usescale_rows.db")
        cursor_rows = connection_rows.cursor()
        cursor_rows.execute("SELECT * FROM usescale_entries WHERE usescale_id=?", (usescale_id,))
        entries = cursor_rows.fetchall()

        for entry in entries:
            _, subject_id, _, assessment_task, ai_title, instruction, example, declaration, version, purpose, key_prompts = entry
            cursor_rows.execute(
                """
                INSERT INTO usescale_entries (
                    subject_id, usescale_id, assessment_task, ai_title, instruction, example, declaration, 
                    version, purpose, key_prompts
                )           
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)   
                """,
                (subject_id, new_usescale_id, assessment_task, ai_title, instruction, example, declaration, version, purpose, key_prompts)
                
            )
        connection_rows.commit()
        connection_rows.close()

        return jsonify({"success": True, "new_usescale_id": new_usescale_id, "new_title": new_title})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
    
    

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    connection = sqlite3.connect("database/users.db")
    cursor = connection.cursor()

    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    account = cursor.fetchone()
    cursor.close()

    if account is None:
        return jsonify({"logged_in": False})
    dbPassword = account[0]

    if (password == dbPassword):
        return jsonify({"logged_in": True})
    else:
        return jsonify({"logged_in": False})
    

@app.route("/data", methods=["GET"])
def getdata():
    connection = sqlite3.connect("database/users.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    connection.close()
    return jsonify(data)

@app.route("/get_use_scales", methods=["GET"])
def get_usescales():
    connection = sqlite3.connect("database/usescales.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM usescales")
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    connection.close()
    return jsonify(data)

@app.route("/get_usescale_rows", methods=["GET"])
def get_usescale_rows():
    usescale_id = request.args.get("usescale_id")
    connection = sqlite3.connect("database/usescale_rows.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM usescale_entries WHERE usescale_id = ?", (usescale_id,))
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    connection.close()
    return jsonify(data)

# update this function to create a new entry in usescales db
@app.route("/create_template", methods=["POST"])
def create_template():
    info = request.get_json()
    title = info.get("title", "Untitled Template")  # default title
    subject_id = info.get("subject_id")  # optional

    new_id = None  # will store the new usescale id

    # --- Insert into usescales.db ---
    try:
        connection_usescales = sqlite3.connect("database/usescales.db")
        cursor_usescales = connection_usescales.cursor()

        cursor_usescales.execute(
            "INSERT INTO usescales (subject_id, title) VALUES (?, ?)",
            (subject_id, title)
        )
        connection_usescales.commit()
        new_id = cursor_usescales.lastrowid

    except Exception as e:
        print("ERROR inserting into usescales:", e)
        return jsonify({"success": False, "message": f"Error inserting into usescales: {str(e)}"})

    finally:
        cursor_usescales.close()
        connection_usescales.close()

    # --- Success response ---
    return jsonify({
        "success": True,
        "message": "Template created successfully",
        "usescale_id": new_id,
        "title": title
    })



# testing react and flask connetion 
@app.route("/api/ping")
def ping():
    return jsonify({"message": "pong"})


# get the srep entries from database and send to front end
@app.route("/entries", methods=["GET"])
def get_entries():
    # connect to srep entry types database
    conn_types = sqlite3.connect("database/srep_entry_type.db")
    conn_types.row_factory = sqlite3.Row
    cur_types = conn_types.cursor()
    
    cur_types.execute("SELECT entry_type_id, title FROM entry_types ORDER BY entry_type_id")
    entry_types = cur_types.fetchall()
    conn_types.close()

    # connect to srep entries database
    conn_entries = sqlite3.connect("database/srep_entries.db")
    conn_entries.row_factory = sqlite3.Row
    cur_entries = conn_entries.cursor()

    result = []
    for et in entry_types:
        cur_entries.execute("""
            SELECT ai_level, ai_title, instruction, example, declaration, version, purpose, key_prompts
            FROM srep_entries
            WHERE entry_type_id = ?
            ORDER BY entry_id
        """, (et["entry_type_id"],))
        entries = cur_entries.fetchall()
        entries_list = [dict(e) for e in entries]

        result.append({
            "entry_type_id": et["entry_type_id"],
            "title": et["title"],
            "entries": entries_list
        })

    conn_entries.close()
    return jsonify(result)