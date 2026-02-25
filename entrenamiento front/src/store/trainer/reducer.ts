import { Routine, Student } from '@/utils/types/training.types';
import { createReducer } from '@reduxjs/toolkit';
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
  searchStudentsSuccess,
  setSelectedRoutine,
  setSelectedStudent,
  updateRoutine,
  updateRoutineFailure,
  updateRoutineSuccess,
} from './action';

interface TrainerState {
  students: Student[];
  filteredStudents: Student[];
  selectedStudent: Student | null;
  routines: Routine[];
  selectedRoutine: Routine | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TrainerState = {
  students: [],
  filteredStudents: [],
  selectedStudent: null,
  routines: [],
  selectedRoutine: null,
  isLoading: false,
  error: null,
};

const trainerReducer = createReducer(initialState, (builder) => {
  builder
    // Fetch students
    .addCase(fetchStudents, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchStudentsSuccess, (state, action) => {
      state.isLoading = false;
      state.students = action.payload;
      state.filteredStudents = action.payload;
    })
    .addCase(fetchStudentsFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Search students
    .addCase(searchStudentsSuccess, (state, action) => {
      state.filteredStudents = action.payload;
    })
    // Set selected student
    .addCase(setSelectedStudent, (state, action) => {
      state.selectedStudent = action.payload;
    })
    // Create routine
    .addCase(createRoutine, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(createRoutineSuccess, (state, action) => {
      state.isLoading = false;
      state.routines.push(action.payload);
    })
    .addCase(createRoutineFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Update routine
    .addCase(updateRoutine, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateRoutineSuccess, (state, action) => {
      state.isLoading = false;
      const index = state.routines.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.routines[index] = action.payload;
      }
    })
    .addCase(updateRoutineFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Delete routine
    .addCase(deleteRoutine, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteRoutineSuccess, (state, action) => {
      state.isLoading = false;
      state.routines = state.routines.filter((r) => r.id !== action.payload);
    })
    .addCase(deleteRoutineFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Fetch student routines
    .addCase(fetchStudentRoutines, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchStudentRoutinesSuccess, (state, action) => {
      state.isLoading = false;
      state.routines = action.payload;
    })
    .addCase(fetchStudentRoutinesFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Set selected routine
    .addCase(setSelectedRoutine, (state, action) => {
      state.selectedRoutine = action.payload;
    });
});

export default trainerReducer;
