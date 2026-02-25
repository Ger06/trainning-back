'use client';

import { Exercise } from '@/utils/types/training.types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from './styles.module.scss';

interface ExerciseFormProps {
  initialData?: Omit<Exercise, 'id'>;
  onSubmit: (exercise: Omit<Exercise, 'id'>) => void;
  onCancel: () => void;
}

export default function ExerciseForm({ initialData, onSubmit, onCancel }: ExerciseFormProps) {
  const t = useTranslations('trainer');
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [sets, setSets] = useState(initialData?.sets?.toString() || '');
  const [repetitions, setRepetitions] = useState(initialData?.repetitions?.toString() || '');
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '');
  const [duration, setDuration] = useState(initialData?.duration?.toString() || '');
  const [restTime, setRestTime] = useState(initialData?.restTime?.toString() || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exercise: Omit<Exercise, 'id'> = {
      name,
      description,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrl || undefined,
      sets: sets ? parseInt(sets) : undefined,
      repetitions: repetitions ? parseInt(repetitions) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      restTime: restTime ? parseInt(restTime) : undefined,
      notes: notes || undefined,
    };

    onSubmit(exercise);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.exerciseForm}>
      <h3>{initialData ? t('exercise.editTitle') : t('exercise.addTitle')}</h3>

      <div className={styles.formGroup}>
        <label>
          {t('exercise.name')} <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={t('exercise.namePlaceholder')}
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          {t('exercise.description')} <span className={styles.required}>*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder={t('exercise.descriptionPlaceholder')}
          rows={3}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>{t('exercise.videoUrl')}</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('exercise.imageUrl')}</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className={styles.separator}>
        <span>{t('exercise.configuration')}</span>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>{t('exercise.sets')}</label>
          <input type="number" min="0" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="3" />
        </div>

        <div className={styles.formGroup}>
          <label>{t('exercise.repetitions')}</label>
          <input
            type="number"
            min="0"
            value={repetitions}
            onChange={(e) => setRepetitions(e.target.value)}
            placeholder="12"
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('exercise.weight')} (kg)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="20"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>{t('exercise.duration')} (s)</label>
          <input
            type="number"
            min="0"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('exercise.restTime')} (s)</label>
          <input
            type="number"
            min="0"
            value={restTime}
            onChange={(e) => setRestTime(e.target.value)}
            placeholder="90"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>{t('exercise.notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('exercise.notesPlaceholder')}
          rows={2}
        />
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          {t('common.cancel')}
        </button>
        <button type="submit" className={styles.submitButton}>
          {initialData ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );
}
