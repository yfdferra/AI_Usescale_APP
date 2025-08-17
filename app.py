from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template("home/index.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    print(f"Username: {username}, Password: {password}")
    return f"<h2>Welcome, {username}</h2>"