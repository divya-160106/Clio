import strawberry
from app.graphql.types import Book
from app.services.cache import ( get_cached_books, save_cached_books )
from app.services.hardcover import search_books
from app.services.book_catalog import get_book

@strawberry.type
class Query:
    @strawberry.field
    # resolver for searching books using the Hardcover API
    async def search_books(self, query: str) -> list[Book]:
        cached = await get_cached_books(query)
        if cached:
            print(cached["books"][3])
            return [
                Book(**{ k: v for k, v in book.items() if k != "raw" })
                for book in cached["books"]
            ]
        # If not cached, fetch from Hardcover API and cache the results
        books = await search_books(query)
        await save_cached_books(query, books)
        return [
            Book(**{ k: v for k, v in book.items() if k != "raw" })
            for book in books
        ]
    
    @strawberry.field
    async def book(self, id: str) -> Book | None:
        book = await get_book(id)
        if not book:
            return None
        book["id"] = book.pop("_id")
        book.pop("raw", None)
        return Book(**book)