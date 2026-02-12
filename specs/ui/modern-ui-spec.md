# Modern UI Specification for Todo App Phase II

## Overview
This specification defines the modern UI implementation for the Todo App Phase II, using Next.js 16+ with App Router and a shadcn-inspired design system. The UI must be sleek, modern, and follow contemporary design trends with subtle animations, glass-morphism effects, and a cohesive color palette. All animations and micro-interactions should be implemented using Tailwind CSS and Framer Motion for premium user experience.

## Design Principles
- Minimalist design with ample whitespace
- Consistent spacing and typography
- Subtle shadows and depth effects
- Smooth transitions and micro-interactions
- Dark/light mode support with seamless switching
- Accessibility-first approach with proper contrast ratios

## Color Palette
- Primary: slate-900 (dark), slate-50 (light)
- Secondary: slate-700 (dark), slate-200 (light)
- Accent: blue-500, blue-600
- Success: emerald-500
- Warning: amber-500
- Danger: red-500
- Background: white/light gray for light mode, gray-900 for dark mode

## Component Structure (/components/)
- Reusable UI components following shadcn patterns:
  - Card: Elevated containers with subtle shadows and rounded corners
  - Button: Multiple variants (primary, secondary, outline, ghost, link) with hover animations and click feedback
  - Input: Modern text inputs with focus states and floating label animations
  - Label: Associated form labels
  - Badge: Status indicators with multiple variants
  - Alert: Notification and warning components with slide-in animations
  - Skeleton: Loading placeholders with shimmer animations
  - Separator: Dividers between sections
  - Switch: Modern toggle switches with smooth transition animations
  - Checkbox: Styled checkboxes with checkmark animations
  - Dialog: Modal dialogs with overlay and entrance animations
  - Dropdown Menu: Context menus with smooth open/close animations
  - Sheet: Slide-over panels with directional animations
  - Tabs: Tabbed interfaces with indicator animations
  - Tooltip: Hover tooltips with fade-in animations

## Page Structure (/app/)
- Layouts: Root layout with modern sidebar navigation
- Pages:
  - /signup & /signin: Clean authentication forms with glass-morphism effect and form field animations
  - /: Dashboard redirect
  - /tasks: Main task management with Kanban-style layout option and task card animations
  - /tasks/[id]: Detailed task view with expandable sections and smooth transitions
- Error Handling: Modern error pages with illustrations and fade-in animations

## Styling Guidelines for Modern UI
- Use Tailwind CSS with custom configuration for shadcn-like styles
- Implement dark mode using Tailwind's dark: prefix
- Consistent border-radius (e.g., 0.5rem for most components)
- Consistent box-shadow for elevation (e.g., 0 4px 6px -1px rgba(0, 0, 0, 0.1))
- Smooth transitions for interactive elements (e.g., transition-all duration-200)
- Typography hierarchy with proper font weights and sizes

## Modern UI Elements
- Glass-morphism cards with backdrop-blur and hover animations
- Floating action buttons with ripple effects
- Animated progress indicators with pulse animations
- Collapsible sections with smooth height animations
- Interactive hover states for all clickable elements (scale, shadow lift)
- Floating labels in forms with smooth transitions
- Animated empty states with illustrations and entrance animations

## Animation Guidelines
- Subtle fade-in animations for content loading using Framer Motion's AnimatePresence
- Smooth slide transitions for modals and sheets using Framer Motion
- Hover animations for interactive elements (card scale + shadow lift, button ripple/click feedback)
- Micro-interactions for button clicks using Framer Motion's tap handlers
- Progress animations for loading states with pulse effects
- Task complete checkmark burst/confetti or bounce animation using Framer Motion
- Loading spinner with pulse animation
- Toast/slide-in messages using Framer Motion's motion components

## Responsive Design
- Mobile-first approach with progressive enhancement
- Adaptive layouts for different screen sizes
- Touch-friendly targets for mobile devices
- Optimized navigation for mobile (hamburger menu)
- Proper flex/grid stacking for mobile views
- No horizontal overflow on small screens
- Readable font sizes on small screens
- Touch-friendly buttons with appropriate sizing

## Accessibility
- Proper semantic HTML structure
- ARIA attributes for complex components
- Keyboard navigation support
- Screen reader compatibility
- Focus management in modals and forms
- Reduced motion support for users with motion sensitivity

## Framer Motion Integration
- Import motion components from 'framer-motion' for animations
- Use AnimatePresence for mount/unmount animations
- Implement stagger animations for lists of items
- Use spring physics for natural-feeling animations
- Apply reduced motion settings for accessibility compliance

## Implementation Notes
- Components should be built with composition in mind
- Follow shadcn's approach to styling with class composition
- Use Radix UI primitives for accessible base components
- Implement a consistent design system across the app
- Leverage Framer Motion for premium animations and transitions