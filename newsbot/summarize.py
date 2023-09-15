import cohere
import sys
import json

def summarize(article, longest_sentences):
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
