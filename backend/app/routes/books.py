from fastapi import APIRouter, Query
from app.services.hardcover import search_books
from app.services.cache import (
    get_cached_books,
    save_cached_books,
)

router = APIRouter()

@router.get("/books")
async def get_books(query: str = Query(...)):

    cached = await get_cached_books(query)

    if cached:
        return {
            "query": query,
            "count": len(cached["books"]),
            "results": cached["books"],
            "cached": True
        }

    books = search_books(query)

    await save_cached_books(query, books)

    return {
        "query": query,
        "count": len(books),
        "results": books,
        "cached": False
    }