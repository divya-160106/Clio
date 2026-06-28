import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGO_URI:
    raise ValueError("MONGO_URI is missing from your .env file!")

if not DATABASE_NAME:
    raise ValueError("DATABASE_NAME is missing from your .env file!")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]