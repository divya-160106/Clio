from fastapi import APIRouter, Query
from app.services.open_library import search_books

router = APIRouter()


@router.get("/books")
def get_books(query: str = Query(...)):

    books = search_books(query)

    return {
        "query": query,
        "count": len(books),
        "results": books
    }