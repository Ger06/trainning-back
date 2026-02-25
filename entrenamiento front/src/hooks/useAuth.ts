'use client';

import { RootState } from '@/store';
import { login, logout } from '@/store/auth/action';
import { LoginCredentials } from '@/utils/types/auth.types';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogin = useCallback(
    (credentials: LoginCredentials, onSuccess?: () => void, onError?: (error: string) => void) => {
      dispatch(
        login({
          credentials,
          callback: ({ ok, message }) => {
            if (ok) {
              if (onSuccess) onSuccess();
            } else {
              if (onError) onError(message || 'Unknown error');
            }
          },
        })
      );
    },
    [dispatch]
  );

  const handleLogout = useCallback(
    (onSuccess?: () => void) => {
      dispatch(
        logout({
          callback: ({ ok }) => {
            if (ok && onSuccess) onSuccess();
          },
        })
      );
    },
    [dispatch]
  );

  return {
    ...auth,
    login: handleLogin,
    logout: handleLogout,
  };
};
