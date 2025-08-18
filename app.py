from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return render_template("home/index.html")


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

    # Convert rows to list of dicts
    data = [dict(row) for row in rows]

    connection.close()
    return jsonify(data)