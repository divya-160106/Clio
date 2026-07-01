import strawberry

@strawberry.type
class Book:
    id: str
    title: str
    author: str
    cover: str | None
    year: int | None
    subjects: list[str]
    isbn: list[str]
    rating: float | None
    ratings_count: int | None
    reviews_count: int | None
    series: list[str]
    source: str
    description: str | None
