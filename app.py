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

@app.route("/get_templates", methods=["GET"])
def get_templates():
    conn = sqlite3.connect("database/templates.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT templateID, templateName FROM templates")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.route("/get_template", methods=["GET"])
def get_template():
    template_id = request.args.get("template_id")

    conn = sqlite3.connect("database/templates.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM templates WHERE templateID = ?", (template_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify(dict(row))
    else:
        return jsonify({"error": "Template does not exist"})

@app.route("/create_template", methods=["POST"])
def create_template():
    info = request.get_json()
    title = info.get("title")
    connection = sqlite3.connect("database/templates.db")
    cursor = connection.cursor()
    cursor.execute("INSERT INTO templates (templateName, templateJson) VALUES (?, ?)", (title, "[]"))
    connection.commit()
    cursor.close()
    return {"status": "success", "message": "Template created successfully"}

@app.route("/save_template", methods=["POST"])
def save_template():
    info = request.get_json()
    template_id = info.get("templateID")
    template_json = info.get("templateJson")

    conn = sqlite3.connect("database/templates.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE templates SET templateJson = ? WHERE templateID = ?", (template_json, template_id))
    conn.commit()
    conn.close()

    return {"status": "success", "message": "Template update successful"}

