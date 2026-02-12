# Frontend Implementation Plan for Todo App Phase II

## 1. Prerequisites & Spec References
- @specs/ui/frontend-spec.md (main frontend specification)
- @specs/features/task-crud.md (task operations requirements)
- @specs/features/authentication.md (authentication requirements)
- @specs/api/rest-endpoints.md (API endpoint definitions)
- constitution.md (project governance and safety rules)

Any initial spec updates needed:
- If authentication details are incomplete in @specs/features/authentication.md, use spec-writer agent to update with JWT token handling specifics
- If API endpoint details are insufficient in @specs/api/rest-endpoints.md, use spec-writer agent to enhance with request/response type definitions

## 2. High-Level Steps (Sequential Order)
1. Setup & Configuration
2. Authentication Flow (Better Auth + JWT)
3. API Client Setup
4. Core Pages & Layouts
5. Reusable Components
6. Styling & Responsiveness Guidelines
7. Error & Loading States
8. Testing & Iteration Plan (without running code)

## 3. Detailed Step-by-Step Breakdown

### Step 1: Setup & Configuration
- What to do: Initialize Next.js 16+ project with TypeScript and Tailwind CSS
- Agent/Skill: Use frontend-dev agent to set up project structure
- Spec reference: @specs/ui/frontend-spec.md (Technology Guidelines section)
- Expected output: package.json, tsconfig.json, tailwind.config.js, and basic directory structure
- Security/UX considerations: Ensure dependencies are properly locked and secure

### Step 2: Authentication Flow (Better Auth + JWT)
- What to do: Implement Better Auth integration with JWT handling
- Agent/Skill: Use frontend-dev agent with auth-integration skill
- Spec reference: @specs/ui/frontend-spec.md (Better Auth section) and @specs/features/authentication.md
- Expected output: AuthProvider setup, login/signup pages, JWT storage/retrieval mechanisms
- Security/UX considerations: Secure JWT storage (preferably cookies), proper error handling for auth failures

### Step 3: API Client Setup
- What to do: Create centralized API client at /lib/api.ts that attaches JWT tokens
- Agent/Skill: Use frontend-dev agent with api-client-setup skill
- Spec reference: @specs/ui/frontend-spec.md (API Integration section)
- Expected output: /lib/api.ts with typed functions for each endpoint
- Security/UX considerations: Proper error handling for 401/403 responses, automatic token attachment

### Step 4: Core Pages & Layouts
- What to do: Create main pages and layout structure using Next.js App Router
- Agent/Skill: Use frontend-dev agent for page and layout creation
- Spec reference: @specs/ui/frontend-spec.md (Page Structure section)
- Expected output: /app/layout.tsx, /app/page.tsx, /app/tasks/page.tsx, /app/tasks/[id]/page.tsx, /app/signup/page.tsx, /app/signin/page.tsx
- Security/UX considerations: Proper routing, authentication checks on protected routes

### Step 5: Reusable Components
- What to do: Build reusable UI components as defined in the spec
- Agent/Skill: Use frontend-dev agent for component creation
- Spec reference: @specs/ui/frontend-spec.md (Component Structure section)
- Expected output: /components/TaskCard.tsx, /components/TaskForm.tsx, /components/LoadingSpinner.tsx, /components/ErrorMessage.tsx, /components/Navbar.tsx
- Security/UX considerations: Accessible components with proper ARIA attributes

### Step 6: Styling & Responsiveness Guidelines
- What to do: Apply Tailwind CSS classes for excellent styling and responsive design
- Agent/Skill: Use frontend-dev agent for styling implementation
- Spec reference: @specs/ui/frontend-spec.md (Styling Guidelines section)
- Expected output: Consistent styling across all components and pages using Tailwind utilities
- Security/UX considerations: Mobile-first responsive design, accessibility compliance

### Step 7: Error & Loading States
- What to do: Implement proper error handling and loading states throughout the app
- Agent/Skill: Use frontend-dev agent for error/loading state implementation
- Spec reference: @specs/ui/frontend-spec.md (Acceptance Criteria section)
- Expected output: Error boundaries, loading spinners, error messages, success notifications
- Security/UX considerations: Clear feedback to users about app state

### Step 8: Testing & Iteration Plan (without running code)
- What to do: Define testing approach for frontend functionality
- Agent/Skill: Use root-orchestrator agent for planning
- Spec reference: @specs/ui/frontend-spec.md (Acceptance Criteria section)
- Expected output: Test plan covering UI rendering, form validation, API integration, responsive behavior
- Security/UX considerations: Security-focused testing for auth and data handling

## 4. Dependencies & Environment Vars

Required packages:
- next (v16+)
- react (v18+)
- react-dom (v18+)
- typescript
- @types/react
- @types/node
- tailwindcss
- postcss
- autoprefixer
- Better Auth client packages

Environment variables needed by frontend:
- NEXT_PUBLIC_API_URL: Base URL for API endpoints
- NEXT_PUBLIC_BETTER_AUTH_URL: Better Auth server URL (if hosted separately)

## 5. Acceptance Criteria for Frontend Completion

- [ ] Responsive: Works on mobile (320px+), tablet, desktop – no overflow, proper stacking
- [ ] Styling: Zabardast – clean, modern, no clashing colors; Tailwind only
- [ ] Auth: Signup/signin redirects to /tasks; JWT auto-attached; logout clears session
- [ ] Performance: SSR for initial loads; Client-side for interactions (no hydration errors)
- [ ] Testing: UI renders without errors; Forms validate (title required); API calls handle loading/errors
- [ ] Security: No token exposure in client logs; Isolation via user_id in paths
- [ ] Components: All reusable components from spec are implemented
- [ ] Pages: All required pages exist and function correctly
- [ ] API Integration: All API endpoints are properly called with JWT tokens
- [ ] Error Handling: Loading states, error messages, and success feedback are displayed appropriately

## 6. Safety & Pause Rules
- Backend implementation is paused - no FastAPI, SQLModel, or Neon DB work until backend phase
- No cross-layer changes until explicitly instructed
- No actual code generation or file creation until user says "start frontend implementation"
- All work must remain spec-driven using @specs/... references
- Wait for explicit instruction before spawning any agents or creating any files