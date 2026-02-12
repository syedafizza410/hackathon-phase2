# Component Guidelines Specification

## Overview
This specification defines the reusable UI components for the Todo App Phase II frontend. All components should follow consistent design patterns and be built with Tailwind CSS for styling. Components must incorporate modern animations and micro-interactions using Framer Motion for enhanced user experience.

## Component Categories

### 1. Layout Components
- **Navbar**: Navigation bar with app branding and user profile/logout
- **Layout**: Main layout wrapper with consistent padding and max-width
- **Container**: Responsive container with centered content

### 2. Task-Specific Components
- **TaskCard**: Display individual task information with action buttons
- **TaskForm**: Form for creating and editing tasks
- **TaskFilter**: Controls for filtering and sorting tasks

### 3. Form Components
- **InputField**: Styled input with validation states
- **TextArea**: Styled textarea with validation states
- **Button**: Consistently styled buttons with variants
- **Select**: Styled dropdown with consistent appearance

### 4. Utility Components
- **LoadingSpinner**: Visual indicator for loading states
- **ErrorMessage**: Consistent error message display
- **SuccessMessage**: Success feedback display
- **Modal**: Reusable modal dialog component

## Component Specifications

### TaskCard Component
**Props:**
- `task`: Task object with id, title, description, completed, createdAt
- `onEdit`: Function to handle edit action
- `onDelete`: Function to handle delete action
- `onToggleComplete`: Function to handle completion toggle

**Styling:**
- Card with shadow-md, rounded-lg
- Hover effect with hover:scale-105 and hover:shadow-lg for lift effect
- Flex layout for content and actions
- Different styling for completed tasks (line-through, opacity)
- Smooth transition for hover effects using transition-transform duration-200
- Animation for task completion (bounce or checkmark burst effect)

### TaskForm Component
**Props:**
- `initialData`: Optional task data for editing
- `onSubmit`: Function to handle form submission
- `onCancel`: Function to handle cancel action (optional)

**Styling:**
- Clean inputs with focus:ring-2 and focus:ring-blue-500
- Error messages in text-red-500 with slide-down animation
- Consistent spacing and alignment
- Submit button with bg-blue-500 hover:bg-blue-600 and hover:scale-[1.02] for subtle feedback
- Input focus glow effect with ring-2 ring-blue-500
- Form field animations using Framer Motion for entrance

### Navbar Component
**Props:**
- `user`: User object with name/email for display
- `onLogout`: Function to handle logout

**Styling:**
- Fixed/sticky positioning
- bg-white with shadow-sm
- Responsive hamburger menu for mobile with animated icon
- Consistent spacing and typography
- Smooth transitions for mobile menu toggle
- Hover animations for navigation links

### LoadingSpinner Component
**Props:**
- `size`: Size variant ('sm', 'md', 'lg')

**Styling:**
- Animate-spin with Tailwind
- Consistent colors matching theme
- Pulse animation for visual interest
- Proper sizing based on variant
- Smooth entrance animation using Framer Motion

### ErrorMessage Component
**Props:**
- `message`: Error message to display
- `onDismiss`: Optional function to handle dismiss action

**Styling:**
- bg-red-100 with border-red-400
- Proper padding and rounded corners
- Slide-in animation from top using Framer Motion
- Dismiss button with hover effect if onDismiss is provided
- Fade-out animation when dismissed

## Styling Guidelines

### Color Palette
- Primary: blue-500 (#3B82F6)
- Secondary: gray-200, gray-300, gray-500
- Success: green-500
- Error: red-500
- Background: white, gray-50

### Spacing System
- Use Tailwind's spacing scale (p-2, p-4, m-2, m-4, etc.)
- Consistent padding and margins across components
- Responsive spacing for different screen sizes

### Typography
- Use Tailwind's font system
- Consistent heading hierarchy
- Proper line heights and letter spacing

### Responsive Design
- Mobile-first approach
- Use sm:, md:, lg: prefixes for responsive styles
- Stack elements vertically on small screens
- Side-by-side layout on medium+ screens
- Proper flex/grid stacking for mobile views
- No horizontal overflow on small screens
- Readable font sizes on small screens
- Touch-friendly buttons with appropriate sizing

### Animation Guidelines
- Use Framer Motion for complex animations
- Apply smooth transitions for interactive elements
- Implement stagger animations for lists of items
- Add entrance animations for components
- Include micro-interactions for user feedback
- Support reduced motion for accessibility

## Accessibility Standards
- All interactive elements must have proper ARIA attributes
- Keyboard navigation support
- Sufficient color contrast
- Semantic HTML elements
- Focus states for keyboard users
- Reduced motion support for users with motion sensitivity
- Proper labeling for form elements

## State Management
- Components should accept necessary props rather than managing their own state when possible
- Use React hooks appropriately for internal component state
- Pass callbacks for actions that affect parent state

## Testing Considerations
- Components should be easily testable with React Testing Library
- Expose necessary test IDs for automated testing
- Follow component best practices for testability
- Account for animation states in tests