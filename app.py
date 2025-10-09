from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return render_template("home/index.html")


@app.route("/usecase")
def usecase():
    connection = sqlite3.connect("database/usescale_rows.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    # changed this variable name to usescale id for clarity 
    usescale_id = request.args.get("usescale_id")
    cursor.execute("SELECT * FROM usescale_entries WHERE usescale_id = (?)", (usescale_id,))
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


@app.route('/find_templates', methods=["GET"])
def find_template_matches():
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
            "DELETE FROM usescale_entries WHERE usescale_id = ?",
            (usescale_id)
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
            "INSERT INTO usescales (user_id, title) VALUES (?, ?)",
            (user_id, new_title,)
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
    

# function for copying a base template
@app.route('/copy_base_template', methods=["POST"])
def copy_base_template():
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
                entry_id, subject_id, old_usescale_id, assessment_task, ai_title,
                instruction, example, declaration, version, purpose, key_prompts
            ) = entry

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

        return jsonify({
            "success": True,
            "new_usescale_id": new_usescale_id,
            "new_title": new_title
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


    
# when we log in we need to return some data, the user id and the user type
@app.route("/login", methods=["POST"])
def login():
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


# returns the user's use scales, need to only get custom scales
# need to mofidy this to check for user id as well 
@app.route("/get_custom_scales", methods=["GET"])
def get_usescales():
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


# will need a new function that retrieves the base templates
@app.route("/get_base_scales", methods=["GET"])
def get_base_scales():
    connection = sqlite3.connect("database/usescales.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM usescales WHERE template_type = ?", ("base",))
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

#reassign_subject
@app.route("/reassign_subject", methods=["POST"])
def reassign_subject():
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

@app.route("/check_in_subjects", methods=["POST"])
def check_in_subjects():
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



@app.route("/create_subject", methods=["POST"])
def create_subject():
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


# update this function to create a new entry in usescales db
@app.route("/create_template", methods=["POST"])
def create_template():
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

# will need a new function for specifically when the admin selects save as base template where the type will be edited
# to be base template
@app.route("/save_as_base_template", methods=["POST"])
def save_as_base_template():
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
            SELECT ai_level, ai_title, instruction, example, declaration, version, purpose, key_prompts
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


@app.route("/create_subject_space", methods=["POST"])
def create_subject_space():
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
        

