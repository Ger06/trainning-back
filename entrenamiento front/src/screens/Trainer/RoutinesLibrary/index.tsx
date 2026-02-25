'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './styles.module.scss';

// Mock data - reemplazar con store cuando tengamos backend
const mockRoutineTemplates = [
  {
    id: 'template-1',
    name: 'Full Body Beginner',
    description: 'Complete full body workout for beginners',
    exerciseCount: 8,
    category: 'Strength',
  },
  {
    id: 'template-2',
    name: 'Upper Body Strength',
    description: 'Focus on chest, back, shoulders and arms',
    exerciseCount: 6,
    category: 'Strength',
  },
  {
    id: 'template-3',
    name: 'HIIT Cardio',
    description: 'High intensity interval training',
    exerciseCount: 10,
    category: 'Cardio',
  },
];

export default function RoutinesLibrary() {
  const t = useTranslations('trainer');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [routines] = useState(mockRoutineTemplates);

  const filteredRoutines = routines.filter((routine) =>
    routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    routine.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    routine.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    router.push('/trainer/library/routines/create');
  };

  const handleViewRoutine = (id: string) => {
    router.push(`/trainer/library/routines/${id}`);
  };

  return (
    <div className={styles.libraryPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => router.back()} className={styles.backButton}>
            ← {t('common.back')}
          </button>
          <h1>{t('library.routinesTitle')}</h1>
          <button onClick={handleCreateNew} className={styles.createButton}>
            + {t('library.createTemplate')}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder={t('library.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.info}>
          <p>{t('library.description')}</p>
        </div>

        {filteredRoutines.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{searchQuery ? t('library.noResults') : t('library.noTemplates')}</p>
            <button onClick={handleCreateNew} className={styles.createButton}>
              + {t('library.createFirst')}
            </button>
          </div>
        ) : (
          <div className={styles.routineGrid}>
            {filteredRoutines.map((routine) => (
              <div key={routine.id} className={styles.routineCard} onClick={() => handleViewRoutine(routine.id)}>
                <div className={styles.routineHeader}>
                  <h3>{routine.name}</h3>
                  {routine.category && <span className={styles.category}>{routine.category}</span>}
                </div>
                {routine.description && <p className={styles.description}>{routine.description}</p>}
                <div className={styles.routineFooter}>
                  <span className={styles.exerciseCount}>
                    {routine.exerciseCount} {t('routine.exercises').toLowerCase()}
                  </span>
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
