---
name: auth-integration
description: Sets up Better Auth on frontend (Next.js) to issue JWT, and integrates with backend verification.
---

# Authentication Integration Skill

Full auth flow: Better Auth (frontend) → JWT → FastAPI verification.

## Frontend Part
- Install & configure Better Auth with JWT plugin.
- Login/signup pages: issue JWT on success.
- Store JWT (cookies or localStorage).
- In /lib/api.ts: attach Authorization: Bearer ${jwt} to every fetch.

## Backend Part
- Use jwt-verification skill for middleware.
- Decode token to get user_id/email.

## Flow
1. User logs in → Better Auth issues JWT.
2. Frontend sends JWT in headers for API calls.
3. Backend verifies & extracts user_id.