from fastapi import Request
from app.routes.auth import get_current_user

async def get_context(request: Request):
    authorization = request.headers.get("Authorization")
    user = None
    if authorization:
        user = await get_current_user(authorization)
    return {
        "request": request,
        "user": user
    }