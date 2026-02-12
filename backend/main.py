# backend/main.py
from fastapi import FastAPI, HTTPException
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
try:
    app = FastAPI(
        title="Todo App API",
        description="API for the Todo App Phase II",
        version="1.0.0",
        docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
        redoc_url=None
    )
except Exception as e:
    logger.error(f"Failed to create FastAPI app: {e}")
    raise

# ---------------- CORS ----------------
try:
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
except Exception as e:
    logger.error(f"Failed to configure CORS middleware: {e}")
    raise

# ---------------- JWT Middleware (✅ FIXED) ----------------
try:
    # ❌ WRONG: app = JWTMiddleware(app)
    # ✅ CORRECT:
    app.add_middleware(JWTMiddleware)
except Exception as e:
    logger.error(f"Failed to add JWT middleware: {e}")
    raise

# ---------------- Routers ----------------
try:
    app.include_router(tasks_router, prefix="/api/{user_id}", tags=["tasks"])
    app.include_router(auth_router, prefix="/api", tags=["auth"])
except Exception as e:
    logger.error(f"Failed to include routers: {e}")
    raise

# ---------------- Health ----------------
@app.get("/")
def read_root():
    return {
        "message": "Todo App Backend API",
        "status": "running"
    }

# HTML endpoint for Hugging Face Spaces iframe
@app.get("/index.html")
def index_html():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Todo App Backend</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .status { color: green; font-weight: bold; }
            .info { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>✅ Todo App Backend API</h1>
        <p class="status">Status: Running</p>
        <div class="info">
            <p><strong>API Documentation:</strong> <a href="/docs">/docs</a></p>
            <p><strong>Health Check:</strong> <a href="/health">/health</a></p>
        </div>
    </body>
    </html>
    """

@app.get("/health", include_in_schema=False)
def health_check():
    return {"status": "healthy", "service": "todo-backend"}
