import os
import requests

GRAPHQL_URL = "https://api.hardcover.app/v1/graphql"
HEADERS = {
    "Authorization": f"Bearer {os.getenv('HARDCOVER_API_TOKEN')}",
    "Content-Type": "application/json",
}


def search_books(query: str):

    graphql = """
    query SearchBooks($query: String!) {
      search(query: $query) {
        results
      }
    }
    """

    response = requests.post(
        GRAPHQL_URL,
        json={
            "query": graphql,
            "variables": {
                "query": query
            }
        },
        headers=HEADERS,
        timeout=15,
    )

    response.raise_for_status()

    data = response.json()

    hits = (
        data["data"]["search"]["results"]
        .get("hits", [])
    )

    books = []

    for hit in hits:

        doc = hit["document"]

        image = doc.get("image") or {}

        books.append({
            "id": doc.get("id"),
            "title": doc.get("title"),
            "author": (
                doc.get("author_names", ["Unknown Author"])[0]
                if doc.get("author_names")
                else "Unknown Author"
            ),
            "cover": image.get("url"),
            "year": doc.get("release_year"),
            "subjects": doc.get("tags", [])[:5],
            "isbn": doc.get("isbns", [])[:3],
            "rating": doc.get("rating"),
            "ratings_count": doc.get("ratings_count"),
            "series": doc.get("series_names", []),
            "source": "hardcover",
            "description": doc.get("description")
        })

    return books