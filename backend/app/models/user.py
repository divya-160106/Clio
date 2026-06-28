from pydantic import BaseModel, Field
from datetime import datetime

class User(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)