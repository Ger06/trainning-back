'use client';

import { RootState } from '@/store';
import { fetchStudents, searchStudents, setSelectedStudent } from '@/store/trainer/action';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

export default function TrainerStudents() {
  const t = useTranslations('trainer');
  const router = useRouter();
  const dispatch = useDispatch();
  const { filteredStudents, isLoading } = useSelector((state: RootState) => state.trainer);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      dispatch(fetchStudents({}));
    }
  }, [dispatch, isMounted]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(searchStudents({ query }));
  };

  const handleStudentClick = (student: any) => {
    dispatch(setSelectedStudent(student));
    router.push(`/trainer/students/${student.id}`);
  };

  if (!isMounted) {
    return (
      <div className={styles.studentsPage}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.studentsPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => router.back()} className={styles.backButton}>
            ← {t('common.back')}
          </button>
          <h1>{t('students.title')}</h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder={t('students.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {isLoading ? (
          <p>{t('common.loading')}</p>
        ) : filteredStudents.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{searchQuery ? t('students.noResults') : t('students.noStudents')}</p>
          </div>
        ) : (
          <div className={styles.studentGrid}>
            {filteredStudents.map((student) => (
              <div key={student.id} className={styles.studentCard} onClick={() => handleStudentClick(student)}>
                <div className={styles.avatar}>{student.name.charAt(0).toUpperCase()}</div>
                <div className={styles.studentDetails}>
                  <h3>{student.name}</h3>
                  <p className={styles.email}>{student.email}</p>
                  {student.goal && <p className={styles.goal}>{t('students.goal')}: {student.goal}</p>}
                  {student.age && (
                    <p className={styles.info}>
                      {t('students.age')}: {student.age} {t('students.years')}
                    </p>
                  )}
                  {student.weight && student.height && (
                    <p className={styles.info}>
                      {student.weight}kg / {student.height}cm
                    </p>
                  )}
                  <div className={styles.routineCount}>
                    {student.assignedRoutines.length} {t('students.routines')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
