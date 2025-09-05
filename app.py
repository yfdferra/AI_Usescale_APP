from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return render_template("home/index.html")

#Function skeleton for usecase
@app.route("/usecase")
def usecase():
    connection = sqlite3.connect("database/usescale_rows.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    #Assume you are given this as the subjectID
    englishID = 1
    mathsID = 2
    #Please find the relevant query to get usecase from the database, the sqlite.py is your friend :3
    #change with relevant query to get data
    cursor.execute("SELECT * FROM usescale_entries WHERE usescale_id IN (?,?)", (englishID, mathsID))
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]

    connection.close()
    return jsonify(data)













@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    connection = sqlite3.connect("database/users.db")
    cursor = connection.cursor()

    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    dbPassword = cursor.fetchone()[0]
    print(dbPassword)
    cursor.close()


    if (password == dbPassword):
        return render_template("dashboard/dashboard.html", user=username)
        #return f"<h2>Welcome, {username}</h2>"
    else:
        return f"<h2>Incorrect Username/Pasword</h2>"
    

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