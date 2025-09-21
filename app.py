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
    subject_id = request.args.get("usescale_id")
    cursor.execute("SELECT * FROM usescale_entries WHERE usescale_id = (?)", (subject_id))
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




@app.route('/save_template', methods=['POST'])
def save_template():
    data = request.json
    usescale_id = data.get('usescale_id')
    subject_id = data.get('subject_id')
    rows = data.get('rows')

    try:
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
                    subject_id, usescale_id, instruction, example, declaration,
                    version, purpose, key_prompts
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    subject_id,
                    usescale_id,
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

@app.route("/create_template", methods=["POST"])
def create_template():
    info = request.get_json()
    title = info.get("title")
    connection = sqlite3.connect("database/usescales.db")
    cursor = connection.cursor()
    cursor.execute("INSERT INTO usescales (title) VALUES (?)", (title,))
    connection.commit()
    cursor.close()
    return {"status": "success", "message": "Template created successfully"} 

# tesintg react and flask connetion 
@app.route("/api/ping")
def ping():
    return jsonify({"message": "pong"})
