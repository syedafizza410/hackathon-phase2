# Frontend Specification for Todo App Phase II

## Overview
This spec defines the frontend implementation for the Todo App Phase II, using Next.js 16+ with App Router. The frontend must be responsive, user-friendly, and integrated with Better Auth for authentication and JWT handling. Styling must be excellent using Tailwind CSS – clean, modern, consistent themes (e.g., dark/light mode optional, but responsive breakpoints mandatory). No inline styles; use Tailwind classes for reusability.

All components and pages MUST follow server-side rendering (SSR) by default for performance, with client-side only for interactive elements (e.g., forms, toggles). API calls MUST go through a centralized client (/lib/api.ts) that attaches JWT tokens.

This spec is driven by @specs/features/task-crud.md, @specs/features/authentication.md, and @specs/api/rest-endpoints.md. Acceptance criteria include excellent UX/UI with Tailwind (e.g., hover effects, transitions, grid/flex layouts for responsiveness).

## User Stories for Frontend
- As a user, I can signup/signin via Better Auth to access my tasks.
- As a user, I can view a responsive dashboard listing my tasks (with filtering by status).
- As a user, I can create, edit, delete, and toggle tasks via intuitive forms/modals.
- As a user, I can see loading states, errors (e.g., 401 redirect to login), and success messages.
- As a user, the app is mobile-friendly (responsive design with Tailwind breakpoints: sm, md, lg).

## Technology Guidelines
- Next.js 16+ App Router: Use /app/ for pages and layouts.
- TypeScript: All code typed (e.g., Task interface from API).
- Tailwind CSS: For zabardast styling – use utility classes for layouts (flex, grid), colors (custom theme e.g., primary-blue, neutral-gray), typography, shadows, transitions (e.g., hover:scale-105).
  - Theme: Modern minimalist (e.g., white/bg-gray-100 for light, bg-gray-800 for dark if implemented).
  - Responsiveness: Use sm:, md:, lg: prefixes for breakpoints (e.g., flex-col md:flex-row).
  - No custom CSS files unless absolutely needed; stick to Tailwind for consistency.
- Better Auth: Configure with JWT plugin for signup/signin; store token securely (cookies preferred).
- API Client: /lib/api.ts – Wrapper for fetch with base URL (env NEXT_PUBLIC_API_URL), auto-attach Authorization: Bearer <JWT>, handle 401 (redirect to /login).

## Component Structure (/components/)
- Reusable UI components with Tailwind:
  - TaskCard: Displays title, description, status, created date. Styling: Card with shadow-md, rounded-lg, hover:bg-gray-50, flex layout for info + actions (edit/delete buttons with icons).
  - TaskForm: Form for create/edit (title input, description textarea, submit button). Styling: Clean inputs with focus:ring-2, error messages in text-red-500.
  - LoadingSpinner: Simple spinner for API loading. Styling: Animate-spin with Tailwind.
  - ErrorMessage: Red alert box for API errors. Styling: bg-red-100 border-red-400 p-4 rounded.
  - Navbar: Top bar with logo, user profile/logout. Styling: Fixed/sticky, bg-white shadow-sm, responsive menu (hamburger on mobile).
- Patterns: Export as server components unless interactive (add 'use client' for forms).

## Page Structure (/app/)
- Layouts: Root layout with <html>, <body>, Navbar, and main content wrapper. Styling: max-w-7xl mx-auto for centering, padding-x-4 sm:px-6 lg:px-8.
- Pages:
  - /signup & /signin: Better Auth forms. Styling: Centered card (w-full md:w-1/2), inputs with label float, button bg-blue-500 hover:bg-blue-600 text-white.
  - /: Redirect to /tasks if logged in, else /signin.
  - /tasks: Dashboard page – List tasks in grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3), with filters (dropdown for status/sort). Use TaskCard components. Add "New Task" button/modal. Styling: Responsive grid with gap-4, filters in flex row with select inputs.
  - /tasks/[id]: View/edit single task (dynamic route). Styling: Full-width card, form integrated.
- Error Handling: Custom error.tsx for 404/500. Styling: Centered message with icon.

## API Integration (/lib/api.ts)
- Typed functions for each endpoint (e.g., getTasks(userId: string): Promise<Task[]>).
- Attach JWT: Get token from Better Auth session/cookies, add header if present.
- Error Handling: Throw/catch for 401 (redirect), 403 (forbidden message), 500 (retry prompt).
- Use fetch with credentials: 'include' for auth.

## Styling Guidelines for Zabardast UI
- Tailwind Config: Extend theme with custom colors (e.g., primary: '#3B82F6'), fonts (sans-serif default).
- Responsiveness: All layouts mobile-first (e.g., stack on small screens, side-by-side on md+).
- Accessibility: Use aria-labels, focus states (outline-none focus:ring-2).
- Animations: Subtle transitions and micro-interactions using Tailwind and Framer Motion (e.g., transition duration-200 for hover, scale transforms, opacity changes).
- Themes: Optional dark mode via Tailwind 'dark:' prefix (e.g., dark:bg-gray-900).
- Consistency: Use consistent spacing (p-4, m-2), borders (border rounded-md), colors across app.
- Premium Feel: Implement glassmorphism effects, subtle gradients, clean shadows, rounded corners, and smooth animations for enhanced user experience.

## Acceptance Criteria
- Responsive: Works on mobile (320px+), tablet, desktop – no overflow, proper stacking.
- Styling: Zabardast – clean, modern, no clashing colors; Tailwind only.
- Auth: Signup/signin redirects to /tasks; JWT auto-attached; logout clears session.
- Performance: SSR for initial loads; Client-side for interactions (no hydration errors).
- Testing: UI renders without errors; Forms validate (title required); API calls handle loading/errors.
- Security: No token exposure in client logs; Isolation via user_id in paths.

## Dependencies
- next, react, react-dom
- @auth0/nextjs-auth0 or similar for Better Auth (configure JWT)
- tailwindcss, postcss, autoprefixer
- typescript, @types/...

Reference this spec for all frontend work. Update if requirements change.