'use client';

import { RootState } from '@/store';
import { createExercise, fetchExercises, searchExercises } from '@/store/exerciseLibrary/action';
import { Exercise } from '@/utils/types/training.types';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExerciseForm from '../ExerciseForm';
import ExerciseLibraryForm from '../ExerciseLibraryForm';
import styles from './styles.module.scss';

interface ExerciseSelectorProps {
  onSubmit: (exercise: Omit<Exercise, 'id'>) => void;
  onCancel: () => void;
  initialData?: Omit<Exercise, 'id'>;
}

export default function ExerciseSelector({ onSubmit, onCancel, initialData }: ExerciseSelectorProps) {
  const t = useTranslations('trainer');
  const dispatch = useDispatch();
  const { filteredExercises } = useSelector((state: RootState) => state.exerciseLibrary);
  const [activeTab, setActiveTab] = useState<'library' | 'new'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(false);

  useEffect(() => {
    dispatch(fetchExercises({}));
  }, [dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(searchExercises({ query }));
  };

  const handleSelectFromLibrary = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowConfigForm(true);
  };

  const handleConfigureExercise = (config: Omit<Exercise, 'id'>) => {
    // Exercise from library already has name/description from template, just add config
    onSubmit(config);
  };

  const handleCreateNewExercise = (templateData: any) => {
    // Create exercise template first, then add to routine with config
    dispatch(
      createExercise({
        payload: templateData,
        callback: ({ ok, data }) => {
          if (ok && data) {
            // Now show config form for this new exercise
            setSelectedTemplateId(data.id);
            setShowConfigForm(true);
          }
        },
      })
    );
  };

  if (showConfigForm && selectedTemplateId) {
    const template = filteredExercises.find((e) => e.id === selectedTemplateId);
    if (template) {
      return (
        <div className={styles.configForm}>
          <button
            onClick={() => {
              setShowConfigForm(false);
              setSelectedTemplateId(null);
            }}
            className={styles.backButton}
          >
            ← {t('common.back')}
          </button>
          <h3>{t('library.configureExercise')}</h3>
          <div className={styles.templateInfo}>
            <h4>{template.name}</h4>
            <p>{template.description}</p>
            {template.muscleGroup && <span className={styles.badge}>{template.muscleGroup}</span>}
            {template.category && <span className={styles.badge}>{template.category}</span>}
          </div>
          <ExerciseForm
            initialData={{
              name: template.name,
              description: template.description,
              videoUrl: template.videoUrl,
              imageUrl: template.imageUrl,
            }}
            onSubmit={handleConfigureExercise}
            onCancel={onCancel}
          />
        </div>
      );
    }
  }

  return (
    <div className={styles.exerciseSelector}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'library' ? styles.active : ''}`}
          onClick={() => setActiveTab('library')}
        >
          {t('library.selectFromLibrary')}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'new' ? styles.active : ''}`}
          onClick={() => setActiveTab('new')}
        >
          {t('library.createNew')}
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'library' ? (
          <div className={styles.libraryTab}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder={t('library.exercisesSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.exerciseList}>
              {filteredExercises.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>{t('library.noExercises')}</p>
                  <button onClick={() => setActiveTab('new')} className={styles.createButton}>
                    {t('library.createFirstExercise')}
                  </button>
                </div>
              ) : (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={styles.exerciseItem}
                    onClick={() => handleSelectFromLibrary(exercise.id)}
                  >
                    <div className={styles.exerciseInfo}>
                      <h4>{exercise.name}</h4>
                      <p>{exercise.description}</p>
                      <div className={styles.tags}>
                        {exercise.muscleGroup && <span className={styles.tag}>{exercise.muscleGroup}</span>}
                        {exercise.category && <span className={styles.tag}>{exercise.category}</span>}
                        {exercise.difficulty && (
                          <span className={`${styles.tag} ${styles[exercise.difficulty]}`}>{exercise.difficulty}</span>
                        )}
                      </div>
                    </div>
                    <button className={styles.selectButton}>{t('library.selectExercise')}</button>
                  </div>
                ))
              )}
            </div>

            <div className={styles.actions}>
              <button onClick={onCancel} className={styles.cancelButton}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.newTab}>
            <ExerciseLibraryForm onSubmit={handleCreateNewExercise} onCancel={onCancel} />
          </div>
        )}
      </div>
    </div>
  );
}
