// components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Close mobile menu when clicking a link
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <motion.span 
              className="text-xl font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              Todo App
            </motion.span>
          </Link>
          <nav className="hidden md:flex md:gap-6 lg:gap-8">
            <Link
              href="/tasks"
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                pathname === '/tasks' ? 'text-foreground' : 'text-foreground/60'
              }`}
              onClick={closeMenu}
            >
              Tasks
              {pathname === '/tasks' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="navbarIndicator"
                />
              )}
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center gap-4">
              <motion.span 
                className="text-sm font-medium text-muted-foreground"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {user.name || user.email}
              </motion.span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </motion.div>
            </div>
          )}

          <div className="flex items-center md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-accent"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t bg-background"
          >
            <div className="space-y-1 p-4">
              <Link
                href="/tasks"
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  pathname === '/tasks'
                    ? 'bg-accent text-foreground'
                    : 'text-foreground/60 hover:bg-accent'
                }`}
                onClick={closeMenu}
              >
                Tasks
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium rounded-md text-foreground/60 hover:bg-accent"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;