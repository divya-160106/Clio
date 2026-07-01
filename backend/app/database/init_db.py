from app.database.mongodb import db

async def init_db():
    #cuz I'm a data gal!
    await db.user_books.create_index( [("user_email", 1),("book.id", 1)], unique=True )