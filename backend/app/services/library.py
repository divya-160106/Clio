from datetime import datetime
from fastapi import HTTPException
from app.database.mongodb import db
from app.models.library import create_user_book
from typing import Any
VALID_SHELVES = {
    "To Read",
    "Reading",
    "Read"
}

async def get_library( user_email: str ):

    books = await db.user_books.find({"user_email": user_email}).to_list(None)

    library = {
        "To Read": [],
        "Reading": [],
        "Read": []
    }

    for book in books:
        book["_id"] = str(book["_id"])
        shelf = book["shelf"]
        library.setdefault(
            shelf,
            []
        ).append(book)

    return library

# Book management functions
async def add_book( user_email: str, shelf: str, book ):
    
    if shelf not in VALID_SHELVES:
        raise HTTPException( status_code=400, detail="Invalid shelf." )
    existing = await db.user_books.find_one({
        "user_email": user_email,
        "book.id": book.id
    })

    if existing:
        raise HTTPException( status_code=400, detail="Book already exists in library." )
    
    document = create_user_book( user_email, shelf, book )

    # Update dates based on shelf
    if shelf == "Reading":
        document["dates"]["started_at"] = datetime.utcnow()
    if shelf == "Read":
        now = datetime.utcnow()
        document["dates"]["started_at"] = now
        document["dates"]["finished_at"] = now
        document["reading_progress"]["percent"] = 100
    await db.user_books.insert_one(document)
    return {
        "message": "Book added."
    }

async def move_book( user_email: str, book_id: str, new_shelf: str ):

    if new_shelf not in VALID_SHELVES:
        raise HTTPException( status_code=400, detail="Invalid shelf." )
    
    existing = await db.user_books.find_one({ "user_email": user_email,"book.id": book_id })
    if existing is None:
        raise HTTPException( status_code=404, detail="Book not found." )
    
    # what's the new shelf?
    set_fields: dict[str, Any] = { "shelf": new_shelf }

    if new_shelf == "Reading":
        set_fields["dates.started_at"] = datetime.utcnow()

    elif new_shelf == "Read":
        now = datetime.utcnow()
        set_fields["dates.finished_at"] = now
        set_fields["reading_progress.percent"] = 100

    update = {
        "$set": set_fields
    }

    await db.user_books.update_one(
        {
            "user_email": user_email,
            "book.id": book_id
        },
        update
    )
    return {
        "message": "Book moved."
    }

async def remove_book( user_email: str, book_id: str ):

    result = await db.user_books.delete_one({ "user_email": user_email, "book.id": book_id })

    if result.deleted_count == 0:
        raise HTTPException( status_code=404, detail="Book not found." )
    
    return {
        "message": "Book removed."
    }

# Rate and Review functions
async def rate_book(
    user_email: str,
    book_id: str,
    rating: int
):

    if rating < 1 or rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5."
        )

    result = await db.user_books.update_one(
        {
            "user_email": user_email,
            "book.id": book_id
        },
        {
            "$set": {
                "rating": rating
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Book not found in your library."
        )

    return rating

async def review_book( user_email: str, book_id: str, review: str ):
    result = await db.user_books.update_one(
        {
            "user_email": user_email,
            "book.id": book_id
        },
        {
            "$set": { "review": review }
        }
    )
    if result.matched_count == 0:
        raise HTTPException( status_code=404, detail="Book not found in your library." )

    return review

async def clear_rating( user_email: str, book_id: str ):
    result = await db.user_books.update_one(
        {
            "user_email": user_email,
            "book.id": book_id
        },
        {
            "$set": { "rating": None }
        }
    )
    if result.matched_count == 0:
        raise HTTPException( status_code=404, detail="Book not found in your library." )
    return True

async def clear_review( user_email: str, book_id: str ):
    result = await db.user_books.update_one(
        {
            "user_email": user_email,
            "book.id": book_id
        },
        {
            "$set": { "review": None }
        }
    )
    if result.matched_count == 0:
        raise HTTPException( status_code=404, detail="Book not found in your library." )
    return True