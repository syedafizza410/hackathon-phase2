// hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Hook to redirect to login if not authenticated
export const useAuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);
  
  return { isAuthenticated, loading };
};

// Hook to redirect to tasks if already authenticated
export const useRedirectIfAuthenticated = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/tasks');
    }
  }, [isAuthenticated, loading, router]);
  
  return { isAuthenticated, loading };
};