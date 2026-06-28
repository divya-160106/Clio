from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

try:
    client.admin.command("ping")
    print("Connected!")
except Exception as e:
    print(type(e))
    print(e)