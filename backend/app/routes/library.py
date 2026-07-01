from fastapi import APIRouter, Depends
from app.models.library import ( AddBookRequest, MoveBookRequest, RemoveBookRequest )
from app.routes.auth import get_current_user
from app.services.library import ( add_book, get_library, move_book, remove_book )

router = APIRouter(
    prefix="/library",
    tags=["Library"]
)

@router.get("")
async def library(current_user=Depends(get_current_user)):
    return await get_library( current_user["email"] )

@router.post("/add")
async def add( request: AddBookRequest, current_user=Depends(get_current_user) ):
    return await add_book( current_user["email"], request.shelf, request.book )

@router.patch("/move")
async def move( request: MoveBookRequest, current_user=Depends(get_current_user) ):
    return await move_book( current_user["email"], request.book_id, request.shelf )

@router.delete("/remove")
async def remove( request: RemoveBookRequest, current_user=Depends(get_current_user) ):
    return await remove_book( current_user["email"], request.book_id )