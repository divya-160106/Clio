from app.database.mongodb import db
from app.graphql.types import Book

async def cache_books(books: list):

    if not books:
        return

    for book in books:
        await db.books.update_one(
            { "_id": book["id"] },
            { "$set": {"_id": book["id"],
                    "title": book["title"],
                    "author": book["author"],
                    "cover": book["cover"],
                    "year": book["year"],
                    "subjects": book["subjects"],
                    "isbn": book["isbn"],
                    "rating": book["rating"],
                    "ratings_count": book["ratings_count"],
                    "reviews_count": book["reviews_count"],
                    "series": book["series"],
                    "description": book["description"],
                    "source": "hardcover",
                    "raw": book["raw"] }
            },
            upsert=True
        )

async def get_book(book_id: str):
    return await db.books.find_one( {"_id": book_id} )
