import json
from flask import Flask, jsonify, current_app, make_response, session
from flask_cors import CORS, cross_origin
from flask_session import Session
from newsbot.crawler import get_articles, read_articles
import os
import sqlite3
import uuid

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "super-secret-key"
app.config["SESSION_COOKIE_HTTPONLY"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
CORS(app, supports_credentials=True)
Session(app)


def cache_articles(articles):
    print(articles[0])


@app.route("/api/data_local", methods=["GET"])
@cross_origin()
def get_data_local():
    database_path = os.path.join(current_app.root_path, "database", "localstore.db")
    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()

    # Retrieve the articles from the database
    cursor.execute("SELECT * FROM articles_local_images LIMIT 14")
    rows = cursor.fetchall()

    # Convert the articles to a list of dictionaries
    articles = []
    for row in rows:
        article = {"title": row[0], "url": row[1], "image": row[2], "bullets": row[3]}
        articles.append(article)

    # Close the database connection
    conn.close()

    # Convert the list to a JSON object and return it with the appropriate headers
    response = json.dumps(articles)

    # Set the content type header to application/json
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
    }

    return response, 200, headers


@app.route("/api/data", methods=["GET"])
@cross_origin()
def get_data():
    print("SCROLL DATA REQUEST")
    print(session.get("id"))
    if "id" not in session:
        return "Session identifier not found", 400
    with open(f"session_data/{session['id']}/links.txt", "r") as file:
        lines = file.readlines()

    # Remove the first num_lines from the list of lines
    to_feed = lines[:6]
    new_lines = lines[6:]

    with open(f"session_data/{session['id']}/links.txt", "w+") as file:
        file.writelines(new_lines)

    articles = read_articles(to_feed)

    # Convert articles to a list of dictionaries
    articles_list = [article.__dict__ for article in articles]

    cache_articles(articles=articles_list)

    # Convert the list to a JSON object
    response = json.dumps(articles_list)

    # Set the content type header to application/json
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
    }

    return response, 200, headers


@app.route("/api/load_on_start", methods=["GET"])
@cross_origin()
def get_start_load():
    print("REQUEST SENT")
    session["id"] = str(uuid.uuid4())
    session.modified = True
    print(session["id"])

    with open("urls.txt") as f:
        links = [line.strip() for line in f]

    to_read = []

    for link in links:
        for x in get_articles(link):
            to_read.append(x)

    # write all links
    directory = f"session_data/{session['id']}"
    if not os.path.exists(directory):
        os.makedirs(directory)
    to_read_string = "\n".join(to_read)
    with open(f"session_data/{session['id']}/links.txt", "w+") as file:
        file.write(to_read_string)

    to_feed = to_read[:6]

    # delete first 6 links from session
    with open(f"session_data/{session['id']}/links.txt", "r") as file:
        lines = file.readlines()

    # Remove the first num_lines from the list of lines
    new_lines = lines[6:]

    with open(f"session_data/{session['id']}/links.txt", "w+") as file:
        file.writelines(new_lines)

    articles = read_articles(to_feed)

    # Convert articles to a list of dictionaries
    articles_list = [article.__dict__ for article in articles]

    cache_articles(articles=articles_list)

    # Convert the list to a JSON object
    response = json.dumps(articles_list)

    # Set the content type header to application/json
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
    }

    return response, 200, headers


if __name__ == "__main__":
    app.run(port="8080")
