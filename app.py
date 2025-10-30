from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import json


app = Flask(__name__)
CORS(app)

"""
This module contains all Flask route handlers and back-end functions
that interact with the SQLite database for the application
"""

# Test react and flask connection
@app.route("/api/ping")
def ping():
    return jsonify({"message": "pong"})


# Find all use scale rows of a specific usescale id
@app.route("/usecase")
def usecase():
    """
    Retrieves all use scale rows associated with a given usescale ID
    
    Query Parameters:
        usescale_id (str): the unqiue identifier for the usescale
        
    Returns: 
        flask.Response: A JSON array containing all matching rows from the
        'usescale_entries' table
    """
    connection = sqlite3.connect("database/usescale_rows.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    usescale_id = request.args.get("usescale_id")
    cursor.execute("SELECT * FROM usescale_entries WHERE usescale_id = (?)", (usescale_id,))
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]

    connection.close()
    return jsonify(data)


# Find subject associated with a subject id
@app.route("/get_subject_info", methods=["GET"])
def get_subject_info():
    """
    Retrieves the subject associated with the given subject ID

    Query Parameters:
        subject_id (str): the unique identifier for the subject

    Returns:
        flask.Reponse: A JSON containing the subject object that matches
        the subject_id from the 'subjects' table
    """
    subject_id = request.args.get("subject_id")
    if not subject_id:
        return jsonify({
                "subject_id": None,
                "subject_name": "",
                "subject_year": "",
                "subject_semester": ""
            })

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


# Find templates matching a search term
@app.route('/find_templates', methods=["GET"])
def find_template_matches():
    """
    Search for templates or subjects matching a given keyword
    
    Query Parameters:
        subject_name (str): Search term for template or subject fields
    
    Returns:
        flask.Response: JSON containing a list of matching template titles
    """
    search_term = request.args.get("subject_name")
    print("Search Term:", search_term)
    search = search_term.lower()
    
    try:
        connection = sqlite3.connect("database/usescales.db")
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        # Attach the second DB
        cursor.execute("ATTACH DATABASE 'database/subjects.db' AS subjects_db")

        query = """
        SELECT u.title AS usescale_title
        FROM usescales u
        JOIN subjects_db.subjects s ON u.subject_id = s.subject_id
        WHERE 
            LOWER(u.title) LIKE ?
            OR LOWER(s.subject_name) LIKE ?
            OR LOWER(s.subject_year) LIKE ?
            OR LOWER(s.subject_semester) LIKE ?
        """
        like_param = f"%{search}%"
        cursor.execute(query, (like_param, like_param, like_param, like_param))
        results = cursor.fetchall()
        templates = [row['usescale_title'] for row in results]

        return jsonify(success=True, templates=templates)

    except Exception as e:
        print("Error:", e)
        return jsonify(success=False, error=str(e))

    finally:
        connection.close()


# Save full template (title and entry rows)
@app.route('/save_template', methods=['POST'])
def save_template():
    """
    Save an entire template including its title and all associated rows
    
    Request Body (JSON):
        usescale_id (int): the template's unique ID
        subject_id (int): associated subject ID
        title (str): template title
        rows (list): list of row objects containing entry data
        
    Returns:
        flask.Response: JSON with success message or error details
    """
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
            "DELETE FROM usescale_entries WHERE usescale_id = ?",
            (usescale_id, )
        )

        # Insert new rows
        for row in rows:
            cursor.execute(
                """
                INSERT INTO usescale_entries (
                    subject_id, usescale_id, entry_id, assessment_task, ai_title, instruction, example, declaration,
                    version, purpose, key_prompts
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    subject_id,
                    usescale_id,
                    row.get('entry_id'),
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


# Update only the template title
@app.route('/update_title', methods=["POST"])
def update_title():
    """
    Update only the title of a template
    
    Request Body (JSON):
        usescale_id (int): Template ID to update
        title (str): New title value
    
    Returns:
        flask.Response: JSON indicating success or failure
    """
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


# Delete a template from the homepage
@app.route('/delete_template', methods=["POST"])
def delete_template():
    """
    Delete a template and all its associated entry rows
    
    Request Body (JSON):
        usescale_id (int): the ID of the template to delete
        
    Returns:
        flask.Response: JSON indicating success or failure
    """
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
    

# Copying an existing custom template
@app.route('/copy_template', methods=["POST"])
def copy_template():
    """
    Create a duplicate of an exisitng custom template
    
    Request Body (JSON):
        usescale_id (int): the ID of the template to copy
        user_id: the user creating this copy
        
    Returns:
        flask.Response: JSON containing new template ID and title
    """
    data = request.get_json()
    usescale_id = data.get('usescale_id')
    user_id = data.get('user_id')

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
            "INSERT INTO usescales (user_id, title, template_type) VALUES (?, ?, ?)",
            (user_id, new_title, "custom")
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
            _, subject_id, _, entry_id, assessment_task, ai_title, instruction, example, declaration, version, purpose, key_prompts = entry
            cursor_rows.execute(
                """
                INSERT INTO usescale_entries (
                    subject_id, usescale_id, entry_id, assessment_task, ai_title, instruction, example, declaration, 
                    version, purpose, key_prompts
                )           
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)   
                """,
                (subject_id, new_usescale_id, entry_id, assessment_task, ai_title, instruction, example, declaration, version, purpose, key_prompts)
                
            )
        connection_rows.commit()
        connection_rows.close()

        return jsonify({"success": True, "new_usescale_id": new_usescale_id, "new_title": new_title})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    

# Copy a base template
@app.route('/copy_base_template', methods=["POST"])
def copy_base_template():
    """
    Duplicate a base template and convert it to a custom user template
    
    Request Body (JSON):
        usescale_id (int): the base template ID to copy
        user_id (int): the ID of the user creating the copy
        
    Returns:
        flask.Response: JSON containing the new tempalte ID and title
    """
    data = request.get_json()
    usescale_id = data.get('usescale_id')
    user_id = data.get('user_id')
    

    if not usescale_id:
        return jsonify({"success": False, "error": "missing usescale id"})
    
    try:
        connection = sqlite3.connect("database/usescales.db")
        cursor = connection.cursor()

        # Get original template info (title + type)
        cursor.execute("SELECT title, template_type FROM usescales WHERE usescale_id=?", (usescale_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"success": False, "error": "template not found"})
        
        old_title, old_type = row

        if old_type.lower() != "base":
            return jsonify({"success": False, "error": "Template is not a base template"})

        new_title = f"{old_title} (Copy)"
        
        # Insert new usescale with template_type forced to "custom"
        cursor.execute(
            "INSERT INTO usescales (user_id, title, template_type) VALUES (?, ?, ?)",
            (user_id, new_title, "custom")
        )
        new_usescale_id = cursor.lastrowid
        connection.commit()
        connection.close()

        # Copy associated entries
        connection_rows = sqlite3.connect("database/usescale_rows.db")
        cursor_rows = connection_rows.cursor()
        cursor_rows.execute("SELECT * FROM usescale_entries WHERE usescale_id=?", (usescale_id,))
        entries = cursor_rows.fetchall()

        for entry in entries:
            (
                row_id, subject_id, old_usescale_id, entry_id, assessment_task, ai_title,
                instruction, example, declaration, version, purpose, key_prompts
            ) = entry

            cursor_rows.execute(
                """
                INSERT INTO usescale_entries (
                    subject_id, usescale_id, entry_id, assessment_task, ai_title, instruction, example, declaration,
                    version, purpose, key_prompts
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (subject_id, new_usescale_id, entry_id, assessment_task, ai_title, instruction, example, declaration, version, purpose, key_prompts)
            )
        
        connection_rows.commit()
        connection_rows.close()

        return jsonify({
            "success": True,
            "new_usescale_id": new_usescale_id,
            "new_title": new_title
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


    
# User login
@app.route("/login", methods=["POST"])
def login():
    """
    Authenticates user with username and password
    
    Query Parameters:
        user_id (int): the unique ID of the user logging in
        user_type (str): the type of user logging in
        password (str): the inputted password

    Returns:
        flask.Response: JSON object indicating login success. 
                        If successful, includes 'user_id' and 'user_type' from 'users' table
    """
    username = request.form.get("username")
    password = request.form.get("password")

    connection = sqlite3.connect("database/users.db")
    cursor = connection.cursor()

    cursor.execute("SELECT user_id, user_type, password FROM users WHERE username = ?", (username,))
    account = cursor.fetchone()
    cursor.close()

    if account is None:
        return jsonify({"logged_in": False})
    #dbPassword = account[0]

    user_id, user_type, dbPassword = account

    if (password == dbPassword):
        return jsonify({
            # return the relevant data if log in successful
            "logged_in": True,
            "user_id": user_id,
            "user_type": user_type
        })

    else:
        return jsonify({"logged_in": False})
    

# Get all users data
@app.route("/data", methods=["GET"])
def getdata():
    """
    Retrieve all user records
    
    Query:
       SELECT * FROM users
    
    Returns:
        flask.Response: JSON list of all user records from 'users' table
    """
    connection = sqlite3.connect("database/users.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    connection.close()
    return jsonify(data)


# Get custom scales for a user
@app.route("/get_custom_scales", methods=["GET"])
def get_usescales():
    """
    Retrieves all custom templates for a specific user
    
    Query Parameters:
        user_id (int): the unique identifier of the current user
        template_type (str): the template type, whether custom or base

    Returns:
        flask.Response: JSON with user's custom scales from 'usescale' table
    """
    user_id = request.args.get("user_id")
    user_id = int(user_id)

    connection = sqlite3.connect("database/usescales.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM usescales WHERE user_id = ? AND template_type = ?", (user_id, "custom"))
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    connection.close()
    return jsonify(data)


# Get all base templates
@app.route("/get_base_scales", methods=["GET"])
def get_base_scales():
    """
    Retrieve all base templates
    
    Query Parameters:
        template_type (str): the template type identifies (base or custom)
        
    Returns:
        flask.Reponse: JSON list of base templates from 'usescales' table
    """
    connection = sqlite3.connect("database/usescales.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM usescales WHERE template_type = ?", ("base",))
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    connection.close()
    return jsonify(data)


# Get rows for a specific template
@app.route("/get_usescale_rows", methods=["GET"])
def get_usescale_rows():
    """
    Retrieve all row entries for a given template
    
    Query Parameters:
        usescale_id (int): unique identifier of the template
        
    Returns:
        flask.Response: JSON list of entries from 'usescale_rows' table
    """
    usescale_id = request.args.get("usescale_id")
    connection = sqlite3.connect("database/usescale_rows.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM usescale_entries WHERE usescale_id = ?", (usescale_id,))
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    connection.close()
    return jsonify(data)


# Reassign a subject to a template
@app.route("/reassign_subject", methods=["POST"])
def reassign_subject():
    """
    Query Parameters:
        subject_id (int): ID of the subject
        usescale_id (int): ID of the template
        
    Returns:
        flask.Response: JSON object indicating success or failure
    """
    data = request.get_json()
    subject_id = data.get("subject_id")
    usescale_id = data.get("usescale_id")
    print("Reassigning subject_id:", subject_id, "to usescale_id:", usescale_id)

    try:
        connection_usescales = sqlite3.connect("database/usescales.db")
        cursor_usescales = connection_usescales.cursor()

        cursor_usescales.execute(
            """
            UPDATE usescales
            SET subject_id = ?
            WHERE usescale_id = ?
            """,
            (subject_id, usescale_id),
        )
        connection_usescales.commit()
        cursor_usescales.close()
        connection_usescales.close()

        return jsonify({"success": True, "message": "Subject reassigned successfully!"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# Check if a subject exists
@app.route("/check_in_subjects", methods=["POST"])
def check_in_subjects():
    """
    Check whether a subject with a given name, year, and semester exists
    
    Query Parameters:
        subject_id (int): ID of the subject
        subject_name (str): name of the subject
        subject_year (int): subject year
        subject_semester (str): subjest semester (semester 1 or semester 2)
        
    Returns:
        flask.Response: JSON response with 'exists' and optional 'subject_id' from 'subjects' table
    """
    data = request.get_json()
    subject_name = data.get("subjectName")
    subject_year = data.get("subjectYear")
    subject_semester = data.get("subjectSemester")

    if not subject_name or not subject_year or not subject_semester:
        return jsonify({"success": False, "error": "Missing parameters"}), 400

    try:
        connection = sqlite3.connect("database/subjects.db")
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT subject_id FROM subjects
            WHERE subject_name = ? AND subject_year = ? AND subject_semester = ?
            """,
            (subject_name, subject_year, subject_semester)
        )
        row = cursor.fetchone()
        connection.close()

        if row:
            # Subject exists
            return jsonify({"exists": True, "subject_id": row["subject_id"]})
        else:
            # Subject does not exist
            return jsonify({"exists": False})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# Create a new subject
@app.route("/create_subject", methods=["POST"])
def create_subject():
    """
    Create a new subject and map it to a template
    
    Queries:
        INSERT INTO subjects (subject_name, subject_year, subject_semester) VALUES (?, ?, ?)
        UPDATE usescales SET subject_id = ? WHERE usescale_id = ?

    Returns:
        flask.Response: JSON response with success message
    """
    # Parse the JSON data from the request
    info = request.get_json()
    subject_name = info.get("subjectName")
    subject_year = info.get("subjectYear")
    subject_semester = info.get("subjectSemester")
    usescale_id = info.get("usescale_id")

    # Validate the input data
    if not subject_name or not subject_year or not subject_semester or not usescale_id:
        return jsonify({"success": False, "error": "Missing subject details or usescale_id"}), 400

    try:
        # Connect to the database
        connection = sqlite3.connect("database/subjects.db")
        cursor = connection.cursor()

        # Insert the new subject into the database
        cursor.execute(
            """
            INSERT INTO subjects (subject_name, subject_year, subject_semester)
            VALUES (?, ?, ?)
            """,
            (subject_name, subject_year, subject_semester),
        )
        connection.commit()

        # Get the ID of the newly created subject
        new_subject_id = cursor.lastrowid

        # Close the connection to the subjects database
        connection.close()

        # Update the usescales.subject_id mapping
        connection_usescales = sqlite3.connect("database/usescales.db")
        cursor_usescales = connection_usescales.cursor()
        print("updating usescale_id:", usescale_id, "to new subject_id:", new_subject_id)

        cursor_usescales.execute(
            """
            UPDATE usescales
            SET subject_id = ?
            WHERE usescale_id = ?
            """,
            (new_subject_id, usescale_id),
        )
        connection_usescales.commit()
        connection_usescales.close()

        # Return a success response
        return jsonify({"success": True, "message": "Subject created and mapping updated successfully!"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# Create a new custom template
@app.route("/create_template", methods=["POST"])
def create_template():
    """
    Create a new custom template
    
    Query:
        INSERT INTO usescales (subject_id, user_id, title, template_type) VALUES (?, ?, ?, ?)
        
    Returns:
        flask.Response: JSON success message and 'usescale_id' from 'usescales' table
    """
    info = request.get_json()
    title = info.get("title", "Untitled Template")  # default title
    subject_id = info.get("subject_id")  # optional
    # add this in
    user_id = info.get("user_id")

    new_id = None  # will store the new usescale id

    # --- Insert into usescales.db ---
    try:
        connection_usescales = sqlite3.connect("database/usescales.db")
        cursor_usescales = connection_usescales.cursor()

        cursor_usescales.execute(
            "INSERT INTO usescales (subject_id, user_id, title, template_type) VALUES (?, ?, ?, ?)",
            # edit this to take in the four variables, and always create templates as custom
            (subject_id, user_id, title, "custom")
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


# Save a custom template as a base template (admin function)
@app.route("/save_as_base_template", methods=["POST"])
def save_as_base_template():
    """
    Convert a custom template to a base template
    
    Query:
        UPDATE usescales SET template_type = "base" WHERE usescale_id = ? AND template_type = "custom"

    Returns:
        flask.Response: JSON success message or failure details
    """
    try:
        data = request.get_json()
        usescale_id = data.get("usescale_id")

        if not usescale_id:
            return jsonify({"success": False, "error": "no usescale id"})

        connection = sqlite3.connect("database/usescales.db")
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE usescales
            SET template_type = "base"
            WHERE usescale_id = ? AND template_type = "custom"
            """, (usescale_id,))
        
        if cursor.rowcount == 0:
            connection.close()
            return jsonify({"success": False, "error": "No matching template found or template already base template"})
        
        connection.commit()
        connection.close()
        return jsonify({"success": True, "message": "Template set to base"})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    

# Update SRep scale cell entry and handle notifications
@app.route("/update_usescale", methods=["POST"])
def update_usescale():
    """
    Update an SRep entry and create/update notifications for affected rows
    
    Queries:
        SELECT * FROM srep_entries WHERE entry_id = ?
        UPDATE srep_entries SET ... WHERE entry_id = ?
        INSERT/UPDATE notifications
        
    Returns:
        flask.Response: JSON success or failure message
    """
    data = request.get_json()

    entry_id = data.get("entry_id")
    if not entry_id:
        return jsonify({"error": "Missing entry_id"}), 400

    fields = [
        "ai_level",
        "ai_title",
        "instruction",
        "example",
        "declaration",
        "version",
        "purpose",
        "key_prompts",
    ]

    updates = []
    values = []
    for f in fields:
        if f in data:
            updates.append(f"{f} = ?")
            values.append(data[f])

    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    values.append(entry_id)

    try:
        # connect to srep entries
        conn_srep = sqlite3.connect("database/srep_entries.db")
        conn_srep.row_factory = sqlite3.Row
        cur_srep = conn_srep.cursor()

        # fetch previous data for notification
        cur_srep.execute("SELECT * FROM srep_entries WHERE entry_id = ?", (entry_id,))
        prev_row = cur_srep.fetchone()
        if not prev_row:
            conn_srep.close()
            return jsonify({"error": "Entry not found"})
        
        prev_data = {key: prev_row[key] for key in prev_row.keys()}

        # update the entry in srep entries
        cur_srep.execute(
            f"UPDATE srep_entries SET {', '.join(updates)} WHERE entry_id = ?",
            values,
        )
        conn_srep.commit()

        # fetch updated row data
        cur_srep.execute("SELECT * FROM srep_entries WHERE entry_id = ?", (entry_id,))
        curr_row = cur_srep.fetchone()
        curr_data = {key: curr_row[key] for key in curr_row.keys()}

        conn_srep.close()

        # connect to usescale_rows to find affected rows
        conn_rows = sqlite3.connect("database/usescale_rows.db")
        conn_rows.row_factory = sqlite3.Row
        cur_rows = conn_rows.cursor()

        cur_rows.execute("SELECT * FROM usescale_entries WHERE entry_id = ?", (entry_id,))
        affected_rows = cur_rows.fetchall()
        conn_rows.close()

        # connect to notifications database
        conn_notif = sqlite3.connect("database/notifications.db")
        cur_notif = conn_notif.cursor()

        # connect to usescales and users database
        conn_scales = sqlite3.connect("database/usescales.db")
        cur_scales = conn_scales.cursor()
        conn_users = sqlite3.connect("database/users.db")
        cur_users = conn_users.cursor()

        for row in affected_rows:
            row_id = row["row_id"]
            usescale_id = row["usescale_id"]

            # get user_id for this usescale
            cur_scales.execute("SELECT user_id FROM usescales WHERE usescale_id = ?", (usescale_id,))
            scale_data = cur_scales.fetchone()
            if not scale_data:
                continue
            user_id = scale_data[0]

            # check user type
            cur_users.execute("SELECT user_type FROM users WHERE user_id = ?", (user_id,))
            user_data = cur_users.fetchone()
            if not user_data:
                continue
            if user_data[0] == "admin":
                continue  # skip notifications for admin users

            # check if notification already exists for this row
            cur_notif.execute("SELECT * FROM notifications WHERE row_id = ?", (row_id,))
            existing_notif = cur_notif.fetchone()

            if existing_notif:
                # update curr_data only, keep prev_data as is
                cur_notif.execute(
                    "UPDATE notifications SET curr_data = ? WHERE row_id = ?",
                    (json.dumps(curr_data), row_id)
                )
            else:
                # insert new notification
                cur_notif.execute(
                    """
                    INSERT INTO notifications (entry_id, row_id, prev_data, curr_data)
                    VALUES (?, ?, ?, ?)
                    """,
                    (entry_id, row_id, json.dumps(prev_data), json.dumps(curr_data))
                )

        conn_notif.commit()
        conn_notif.close()
        conn_scales.close()
        conn_users.close()

        return jsonify({"success": True, "message": "Entry updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Checks if there are notifications associated with a list of row IDs
@app.route("/get_notifications_for_rows", methods=["POST"])
def get_notifications_for_rows():
    """
    Retrieves all rows that currently have notifications
    
    Query:
        SELECT row_id FROM notifications WHERE row_id IN (?)
        
    Returns:
        flask.Response: JSON response with 'rows_with_notifications' or error message
    """
    data = request.get_json()
    row_ids = data.get("row_ids")

    if not row_ids or not isinstance(row_ids, list):
        return jsonify({"error": "missing or invalid row_id"})
    
    try:
        connection = sqlite3.connect("database/notifications.db")
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        placeholders = ",".join("?" for _ in row_ids)
        query = f"SELECT row_id FROM notifications WHERE row_id IN ({placeholders})"
        cursor.execute(query, row_ids)
        rows_with_notifications = {r["row_id"] for r in cursor.fetchall()}

        connection.close()

        return jsonify({"success": True, "rows_with_notifications": list(rows_with_notifications)})
    except Exception as e:
        return jsonify({"error": str(e)})
    

# Get notification for a specific row
@app.route("/get_notification_for_row", methods=["POST"])
def get_notification_for_row():
    """
    Retrieve the entire notification entry associated with a specific row
    
    Query Parameters:
        row_id (int): the ID of the row
        
    Returns:
        flask.Response: JSON response with 'notification' object from 'notifications' table or error
    """
    data = request.get_json()
    row_id = data.get("row_id")

    if not row_id:
        return jsonify({"error": "Missing row id"})
    
    try:
        connection = sqlite3.connect("database/notifications.db")
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM notifications WHERE row_id = ?", (row_id,))
        notif = cursor.fetchone()
        connection.close()

        if not notif:
            return jsonify({"success": False, "error": "No notification found"})
        
        return jsonify({
            "success": True,
            "notification": {
                "notification_id": notif["notification_id"],
                "entry_id": notif["entry_id"],
                "row_id": notif["row_id"],
                "prev_data": json.loads(notif["prev_data"]),
                "curr_data": json.loads(notif["curr_data"]),
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)})
    

# Handle accept or reject of a notification
@app.route("/handle_notification", methods=["POST"])
def handle_notification():
    """
    Handle user action on a notification (accept or reject) 
    
    Queries:
        SELECT * FROM notifications WHERE notification_id = ?
        If accepted: UPDATE usescale_entries SET ... WHERE row_id = ?
        Finally: DELETE FROM notifications WHERE notification_id = ?
        
    Returns:
        flask.Response: confirming update or rejection
    """
    data = request.get_json()
    notification_id = data.get("notification_id")
    action = data.get("action")  # accept or reject

    if not notification_id or action not in ["accept", "reject"]:
        return jsonify({"error": "Missing or invalid input"})

    try:
        # connect to notifications DB
        conn_notif = sqlite3.connect("database/notifications.db")
        conn_notif.row_factory = sqlite3.Row
        cursor_notif = conn_notif.cursor()

        # fetch notification
        cursor_notif.execute(
            "SELECT * FROM notifications WHERE notification_id = ?",
            (notification_id,)
        )
        notif = cursor_notif.fetchone()
        if not notif:
            conn_notif.close()
            return jsonify({"error": "Notification not found"})

        row_id = notif["row_id"]
        curr_data = json.loads(notif["curr_data"])

        # if accepted, update the row in usescale_entries
        if action == "accept":
            conn_rows = sqlite3.connect("database/usescale_rows.db")
            cur_rows = conn_rows.cursor()

            allowed_keys = [
                "assessment_task", "ai_title", "instruction", "example",
                "declaration", "version", "purpose", "key_prompts"
            ]
            updates = [f"{key} = ?" for key in allowed_keys if key in curr_data]
            values = [curr_data[key] for key in allowed_keys if key in curr_data]
            values.append(row_id)  # for WHERE clause

            sql = f"UPDATE usescale_entries SET {', '.join(updates)} WHERE row_id = ?"
            cur_rows.execute(sql, values)
            conn_rows.commit()
            conn_rows.close()

        # delete the notification in both cases
        cursor_notif.execute(
            "DELETE FROM notifications WHERE notification_id = ?",
            (notification_id,)
        )
        conn_notif.commit()
        conn_notif.close()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})
    
                             
# Retrieve all SRep entries grouped by entry type
@app.route("/entries", methods=["GET"])
def get_entries():
    """
    Retrieve all SRep entries grouped by their entry type
    
    Queries:
        SELECT entry_type_id, entry_type_name FROM srep_entry_type
        SELECT * FROM srep_entries WHERE entry_type_id = ?
    
    Returns:
        flask.Resposne: JSON list with entries grouped by entry type
    """
    # connect to srep entry types database
    conn_types = sqlite3.connect("database/srep_entry_type.db")
    conn_types.row_factory = sqlite3.Row
    cur_types = conn_types.cursor()
    
    cur_types.execute("SELECT entry_type_id, entry_type_name FROM srep_entry_type ORDER BY entry_type_id")
    entry_types = cur_types.fetchall()
    conn_types.close()

    # connect to srep entries database
    conn_entries = sqlite3.connect("database/srep_entries.db")
    conn_entries.row_factory = sqlite3.Row
    cur_entries = conn_entries.cursor()

    result = []
    for et in entry_types:
        cur_entries.execute("""
            SELECT entry_id, ai_level, ai_title, instruction, example, declaration, version, purpose, key_prompts
            FROM srep_entries
            WHERE entry_type_id = ?
            ORDER BY entry_id
        """, (et["entry_type_id"],))
        entries = cur_entries.fetchall()
        entries_list = [dict(e) for e in entries]

        result.append({
            "entry_type_id": et["entry_type_id"],
            "title": et["entry_type_name"],
            "entries": entries_list
        })

    conn_entries.close()
    return jsonify(result)


# Create a new subject space (user account for coordinator)
@app.route("/create_subject_space", methods=["POST"])
def create_subject_space():
    """
    Create a new subject space by registering a coordinator user
    
    Queries:
        SELECT user_id FROM users WHERE username = ?
        INSERT INTO users (username, password, user_type) VALUES (?, ?, 'coordinator')
        
    Returns:
        flask.Response: JSON response indicating success or failure
    """
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"success": False, "error": "username and password are required"})
        
        connection = sqlite3.connect("database/users.db")
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        # first check is username already exists
        cursor.execute("SELECT user_id FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            connection.close()
            return jsonify({"success": False, "error": "Username already exists"})
        
        # insert new user (plaintext password for now)
        cursor.execute(
            "INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)",
            (username, password, "coordinator")
        )
        user_id = cursor.lastrowid
        
        connection.commit()
        connection.close()

        return jsonify({"success": True, "message": "Subject space created successfully!"})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})