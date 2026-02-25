import { LoginResponse, UserRole } from '@/utils/types/auth.types';
import { call, put, takeLatest } from 'redux-saga/effects';
import { checkAuth, login, loginFailure, loginSuccess, logout, logoutSuccess, setUser } from './action';

// Mock API calls - Replace with actual API calls
const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: '1',
          email,
          name: email === 'trainer@test.com' ? 'John Trainer' : 'Jane Student',
          role: email === 'trainer@test.com' ? UserRole.TRAINER : UserRole.STUDENT,
        },
        token: 'mock-jwt-token',
      });
    }, 1000);
  });
};

const logoutApi = async (): Promise<void> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

function* handleLogin(action: ReturnType<typeof login>) {
  try {
    const { credentials, callback } = action.payload;
    const response: LoginResponse = yield call(loginApi, credentials.email, credentials.password);

    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    yield put(loginSuccess(response));

    if (callback) {
      callback({ ok: true, data: response });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Login failed';
    yield put(loginFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleLogout(action: ReturnType<typeof logout>) {
  try {
    yield call(logoutApi);

    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }

    yield put(logoutSuccess());

    if (action.payload?.callback) {
      action.payload.callback({ ok: true });
    }
  } catch (error: any) {
    yield put(logoutSuccess()); // Still logout on error

    if (action.payload?.callback) {
      action.payload.callback({ ok: false, message: error?.message || 'Logout failed' });
    }
  }
}

function* handleCheckAuth() {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        yield put(setUser(user));
      } else {
        yield put(setUser(null));
      }
    }
  } catch (error) {
    yield put(setUser(null));
  }
}

export function* watchLogin() {
  yield takeLatest(login.type, handleLogin);
}

export function* watchLogout() {
  yield takeLatest(logout.type, handleLogout);
}

export function* watchCheckAuth() {
  yield takeLatest(checkAuth.type, handleCheckAuth);
}
