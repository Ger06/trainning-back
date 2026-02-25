import { SagaCallback } from '@/utils/common';
import { CreateRoutinePayload, Routine, Student, UpdateRoutinePayload } from '@/utils/types/training.types';
import { createAction } from '@reduxjs/toolkit';
import {
  CREATE_ROUTINE,
  CREATE_ROUTINE_FAILURE,
  CREATE_ROUTINE_SUCCESS,
  DELETE_ROUTINE,
  DELETE_ROUTINE_FAILURE,
  DELETE_ROUTINE_SUCCESS,
  FETCH_STUDENTS,
  FETCH_STUDENTS_FAILURE,
  FETCH_STUDENTS_SUCCESS,
  FETCH_STUDENT_ROUTINES,
  FETCH_STUDENT_ROUTINES_FAILURE,
  FETCH_STUDENT_ROUTINES_SUCCESS,
  SEARCH_STUDENTS,
  SEARCH_STUDENTS_SUCCESS,
  SET_SELECTED_ROUTINE,
  SET_SELECTED_STUDENT,
  UPDATE_ROUTINE,
  UPDATE_ROUTINE_FAILURE,
  UPDATE_ROUTINE_SUCCESS,
} from './action-types';

// Students
export const fetchStudents = createAction<{ callback?: SagaCallback<Student[]> }>(FETCH_STUDENTS);
export const fetchStudentsSuccess = createAction<Student[]>(FETCH_STUDENTS_SUCCESS);
export const fetchStudentsFailure = createAction<string>(FETCH_STUDENTS_FAILURE);

export const searchStudents = createAction<{ query: string }>(SEARCH_STUDENTS);
export const searchStudentsSuccess = createAction<Student[]>(SEARCH_STUDENTS_SUCCESS);

export const setSelectedStudent = createAction<Student | null>(SET_SELECTED_STUDENT);

// Routines
export const createRoutine = createAction<{ payload: CreateRoutinePayload; callback?: SagaCallback<Routine> }>(
  CREATE_ROUTINE
);
export const createRoutineSuccess = createAction<Routine>(CREATE_ROUTINE_SUCCESS);
export const createRoutineFailure = createAction<string>(CREATE_ROUTINE_FAILURE);

export const updateRoutine = createAction<{ payload: UpdateRoutinePayload; callback?: SagaCallback<Routine> }>(
  UPDATE_ROUTINE
);
export const updateRoutineSuccess = createAction<Routine>(UPDATE_ROUTINE_SUCCESS);
export const updateRoutineFailure = createAction<string>(UPDATE_ROUTINE_FAILURE);

export const deleteRoutine = createAction<{ routineId: string; callback?: SagaCallback<void> }>(DELETE_ROUTINE);
export const deleteRoutineSuccess = createAction<string>(DELETE_ROUTINE_SUCCESS);
export const deleteRoutineFailure = createAction<string>(DELETE_ROUTINE_FAILURE);

export const fetchStudentRoutines = createAction<{ studentId: string; callback?: SagaCallback<Routine[]> }>(
  FETCH_STUDENT_ROUTINES
);
export const fetchStudentRoutinesSuccess = createAction<Routine[]>(FETCH_STUDENT_ROUTINES_SUCCESS);
export const fetchStudentRoutinesFailure = createAction<string>(FETCH_STUDENT_ROUTINES_FAILURE);

export const setSelectedRoutine = createAction<Routine | null>(SET_SELECTED_ROUTINE);
