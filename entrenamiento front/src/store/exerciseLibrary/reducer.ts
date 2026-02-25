import { ExerciseTemplate } from '@/utils/types/library.types';
import { createReducer } from '@reduxjs/toolkit';
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
  searchExercisesSuccess,
  setSelectedExercise,
  updateExercise,
  updateExerciseFailure,
  updateExerciseSuccess,
} from './action';

interface ExerciseLibraryState {
  exercises: ExerciseTemplate[];
  filteredExercises: ExerciseTemplate[];
  selectedExercise: ExerciseTemplate | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExerciseLibraryState = {
  exercises: [],
  filteredExercises: [],
  selectedExercise: null,
  isLoading: false,
  error: null,
};

const exerciseLibraryReducer = createReducer(initialState, (builder) => {
  builder
    // Fetch exercises
    .addCase(fetchExercises, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchExercisesSuccess, (state, action) => {
      state.isLoading = false;
      state.exercises = action.payload;
      state.filteredExercises = action.payload;
    })
    .addCase(fetchExercisesFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Search exercises
    .addCase(searchExercisesSuccess, (state, action) => {
      state.filteredExercises = action.payload;
    })
    // Create exercise
    .addCase(createExercise, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(createExerciseSuccess, (state, action) => {
      state.isLoading = false;
      state.exercises.push(action.payload);
      state.filteredExercises.push(action.payload);
    })
    .addCase(createExerciseFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Update exercise
    .addCase(updateExercise, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateExerciseSuccess, (state, action) => {
      state.isLoading = false;
      const index = state.exercises.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.exercises[index] = action.payload;
      }
      const filteredIndex = state.filteredExercises.findIndex((e) => e.id === action.payload.id);
      if (filteredIndex !== -1) {
        state.filteredExercises[filteredIndex] = action.payload;
      }
    })
    .addCase(updateExerciseFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Delete exercise
    .addCase(deleteExercise, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteExerciseSuccess, (state, action) => {
      state.isLoading = false;
      state.exercises = state.exercises.filter((e) => e.id !== action.payload);
      state.filteredExercises = state.filteredExercises.filter((e) => e.id !== action.payload);
    })
    .addCase(deleteExerciseFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Set selected exercise
    .addCase(setSelectedExercise, (state, action) => {
      state.selectedExercise = action.payload;
    });
});

export default exerciseLibraryReducer;
