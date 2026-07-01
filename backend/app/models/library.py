from datetime import datetime
from typing import Optional
from pydantic import BaseModel
class Book(BaseModel):
    id: str
    title: str
    author: Optional[str] = None
    cover: Optional[str] = None
    source: str = "hardcover"
class AddBookRequest(BaseModel):
    shelf: str
    book: Book
class MoveBookRequest(BaseModel):
    book_id: str
    shelf: str
class RemoveBookRequest(BaseModel):
    book_id: str
DEFAULT_PROGRESS = {
    "current_page": 0,
    "total_pages": None,
    "percent": 0
}
def create_user_book(email: str, shelf: str, book: Book):
    return {
        "user_email": email,
        "book": book.model_dump(),
        "shelf": shelf,
        "rating": None,
        "review": None,
        "favorite": False,
        "custom_shelves": [],
        "reading_progress": DEFAULT_PROGRESS.copy(),
        "dates": {
            "added_at": datetime.utcnow(),
            "started_at": None,
            "finished_at": None
        },
        "notes": [],
        "quotes": []
    }