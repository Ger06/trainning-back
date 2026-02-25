import { CreateRoutinePayload, DayOfWeek, Routine, Student, UpdateRoutinePayload } from '@/utils/types/training.types';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from '..';
import {
  createRoutine,
  createRoutineFailure,
  createRoutineSuccess,
  deleteRoutine,
  deleteRoutineFailure,
  deleteRoutineSuccess,
  fetchStudents,
  fetchStudentsFailure,
  fetchStudentsSuccess,
  fetchStudentRoutines,
  fetchStudentRoutinesFailure,
  fetchStudentRoutinesSuccess,
  searchStudents,
  searchStudentsSuccess,
  updateRoutine,
  updateRoutineFailure,
  updateRoutineSuccess,
} from './action';

// In-memory storage for routines (mock backend)
let routinesStorage: Routine[] = [];

// Mock API calls - Replace with actual API calls
const fetchStudentsApi = async (): Promise<Student[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          age: 25,
          weight: 75,
          height: 175,
          goal: 'Ganar masa muscular',
          assignedRoutines: [],
          trainerId: '1',
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria@example.com',
          age: 30,
          weight: 60,
          height: 165,
          goal: 'Perder peso',
          assignedRoutines: [],
          trainerId: '1',
        },
        {
          id: '3',
          name: 'Carlos López',
          email: 'carlos@example.com',
          age: 28,
          weight: 80,
          height: 180,
          goal: 'Mejorar resistencia',
          assignedRoutines: [],
          trainerId: '1',
        },
      ]);
    }, 500);
  });
};

const createRoutineApi = async (payload: CreateRoutinePayload): Promise<Routine> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRoutine: Routine = {
        id: `routine-${Date.now()}`,
        ...payload,
        trainerId: '1',
        exercises: payload.exercises.map((ex, idx) => ({ ...ex, id: `ex-${idx}` })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Save to in-memory storage
      routinesStorage.push(newRoutine);
      resolve(newRoutine);
    }, 500);
  });
};

const updateRoutineApi = async (payload: UpdateRoutinePayload): Promise<Routine> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedRoutine: Routine = {
        id: payload.id,
        name: payload.name || '',
        dayOfWeek: payload.dayOfWeek || DayOfWeek.MONDAY,
        studentId: payload.studentId || '',
        trainerId: '1',
        exercises: payload.exercises?.map((ex, idx) => ({ ...ex, id: `ex-${idx}` })) || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Update in-memory storage
      const index = routinesStorage.findIndex((r) => r.id === payload.id);
      if (index !== -1) {
        routinesStorage[index] = updatedRoutine;
      }
      resolve(updatedRoutine);
    }, 500);
  });
};

const deleteRoutineApi = async (routineId: string): Promise<void> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Remove from in-memory storage
      routinesStorage = routinesStorage.filter((r) => r.id !== routineId);
      resolve();
    }, 500);
  });
};

const fetchStudentRoutinesApi = async (studentId: string): Promise<Routine[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter routines from in-memory storage for this student
      const studentRoutines = routinesStorage.filter((r) => r.studentId === studentId);
      resolve(studentRoutines);
    }, 500);
  });
};

function* handleFetchStudents(action: ReturnType<typeof fetchStudents>) {
  try {
    const students: Student[] = yield call(fetchStudentsApi);
    yield put(fetchStudentsSuccess(students));

    if (action.payload.callback) {
      action.payload.callback({ ok: true, data: students });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to fetch students';
    yield put(fetchStudentsFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleSearchStudents(action: ReturnType<typeof searchStudents>) {
  try {
    const students: Student[] = yield select((state: RootState) => state.trainer.students);
    const query = action.payload.query.toLowerCase();

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.goal?.toLowerCase().includes(query)
    );

    yield put(searchStudentsSuccess(filtered));
  } catch (error) {
    // Handle error if needed
  }
}

function* handleCreateRoutine(action: ReturnType<typeof createRoutine>) {
  try {
    const routine: Routine = yield call(createRoutineApi, action.payload.payload);
    yield put(createRoutineSuccess(routine));

    if (action.payload.callback) {
      action.payload.callback({ ok: true, data: routine });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to create routine';
    yield put(createRoutineFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleUpdateRoutine(action: ReturnType<typeof updateRoutine>) {
  try {
    const routine: Routine = yield call(updateRoutineApi, action.payload.payload);
    yield put(updateRoutineSuccess(routine));

    if (action.payload.callback) {
      action.payload.callback({ ok: true, data: routine });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to update routine';
    yield put(updateRoutineFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleDeleteRoutine(action: ReturnType<typeof deleteRoutine>) {
  try {
    yield call(deleteRoutineApi, action.payload.routineId);
    yield put(deleteRoutineSuccess(action.payload.routineId));

    if (action.payload.callback) {
      action.payload.callback({ ok: true });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to delete routine';
    yield put(deleteRoutineFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleFetchStudentRoutines(action: ReturnType<typeof fetchStudentRoutines>) {
  try {
    const routines: Routine[] = yield call(fetchStudentRoutinesApi, action.payload.studentId);
    yield put(fetchStudentRoutinesSuccess(routines));

    if (action.payload.callback) {
      action.payload.callback({ ok: true, data: routines });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to fetch student routines';
    yield put(fetchStudentRoutinesFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

export function* watchFetchStudents() {
  yield takeLatest(fetchStudents.type, handleFetchStudents);
}

export function* watchSearchStudents() {
  yield takeLatest(searchStudents.type, handleSearchStudents);
}

export function* watchCreateRoutine() {
  yield takeLatest(createRoutine.type, handleCreateRoutine);
}

export function* watchUpdateRoutine() {
  yield takeLatest(updateRoutine.type, handleUpdateRoutine);
}

export function* watchDeleteRoutine() {
  yield takeLatest(deleteRoutine.type, handleDeleteRoutine);
}

export function* watchFetchStudentRoutines() {
  yield takeLatest(fetchStudentRoutines.type, handleFetchStudentRoutines);
}
