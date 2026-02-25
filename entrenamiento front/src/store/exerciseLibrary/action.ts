import { SagaCallback } from '@/utils/common';
import { CreateExerciseTemplatePayload, ExerciseTemplate } from '@/utils/types/library.types';
import { createAction } from '@reduxjs/toolkit';
import {
  CREATE_EXERCISE,
  CREATE_EXERCISE_FAILURE,
  CREATE_EXERCISE_SUCCESS,
  DELETE_EXERCISE,
  DELETE_EXERCISE_FAILURE,
  DELETE_EXERCISE_SUCCESS,
  FETCH_EXERCISES,
  FETCH_EXERCISES_FAILURE,
  FETCH_EXERCISES_SUCCESS,
  SEARCH_EXERCISES,
  SEARCH_EXERCISES_SUCCESS,
  SET_SELECTED_EXERCISE,
  UPDATE_EXERCISE,
  UPDATE_EXERCISE_FAILURE,
  UPDATE_EXERCISE_SUCCESS,
} from './action-types';

// Fetch exercises
export const fetchExercises = createAction<{ callback?: SagaCallback<ExerciseTemplate[]> }>(FETCH_EXERCISES);
export const fetchExercisesSuccess = createAction<ExerciseTemplate[]>(FETCH_EXERCISES_SUCCESS);
export const fetchExercisesFailure = createAction<string>(FETCH_EXERCISES_FAILURE);

// Search exercises
export const searchExercises = createAction<{ query: string }>(SEARCH_EXERCISES);
export const searchExercisesSuccess = createAction<ExerciseTemplate[]>(SEARCH_EXERCISES_SUCCESS);

// Create exercise
export const createExercise = createAction<{
  payload: CreateExerciseTemplatePayload;
  callback?: SagaCallback<ExerciseTemplate>;
}>(CREATE_EXERCISE);
export const createExerciseSuccess = createAction<ExerciseTemplate>(CREATE_EXERCISE_SUCCESS);
export const createExerciseFailure = createAction<string>(CREATE_EXERCISE_FAILURE);

// Update exercise
export const updateExercise = createAction<{
  payload: CreateExerciseTemplatePayload & { id: string };
  callback?: SagaCallback<ExerciseTemplate>;
}>(UPDATE_EXERCISE);
export const updateExerciseSuccess = createAction<ExerciseTemplate>(UPDATE_EXERCISE_SUCCESS);
export const updateExerciseFailure = createAction<string>(UPDATE_EXERCISE_FAILURE);

// Delete exercise
export const deleteExercise = createAction<{ exerciseId: string; callback?: SagaCallback<void> }>(DELETE_EXERCISE);
export const deleteExerciseSuccess = createAction<string>(DELETE_EXERCISE_SUCCESS);
export const deleteExerciseFailure = createAction<string>(DELETE_EXERCISE_FAILURE);

// Set selected exercise
export const setSelectedExercise = createAction<ExerciseTemplate | null>(SET_SELECTED_EXERCISE);
