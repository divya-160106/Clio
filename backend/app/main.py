from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema
from app.routes.library import router as library_router
from contextlib import asynccontextmanager
from app.database.init_db import init_db

#ensuring the database is initialized before handling requests cuz I don't want to complicate my life with race conditions
@asynccontextmanager
async def lifespan(app):
    await init_db()
    yield

app = FastAPI( lifespan=lifespan )
graphql_app = GraphQLRouter(schema)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router( graphql_app, prefix="/graphql" )
app.include_router(library_router)

@app.get("/")
def home():
    return {"message": "Clio backend running"}