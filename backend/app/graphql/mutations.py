import strawberry
from strawberry.types import Info
from app.services.library import ( rate_book, review_book, clear_rating, clear_review )

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def rate_book( self, info:Info, book_id: str, rating: int ) -> int:
        user = info.context["user"]
        if user is None:
            raise Exception("Authentication required.")
        return await rate_book( user["email"], book_id, rating )

    @strawberry.mutation
    async def review_book( self, info:Info, book_id: str, review: str ) -> str:
        user = info.context["user"]
        if user is None:
            raise Exception("Authentication required.")
        return await review_book( user["email"], book_id, review )

    @strawberry.mutation
    async def clear_rating( self, info:Info, book_id: str ) -> bool:
        user = info.context["user"]
        if user is None:
            raise Exception("Authentication required.")
        return await clear_rating( user["email"], book_id )

    @strawberry.mutation
    async def clear_review( self, info:Info, book_id: str ) -> bool:
        user = info.context["user"]
        if user is None:
            raise Exception("Authentication required.")
        return await clear_review( user["email"], book_id )