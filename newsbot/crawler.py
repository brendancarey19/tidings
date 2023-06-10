import newspaper
from newsplease import NewsPlease
from .summarize import summarize
import nltk
import concurrent.futures


class Article:
    def __init__(self, url, title, image, response):
        self.url = url
        self.title = title
        self.image = image
        self.bullets = response["choices"][0]["message"]["content"].replace(". ", "\n")


def get_articles(url):
    ap = newspaper.build(
        url,
        memoize_articles=False,
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    )

    to_read = []
    for article in ap.articles:
        to_read.append(article.url)

    return to_read


def process_article(url):
    try:
        # article = NewsPlease.from_url(url)
        article = newspaper.Article(url)
        article.download()
        article.parse()

        sentences = nltk.sent_tokenize(article.text)

        num_sentences = int(len(sentences) * 0.25)

        longest_sentences = sorted(sentences, key=len, reverse=True)[:num_sentences]

        response = summarize(article, longest_sentences)

        to_add = Article(article.url, article.title, article.top_image, response)

        return to_add

    except Exception as e:
        print("WARNING: Article not parsed due to: " + str(e))
        return None


def read_articles(urls):
    articles = []

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_url = {executor.submit(process_article, url): url for url in urls}

        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                result = future.result()
                if result is not None:
                    articles.append(result)
            except Exception as e:
                print(f"Error processing article from {url}: {str(e)}")

    return articles
