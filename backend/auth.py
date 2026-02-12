# backend/auth.py
import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status, APIRouter, Depends, Request
from sqlmodel import Session
from pydantic import BaseModel
from config import settings
from db import get_session
import re
import httpx

# JWT Utilities - for verifying Better Auth JWTs
SECRET_KEY = settings.better_auth_secret
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_better_auth_token(token: str) -> Optional[dict]:
    """
    Verify the Better Auth JWT token and extract user information.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "name": payload.get("name")
        }
    except jwt.PyJWTError:
        return None

def verify_user_id_match(token_user_id: str, path_user_id: str) -> bool:
    """
    Verify that the user ID in the token matches the user ID in the path.
    This enforces user isolation.
    """
    return token_user_id == path_user_id

# Authentication Router
router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    email: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user.
    """
    try:
        # Validate email format
        if not validate_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )

        # Generate a unique user ID
        user_id = f"user_{abs(hash(user_data.email)) % 1000000000000}"

        # Create access token
        token_data = {
            "sub": user_id,  # This is crucial - the middleware checks this
            "email": user_data.email,
            "name": user_data.name
        }
        access_token = create_access_token(
            data=token_data,
            expires_delta=timedelta(hours=1)
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user_id,
            email=user_data.email
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, session: Session = Depends(get_session)):
    """
    Authenticate user and return access token.
    """
    try:
        # Validate email format
        if not validate_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )

        # In a real implementation, you would verify the password against a stored hash
        # For this simplified version, we'll just generate a token assuming valid credentials

        # Generate a user ID
        user_id = f"user_{abs(hash(user_data.email)) % 1000000000000}"

        # Create access token
        token_data = {
            "sub": user_id,  # This is crucial - the middleware checks this
            "email": user_data.email,
            "name": user_data.email.split('@')[0]
        }
        access_token = create_access_token(
            data=token_data,
            expires_delta=timedelta(hours=1)
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user_id,
            email=user_data.email
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(request: Request):
    """
    Get current authenticated user from Better Auth.
    """
    try:
        # Extract the authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header"
            )
        
        token = auth_header.split(" ")[1]
        token_data = verify_better_auth_token(token)
        
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )

        # Return user info from the token
        return UserResponse(
            id=token_data["user_id"],
            email=token_data.get("email", "user@example.com"),
            name=token_data.get("name", "User")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )
