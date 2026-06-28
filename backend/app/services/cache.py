from datetime import datetime, timedelta
from app.database.mongodb import db

CACHE_DAYS = 30

async def get_cached_books(query: str):
    return await db.search_cache.find_one({
        "query": query.lower(),
        "expires_at": {"$gt": datetime.utcnow()}
    })

async def save_cached_books(query: str, books: list):
    await db.search_cache.update_one(
        {"query": query.lower()},
        {
            "$set": {
                "query": query.lower(),
                "books": books,
                "expires_at": datetime.utcnow() + timedelta(days=CACHE_DAYS)
            }
        },
        upsert=True
    )