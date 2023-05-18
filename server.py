from email import header
import json
from flask import Flask, jsonify, current_app, make_response
from flask_cors import CORS, cross_origin
from newsbot.crawler import get_articles, read_articles
import os
import sqlite3
import time

app = Flask(__name__)
CORS(app)


@app.route("/api/data_local", methods=["GET"])
@cross_origin()
def get_data_local():
    database_path = os.path.join(current_app.root_path, "database", "localstore.db")
    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()

    # Retrieve the articles from the database
    cursor.execute("SELECT * FROM local_articles")
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
    headers = {"Content-Type": "application/json"}

    return response, 200, headers


@app.route("/api/data", methods=["GET"])
@cross_origin()
def get_data():
    print("REQUEST SENT")
    start = time.time()
    with open("urls.txt") as f:
        links = [line.strip() for line in f]

    to_read = []
    i = 0
    for link in links:
        for x in get_articles(link):
            i += 1
            to_read.append(x)
            if i == 10:
                break
        if i == 10:
            break

    articles = read_articles(to_read)

    # Convert articles to a list of dictionaries
    articles_list = [article.__dict__ for article in articles]

    # Convert the list to a JSON object
    response = json.dumps(articles_list)

    # Set the content type header to application/json
    headers = {"Content-Type": "application/json"}
    print("time: " + str(time.time() - start))
    return response, 200, headers


if __name__ == "__main__":
    app.run(port="8080")
