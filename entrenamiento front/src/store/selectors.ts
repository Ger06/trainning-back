import { RootState } from '.';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// Trainer selectors
export const selectTrainer = (state: RootState) => state.trainer;
export const selectStudents = (state: RootState) => state.trainer.students;

// Exercise Library selectors
export const selectExerciseLibrary = (state: RootState) => state.exerciseLibrary;
export const selectExercises = (state: RootState) => state.exerciseLibrary.exercises;
