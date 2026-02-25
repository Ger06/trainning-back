export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  sets?: number;
  repetitions?: number;
  weight?: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  dayOfWeek: DayOfWeek;
  trainerId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  assignedRoutines: Routine[];
  trainerId: string;
}

export interface CreateRoutinePayload {
  name: string;
  description?: string;
  exercises: Omit<Exercise, 'id'>[];
  dayOfWeek: DayOfWeek;
  studentId: string;
}

export interface UpdateRoutinePayload extends Partial<CreateRoutinePayload> {
  id: string;
}
