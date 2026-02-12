// components/Select.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
}

const Select: React.FC<SelectProps> = ({
  children,
  value,
  onValueChange,
  defaultValue
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <motion.select
      value={value || defaultValue}
      onChange={handleChange}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
      whileFocus={{ 
        scale: 1.02,
        boxShadow: '0 0 0 3px hsl(var(--ring)/0.3)'
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { selected: value === child.props.value });
        }
        return child;
      })}
    </motion.select>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ children, value }) => {
  return (
    <option value={value}>
      {children}
    </option>
  );
};

// Export dummy components to satisfy imports
const SelectTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SelectValue = ({ placeholder }: { placeholder?: string }) => <>{placeholder}</>;
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default Select;
export { SelectItem };
export { SelectTrigger };
export { SelectValue };
export { SelectContent };