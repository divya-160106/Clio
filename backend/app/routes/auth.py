from fastapi import ( APIRouter, HTTPException, Depends, Header)
from app.database.mongodb import db
from app.models.auth import ( UserRegister, UserLogin )
from app.services.auth import ( hash_password, verify_password, create_access_token, decode_token )

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
async def register(user: UserRegister):
    existing = await db.users.find_one({
        "email": user.email
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )
    await db.users.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password)
    })

    return {
        "message": "User created successfully."
    }

@router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({
        "email": user.email
    })

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials."
        )

    if not verify_password(
        user.password,
        db_user["password"]
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials."
        )
    token = create_access_token({
        "sub": db_user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

async def get_current_user(
    authorization: str = Header(...)
):

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid token."
        )
    token = authorization.split()[1]
    payload = decode_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token."
        )

    user = await db.users.find_one({
        "email": payload["sub"]
    })

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )
    return user

@router.get("/me")
async def me(
    current_user=Depends(get_current_user)
):

    return {
        "username": current_user["username"],
        "email": current_user["email"]
    }