from fastapi import APIRouter
from app.database.mongodb import db

router = APIRouter()


@router.get("/health/db")
async def database_health():

    await db.command("ping")

    return {
        "status": "healthy",
        "database": db.name
    }