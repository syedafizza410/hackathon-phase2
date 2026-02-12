# Todo App Frontend

This is the frontend for the Todo App Phase II, built with Next.js 16+, TypeScript, and Tailwind CSS.

## Features

- User authentication (signup/signin) with Better Auth
- Task management (create, read, update, delete)
- Task completion toggling
- Filtering and sorting of tasks
- Responsive design for all device sizes
- JWT-based authentication

## Tech Stack

- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- React Hooks for state management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── api/             # API routes
│   ├── signin/          # Signin page
│   ├── signup/          # Signup page
│   ├── tasks/           # Tasks pages
│   └── layout.tsx       # Root layout
├── components/          # Reusable UI components
├── lib/                 # Utility functions and API client
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── contexts/            # React Context providers
├── utils/               # Utility functions
└── public/              # Static assets
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Base URL for Better Auth

## API Integration

The frontend communicates with the backend through the API client located at `lib/api.ts`. All API requests include JWT tokens in the Authorization header automatically.

## Authentication

Authentication is handled through Better Auth. The auth context is provided globally through the AuthProvider in the root layout.

## Components

Reusable components are located in the `components/` directory:

- `TaskCard` - Displays individual tasks
- `TaskForm` - Handles task creation and editing
- `Navbar` - Navigation component
- `LoadingSpinner` - Loading indicator
- `ErrorMessage` - Error display component
- `Modal` - Modal dialog component
- `FilterControls` - Task filtering and sorting controls
- `ProtectedRoute` - Route protection component