---
name: jwt-verification
description: Implements secure JWT verification middleware for FastAPI backend using BETTER_AUTH_SECRET. Ensures user isolation and 401 on invalid tokens.
context: fork  # Optional: run in isolated context if needed
allowedTools: ["Read", "Write", "Edit", "Bash"]
---

# JWT Verification Skill

You are implementing JWT auth protection for the Todo API.

## When to Use
- Any backend route that needs authentication.
- When securing /api/* endpoints.

## Core Instructions
1. Install PyJWT if not present (but assume it's in requirements).
2. Create middleware in backend/main.py or routes/auth.py:
   - Extract token from Authorization: Bearer header.
   - Decode & verify using jwt.decode(token, BETTER_AUTH_SECRET, algorithms=["HS256"]).
   - Extract user_id from payload.
   - Attach to request.state.user = {"id": user_id, ...}
   - If invalid/missing/expired → raise HTTPException(401, "Invalid authentication")
3. In every route: 
   - Get user = request.state.user
   - Assert user["id"] == path user_id, else 403 Forbidden
4. Use env var: os.getenv("BETTER_AUTH_SECRET")

## Example Code Snippet
from fastapi import Request, HTTPException
import jwt

async def jwt_middleware(request: Request, call_next):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    token = auth.split(" ")[1]
    try:
        payload = jwt.decode(token, os.getenv("BETTER_AUTH_SECRET"), algorithms=["HS256"])
        request.state.user = payload
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    response = await call_next(request)
    return response

app.middleware("http")(jwt_middleware)