import requests
import openai
import json

URL = "https://api.openai.com/v1/chat/completions"


def summarize(article, longest_sentences):
    token = "<redacted>"
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
    header = {"Authorization": "Bearer " + token}
    response = requests.post(URL, json=data, headers=header)
    response = response.json()

    with open("data.json", "a") as f:
        json.dump(response, f)
        f.write("\n\n")

    return response
