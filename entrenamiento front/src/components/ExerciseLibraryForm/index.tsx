'use client';

import { CreateExerciseTemplatePayload } from '@/utils/types/library.types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from './styles.module.scss';

interface ExerciseLibraryFormProps {
  initialData?: Partial<CreateExerciseTemplatePayload>;
  onSubmit: (data: CreateExerciseTemplatePayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ExerciseLibraryForm({ initialData, onSubmit, onCancel, isLoading }: ExerciseLibraryFormProps) {
  const t = useTranslations('trainer');
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [muscleGroup, setMuscleGroup] = useState(initialData?.muscleGroup || '');
  const [equipment, setEquipment] = useState(initialData?.equipment || '');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | ''>(
    initialData?.difficulty || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exerciseData: CreateExerciseTemplatePayload = {
      name,
      description,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrl || undefined,
      category: category || undefined,
      muscleGroup: muscleGroup || undefined,
      equipment: equipment || undefined,
      difficulty: difficulty || undefined,
    };

    onSubmit(exerciseData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.exerciseForm}>
      <h3>{initialData ? t('exercise.editTitle') : t('exercise.addTitle')}</h3>

      <div className={styles.formRow}>
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
          <label>{t('library.category')}</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Strength, Cardio, Flexibility"
          />
        </div>
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
          <label>{t('library.muscleGroup')}</label>
          <input
            type="text"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            placeholder="e.g., Chest, Back, Legs"
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('library.equipment')}</label>
          <input
            type="text"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            placeholder="e.g., Barbell, Dumbbell, None"
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('library.difficulty')}</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
            <option value="">Select difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className={styles.separator}>
        <span>Media (Optional)</span>
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

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={isLoading}>
          {t('common.cancel')}
        </button>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? t('common.saving') : initialData ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );
}
