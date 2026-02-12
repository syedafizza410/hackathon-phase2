// components/Input.tsx
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type InputProps = HTMLMotionProps<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <motion.input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
        ref={ref}
        whileFocus={{
          scale: 1.02,
          boxShadow: '0 0 0 3px hsl(var(--ring)/0.3)'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;