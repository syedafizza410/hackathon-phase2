from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette import status
from auth import verify_better_auth_token
import logging

logger = logging.getLogger(__name__)

class JWTMiddleware(BaseHTTPMiddleware):
    """
    JWT middleware for Better Auth
    Handles Authorization headers and skips preflight OPTIONS requests
    """

    async def dispatch(self, request: Request, call_next):
        try:
            path = request.url.path
            method = request.method
            logger.info(f"{method} {path}")

            # ----------------
            # ✅ ALLOW PRE-FLIGHT
            # ----------------
            if method == "OPTIONS":
                return await call_next(request)

            # ----------------
            # Public routes
            # ----------------
            if path in ["/", "/health"]:
                return await call_next(request)

            if path.startswith("/api/"):
                # Public auth routes
                if path.startswith("/api/auth/") or path in ["/api/login", "/api/register"]:
                    return await call_next(request)

                # ----------------
                # Auth routes
                # ----------------
                auth_header = request.headers.get("Authorization")
                if not auth_header or not auth_header.startswith("Bearer "):
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"success": False, "error": "Authorization header missing"},
                    )

                token = auth_header.split(" ", 1)[1]
                token_data = verify_better_auth_token(token)

                if not token_data or "user_id" not in token_data:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"success": False, "error": "Invalid or expired token"},
                    )

                request.state.user_id = token_data["user_id"]
                logger.info(f"Authenticated user: {token_data['user_id']}")

            # ----------------
            # Call next middleware / route
            # ----------------
            return await call_next(request)

        except Exception as e:
            logger.exception("JWT middleware failure")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"success": False, "error": "Authentication middleware failure"},
            )
