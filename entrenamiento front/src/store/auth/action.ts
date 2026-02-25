import { SagaCallback } from '@/utils/common';
import { LoginCredentials, LoginResponse, User } from '@/utils/types/auth.types';
import { createAction } from '@reduxjs/toolkit';
import {
  CHECK_AUTH,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  SET_USER,
} from './action-types';

export const login = createAction<{ credentials: LoginCredentials; callback?: SagaCallback<LoginResponse> }>(LOGIN);
export const loginSuccess = createAction<LoginResponse>(LOGIN_SUCCESS);
export const loginFailure = createAction<string>(LOGIN_FAILURE);

export const logout = createAction<{ callback?: SagaCallback<void> }>(LOGOUT);
export const logoutSuccess = createAction(LOGOUT_SUCCESS);

export const checkAuth = createAction(CHECK_AUTH);
export const setUser = createAction<User | null>(SET_USER);
