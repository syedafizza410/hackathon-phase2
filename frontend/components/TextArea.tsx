// components/TextArea.tsx
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type TextAreaProps = HTMLMotionProps<'textarea'> & {
  label?: string;
  error?: string;
  helperText?: string;
};

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const textareaClasses = `block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 ${
    error
      ? 'border-red-300'
      : 'border-gray-300'
  } ${className}`;

  return (
    <div>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <motion.textarea
        {...props}
        className={textareaClasses}
        whileFocus={{
          scale: 1.01,
          boxShadow: '0 0 0 3px hsl(var(--ring)/0.3)'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default TextArea;