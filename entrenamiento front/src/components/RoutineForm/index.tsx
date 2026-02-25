'use client';

import { DayOfWeek, Exercise } from '@/utils/types/training.types';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ExerciseSelector from '../ExerciseSelector';
import styles from './styles.module.scss';

interface RoutineFormProps {
  initialData?: {
    name?: string;
    description?: string;
    dayOfWeek?: DayOfWeek;
    exercises?: Exercise[];
  };
  onSubmit: (data: {
    name: string;
    description?: string;
    dayOfWeek: DayOfWeek;
    exercises: Omit<Exercise, 'id'>[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RoutineForm({ initialData, onSubmit, onCancel, isLoading }: RoutineFormProps) {
  const t = useTranslations('trainer');
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialData?.dayOfWeek || DayOfWeek.MONDAY);
  const [exercises, setExercises] = useState<Omit<Exercise, 'id'>[]>(
    initialData?.exercises?.map(({ id, ...rest }) => rest) || []
  );
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setPortalRoot(document.body);
  }, []);

  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    if (editingExerciseIndex !== null) {
      const updated = [...exercises];
      updated[editingExerciseIndex] = exercise;
      setExercises(updated);
      setEditingExerciseIndex(null);
    } else {
      setExercises([...exercises, exercise]);
    }
    setShowExerciseForm(false);
  };

  const handleEditExercise = (index: number) => {
    setEditingExerciseIndex(index);
    setShowExerciseForm(true);
  };

  const handleDeleteExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, dayOfWeek, exercises });
  };

  const daysOfWeek = Object.values(DayOfWeek);

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.routineForm}>
        <div className={styles.formGroup}>
          <label>{t('routine.name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t('routine.namePlaceholder')}
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('routine.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('routine.descriptionPlaceholder')}
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('routine.dayOfWeek')}</label>
          <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)} required>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {t(`days.${day}`)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.exercisesSection}>
          <div className={styles.exercisesHeader}>
            <h3>{t('routine.exercises')}</h3>
            <button type="button" onClick={() => setShowExerciseForm(true)} className={styles.addButton}>
              + {t('routine.addExercise')}
            </button>
          </div>

          {exercises.length === 0 ? (
            <p className={styles.emptyState}>{t('routine.noExercises')}</p>
          ) : (
            <div className={styles.exercisesList}>
              {exercises.map((exercise, index) => (
                <div key={index} className={styles.exerciseCard}>
                  <div className={styles.exerciseInfo}>
                    <h4>{exercise.name}</h4>
                    <p>{exercise.description}</p>
                    <div className={styles.exerciseDetails}>
                      {exercise.sets && (
                        <span>
                          {t('exercise.sets')}: {exercise.sets}
                        </span>
                      )}
                      {exercise.repetitions && (
                        <span>
                          {t('exercise.reps')}: {exercise.repetitions}
                        </span>
                      )}
                      {exercise.weight && (
                        <span>
                          {t('exercise.weight')}: {exercise.weight}kg
                        </span>
                      )}
                      {exercise.duration && (
                        <span>
                          {t('exercise.duration')}: {exercise.duration}s
                        </span>
                      )}
                      {exercise.restTime && (
                        <span>
                          {t('exercise.rest')}: {exercise.restTime}s
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.exerciseActions}>
                    <button type="button" onClick={() => handleEditExercise(index)} className={styles.editButton}>
                      {t('common.edit')}
                    </button>
                    <button type="button" onClick={() => handleDeleteExercise(index)} className={styles.deleteButton}>
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={isLoading}>
            {t('common.cancel')}
          </button>
          <button type="submit" className={styles.submitButton} disabled={isLoading || exercises.length === 0}>
            {isLoading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
      {isMounted &&
        showExerciseForm &&
        portalRoot &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
            onClick={() => {
              setShowExerciseForm(false);
              setEditingExerciseIndex(null);
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '700px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExerciseSelector
                initialData={editingExerciseIndex !== null ? exercises[editingExerciseIndex] : undefined}
                onSubmit={handleAddExercise}
                onCancel={() => {
                  setShowExerciseForm(false);
                  setEditingExerciseIndex(null);
                }}
              />
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
}
