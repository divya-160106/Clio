from pydantic import BaseModel
from datetime import datetime

class CachedBook(BaseModel):
    id: str
    title: str
    author: str
    cover: str | None = None
    year: int | None = None
    subjects: list[str] = []
    isbn: list[str] = []
    source: str = "hardcover"
    cached_at: datetime = datetime.utcnow()