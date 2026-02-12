// components/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  asChild = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95',
    ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (asChild) {
    return (
      <motion.button
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: variant !== 'link' ? 1.03 : 1 }}
        whileTap={{ scale: variant !== 'link' ? 0.98 : 1 }}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: variant !== 'link' ? 1.03 : 1 }}
      whileTap={{ scale: variant !== 'link' ? 0.98 : 1 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;