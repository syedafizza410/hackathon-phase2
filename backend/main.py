from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging

# ---------------- Logging ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- Env ----------------
try:
    load_dotenv()
except Exception as e:
    logger.warning(f"Could not load .env file: {e}")

# ---------------- Imports ----------------
try:
    from routes.tasks import router as tasks_router
    from auth import router as auth_router
    from middleware.jwt_middleware import JWTMiddleware
except ImportError as e:
    logger.error(f"Failed to import required modules: {e}")
    raise

# ---------------- App ----------------
app = FastAPI(
    title="Todo App API",
    description="API for the Todo App Phase II",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url=None
)

# ---------------- CORS ----------------
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
vercel_url = os.getenv("VERCEL_URL", "")

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    frontend_url,
]

if vercel_url:
    allowed_origins.extend([
        f"https://{vercel_url}",
        f"https://{vercel_url}.vercel.app",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization"]
)

# ---------------- JWT Middleware ----------------
app.add_middleware(JWTMiddleware)

# ---------------- Routers ----------------
app.include_router(tasks_router, prefix="/api/{user_id}", tags=["tasks"])
app.include_router(auth_router, prefix="/api", tags=["auth"])

# ---------------- Routes ----------------
@app.get("/")
def read_root():
    return {"message": "Todo App Backend API", "status": "running"}

@app.get("/health", include_in_schema=False)
def health_check():
    return {"status": "healthy", "service": "todo-backend"}
