from fastapi import FastAPI
from app.routers import health, mappings

# Dev-only CORS (optional). Not required in production when using single-origin nginx proxy.
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Procedure → SNOMED Mapping API", version="1.0.0")

# DEV ONLY: keep localhost for local development
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(mappings.router, prefix="/api/mappings", tags=["mappings"])
