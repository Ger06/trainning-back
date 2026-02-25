import { CreateExerciseTemplatePayload, ExerciseTemplate } from '@/utils/types/library.types';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from '..';
import {
  createExercise,
  createExerciseFailure,
  createExerciseSuccess,
  deleteExercise,
  deleteExerciseFailure,
  deleteExerciseSuccess,
  fetchExercises,
  fetchExercisesFailure,
  fetchExercisesSuccess,
  searchExercises,
  searchExercisesSuccess,
  updateExercise,
  updateExerciseFailure,
  updateExerciseSuccess,
} from './action';

// In-memory storage for exercise templates (mock backend)
const getDefaultExercises = (): ExerciseTemplate[] => [
  // Some default exercises
  {
    id: 'ex-template-1',
    name: 'Bench Press',
    description: 'Compound chest exercise performed lying on a bench',
    videoUrl: 'https://youtube.com/watch?v=example1',
    category: 'Strength',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    difficulty: 'intermediate',
    trainerId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ex-template-2',
    name: 'Squat',
    description: 'Fundamental lower body compound exercise',
    videoUrl: 'https://youtube.com/watch?v=example2',
    category: 'Strength',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    difficulty: 'intermediate',
    trainerId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ex-template-3',
    name: 'Pull-ups',
    description: 'Upper body pulling exercise using bodyweight',
    category: 'Strength',
    muscleGroup: 'Back',
    equipment: 'Pull-up bar',
    difficulty: 'intermediate',
    trainerId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ex-template-4',
    name: 'Plank',
    description: 'Core stability exercise',
    category: 'Core',
    muscleGroup: 'Abs',
    equipment: 'None',
    difficulty: 'beginner',
    trainerId: '1',
    createdAt: new Date().toISOString(),
  },
];

let exercisesStorage: ExerciseTemplate[] = getDefaultExercises();

// Mock API calls - Replace with actual API calls
const fetchExercisesApi = async (): Promise<ExerciseTemplate[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(exercisesStorage);
    }, 300);
  });
};

const createExerciseApi = async (payload: CreateExerciseTemplatePayload): Promise<ExerciseTemplate> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExercise: ExerciseTemplate = {
        id: `ex-template-${Date.now()}`,
        ...payload,
        trainerId: '1',
        createdAt: new Date().toISOString(),
      };
      // Save to in-memory storage - create new array to avoid mutation issues
      exercisesStorage = [...exercisesStorage, newExercise];
      resolve(newExercise);
    }, 300);
  });
};

const updateExerciseApi = async (
  payload: CreateExerciseTemplatePayload & { id: string }
): Promise<ExerciseTemplate> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedExercise: ExerciseTemplate = {
        ...payload,
        trainerId: '1',
        createdAt: new Date().toISOString(),
      };
      // Update in-memory storage - create new array
      exercisesStorage = exercisesStorage.map((e) => (e.id === payload.id ? updatedExercise : e));
      resolve(updatedExercise);
    }, 300);
  });
};

const deleteExerciseApi = async (exerciseId: string): Promise<void> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Remove from in-memory storage - create new array
      exercisesStorage = exercisesStorage.filter((e) => e.id !== exerciseId);
      resolve();
    }, 300);
  });
};

function* handleFetchExercises(action: ReturnType<typeof fetchExercises>) {
  try {
    const exercises: ExerciseTemplate[] = yield call(fetchExercisesApi);
    yield put(fetchExercisesSuccess(exercises));

    if (action.payload.callback) {
      action.payload.callback({ ok: true, data: exercises });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to fetch exercises';
    yield put(fetchExercisesFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleSearchExercises(action: ReturnType<typeof searchExercises>) {
  try {
    const exercises: ExerciseTemplate[] = yield select((state: RootState) => state.exerciseLibrary.exercises);
    const query = action.payload.query.toLowerCase();

    const filtered = exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.category?.toLowerCase().includes(query) ||
        exercise.muscleGroup?.toLowerCase().includes(query) ||
        exercise.equipment?.toLowerCase().includes(query)
    );

    yield put(searchExercisesSuccess(filtered));
  } catch (error) {
    // Handle error if needed
  }
}

function* handleCreateExercise(action: ReturnType<typeof createExercise>) {
  try {
    const exercise: ExerciseTemplate = yield call(createExerciseApi, action.payload.payload);
    yield put(createExerciseSuccess(exercise));

    if (action.payload.callback) {
      action.payload.callback({ ok: true, data: exercise });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to create exercise';
    yield put(createExerciseFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleUpdateExercise(action: ReturnType<typeof updateExercise>) {
  try {
    const exercise: ExerciseTemplate = yield call(updateExerciseApi, action.payload.payload);
    yield put(updateExerciseSuccess(exercise));

    if (action.payload.callback) {
      action.payload.callback({ ok: true, data: exercise });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to update exercise';
    yield put(updateExerciseFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

function* handleDeleteExercise(action: ReturnType<typeof deleteExercise>) {
  try {
    yield call(deleteExerciseApi, action.payload.exerciseId);
    yield put(deleteExerciseSuccess(action.payload.exerciseId));

    if (action.payload.callback) {
      action.payload.callback({ ok: true });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to delete exercise';
    yield put(deleteExerciseFailure(errorMessage));

    if (action.payload.callback) {
      action.payload.callback({ ok: false, message: errorMessage });
    }
  }
}

export function* watchFetchExercises() {
  yield takeLatest(fetchExercises.type, handleFetchExercises);
}

export function* watchSearchExercises() {
  yield takeLatest(searchExercises.type, handleSearchExercises);
}

export function* watchCreateExercise() {
  yield takeLatest(createExercise.type, handleCreateExercise);
}

export function* watchUpdateExercise() {
  yield takeLatest(updateExercise.type, handleUpdateExercise);
}

export function* watchDeleteExercise() {
  yield takeLatest(deleteExercise.type, handleDeleteExercise);
}
