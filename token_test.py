import requests
import json
from newsbot.crawler import get_articles, read_articles
import os
import sqlite3
import uuid
import newspaper
from newsplease import NewsPlease
import nltk


with open("urls.txt") as f:
    links = [line.strip() for line in f]

to_read = []

for link in links:
    for x in get_articles(link):
        to_read.append(x)

article = newspaper.Article(to_read[6])
article.download()
article.parse()


sentences = nltk.sent_tokenize(article.text)

num_sentences = int(len(sentences) * 0.25)

longest_sentences = sorted(sentences, key=len, reverse=True)[:num_sentences]

print(longest_sentences)

# Use OpenAI
token = ""
prompt = (
    f"After the colon are sentences from a news article with the title + {article.title}. Respond with nothing but up to 5 sentences that summarize this article: "
    + str(longest_sentences)
)

messages = [{"role": "user", "content": prompt}]
data = {
    "model": "gpt-3.5-turbo",
    "messages": messages,
    "temperature": 0.5,
}
URL = "https://api.openai.com/v1/chat/completions"

header = {"Authorization": "Bearer " + token}
response = requests.post(URL, json=data, headers=header)
response = response.json()
print(response)

with open("openai.json", "a") as f:
    json.dump(response, f)
    f.write("\n\n")

# Use cohere
import cohere
token = ""
co = cohere.Client(token)

text = ' '.join(longest_sentences)

try:
    response = co.summarize(
        text=text,
        model='command',
        length='long',
        extractiveness='low',
        format="bullets"
    )
    print(response.summary)
except Exception as e:
    print(e)

with open("cohere.txt", 'a') as file:
    file.write(str(str(article.url) + "\n" + response.summary + "\n"))


# COHERE: 556 token * 0.000015 per token = 0.00834 per article = 8.34$ per 1000 articles
# OpenAI: (439 prompt token * 0.0015 / 1000) + (125 output token * 0.002 / 1000) =  0.0009085 per article = 0.9085 per 1000 articles