---
name: user-isolation-enforce
description: Ensures strict data isolation: every DB query filters by authenticated user's ID.
---

# User Isolation Enforcement Skill

Prevent cross-user data access.

## Instructions
- In every SQLModel query: .where(Task.user_id == request.state.user["id"])
- For create: always set task.user_id = authenticated id
- For update/delete/get: check if task.user_id matches, else 403
- Add check in middleware or per-route.

## Security Benefit
No user can see/modify another's tasks even if they guess IDs.