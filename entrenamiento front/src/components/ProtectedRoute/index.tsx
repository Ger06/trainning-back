'use client';

import { RootState } from '@/store';
import { checkAuth } from '@/store/auth/action';
import { UserRole } from '@/utils/types/auth.types';
import { useRouter } from '@/i18n/routing';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }

    if (!isLoading && isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user.role === UserRole.TRAINER) {
        router.push('/trainer/dashboard');
      } else if (user.role === UserRole.STUDENT) {
        router.push('/student/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router, redirectTo]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
