import { AuthState } from '@/utils/types/auth.types';
import { createReducer } from '@reduxjs/toolkit';
import { checkAuth, login, loginFailure, loginSuccess, logout, logoutSuccess, setUser } from './action';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginSuccess, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    })
    .addCase(loginFailure, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    })
    .addCase(logout, (state) => {
      state.isLoading = true;
    })
    .addCase(logoutSuccess, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    })
    .addCase(checkAuth, (state) => {
      state.isLoading = true;
    })
    .addCase(setUser, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      }
    });
});

export default authReducer;
