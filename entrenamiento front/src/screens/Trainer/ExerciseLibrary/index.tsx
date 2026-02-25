'use client';

import { RootState } from '@/store';
import { fetchExercises, searchExercises, setSelectedExercise } from '@/store/exerciseLibrary/action';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

export default function ExerciseLibrary() {
  const t = useTranslations('trainer');
  const router = useRouter();
  const dispatch = useDispatch();
  const { filteredExercises, isLoading } = useSelector((state: RootState) => state.exerciseLibrary);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      dispatch(fetchExercises({}));
    }
  }, [dispatch, isMounted]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(searchExercises({ query }));
  };

  const handleCreateNew = () => {
    router.push('/trainer/library/exercises/create');
  };

  const handleViewExercise = (exerciseId: string) => {
    const exercise = filteredExercises.find((e) => e.id === exerciseId);
    if (exercise) {
      dispatch(setSelectedExercise(exercise));
      router.push(`/trainer/library/exercises/${exerciseId}`);
    }
  };

  if (!isMounted) {
    return (
      <div className={styles.libraryPage}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.libraryPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => router.back()} className={styles.backButton}>
            ← {t('common.back')}
          </button>
          <h1>{t('library.exercisesTitle')}</h1>
          <button onClick={handleCreateNew} className={styles.createButton}>
            + {t('library.createExercise')}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder={t('library.exercisesSearchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.info}>
          <p>{t('library.exercisesDescription')}</p>
        </div>

        {isLoading ? (
          <p>{t('common.loading')}</p>
        ) : filteredExercises.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{searchQuery ? t('library.noExercisesResults') : t('library.noExercises')}</p>
            <button onClick={handleCreateNew} className={styles.createButton}>
              + {t('library.createFirstExercise')}
            </button>
          </div>
        ) : (
          <div className={styles.exerciseGrid}>
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className={styles.exerciseCard} onClick={() => handleViewExercise(exercise.id)}>
                <div className={styles.exerciseHeader}>
                  <h3>{exercise.name}</h3>
                  <div className={styles.tags}>
                    {exercise.difficulty && (
                      <span className={`${styles.tag} ${styles[exercise.difficulty]}`}>{exercise.difficulty}</span>
                    )}
                  </div>
                </div>

                <p className={styles.description}>{exercise.description}</p>

                <div className={styles.exerciseDetails}>
                  {exercise.muscleGroup && (
                    <div className={styles.detail}>
                      <span className={styles.label}>{t('library.muscleGroup')}:</span>
                      <span className={styles.value}>{exercise.muscleGroup}</span>
                    </div>
                  )}
                  {exercise.category && (
                    <div className={styles.detail}>
                      <span className={styles.label}>{t('library.category')}:</span>
                      <span className={styles.value}>{exercise.category}</span>
                    </div>
                  )}
                  {exercise.equipment && (
                    <div className={styles.detail}>
                      <span className={styles.label}>{t('library.equipment')}:</span>
                      <span className={styles.value}>{exercise.equipment}</span>
                    </div>
                  )}
                </div>

                <div className={styles.exerciseFooter}>
                  {exercise.videoUrl && <span className={styles.hasVideo}>📹 Video</span>}
                  {exercise.imageUrl && <span className={styles.hasImage}>🖼️ Image</span>}
                  <button className={styles.viewButton}>{t('library.viewDetails')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
