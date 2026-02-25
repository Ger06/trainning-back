import { DayOfWeek, Exercise } from './training.types';

// Template Routine - rutina no asignada a ningún alumno
export interface RoutineTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  category?: string;
  trainerId: string;
  createdAt: string;
  updatedAt: string;
}

// Template Exercise - ejercicio de biblioteca
export interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  trainerId: string;
  createdAt: string;
}

export interface CreateRoutineTemplatePayload {
  name: string;
  description?: string;
  exercises: Omit<Exercise, 'id'>[];
  category?: string;
}

export interface CreateExerciseTemplatePayload {
  name: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssignRoutineTemplatePayload {
  templateId: string;
  studentId: string;
  dayOfWeek: DayOfWeek;
}
