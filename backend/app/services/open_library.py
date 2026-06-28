import requests

BASE_URL = "https://openlibrary.org/search.json"


def search_books(query: str):

    response = requests.get(
        BASE_URL,
        params={
            "q": query,
            "limit": 20
        },
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    books = []

    for doc in data.get("docs", []):

        books.append({

            "id": doc.get("key"),

            "title": doc.get("title", "Unknown Title"),

            "author": (
                doc.get("author_name", ["Unknown Author"])[0]
            ),

            "cover": (
                f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-L.jpg"
                if doc.get("cover_i")
                else None
            ),

            "year": doc.get("first_publish_year"),

            "subjects": doc.get("subject", [])[:5],

            "isbn": doc.get("isbn", [])[:3],

            "edition_count": doc.get("edition_count", 0),

            "source": "openlibrary"

        })

    return books