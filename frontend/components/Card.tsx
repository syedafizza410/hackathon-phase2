// components/Card.tsx
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  animateOnHover?: boolean;
}

// Other Card subcomponent props
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, animateOnHover = false, ...props }) => {
  const baseClasses =
    "rounded-lg border bg-gradient-to-r from-blue-400 to-pink-400 bg-opacity-20 backdrop-blur-md shadow-xl transition-shadow duration-300";

  if (animateOnHover) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        whileHover={{
          y: -5,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      />
    );
  }

  // Continuous slow floating motion
  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      animate={{ y: [0, -5, 0, 5, 0] }} // vertical floating
      transition={{ 
        duration: 10,     
        repeat: Infinity,  // loop forever
        ease: "easeInOut"  // smooth easing
      }}
      {...props}
    />
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

const CardTitle: React.FC<CardTitleProps> = ({ className, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
);

const CardDescription: React.FC<CardDescriptionProps> = ({ className, ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props} />
);

const CardContent: React.FC<CardContentProps> = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

const CardFooter: React.FC<CardFooterProps> = ({ className, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
);

export default Card;
export { CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
