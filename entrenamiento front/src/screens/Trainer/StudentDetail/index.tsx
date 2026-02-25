'use client';

import { RootState } from '@/store';
import { fetchStudentRoutines } from '@/store/trainer/action';
import { DayOfWeek, Routine } from '@/utils/types/training.types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

interface StudentDetailProps {
  studentId: string;
}

export default function StudentDetail({ studentId }: StudentDetailProps) {
  const t = useTranslations('trainer');
  const router = useRouter();
  const dispatch = useDispatch();
  const { students, routines, isLoading } = useSelector((state: RootState) => state.trainer);
  const [isMounted, setIsMounted] = useState(false);

  const student = students.find((s) => s.id === studentId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (studentId && isMounted) {
      dispatch(fetchStudentRoutines({ studentId }));
    }
  }, [studentId, dispatch, isMounted]);

  const getRoutineForDay = (day: DayOfWeek): Routine | undefined => {
    return routines.find((r) => r.dayOfWeek === day && r.studentId === studentId);
  };

  const daysOfWeek = Object.values(DayOfWeek);

  const handleCreateRoutine = (day: DayOfWeek) => {
    router.push(`/trainer/students/${studentId}/create-routine?day=${day}`);
  };

  const handleEditRoutine = (routineId: string) => {
    router.push(`/trainer/routines/${routineId}/edit`);
  };

  if (!isMounted) {
    return (
      <div className={styles.studentDetailPage}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={styles.notFound}>
        <h2>{t('students.notFound')}</h2>
        <button onClick={() => router.back()} className={styles.backButton}>
          {t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.studentDetailPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => router.back()} className={styles.backButton}>
            ← {t('common.back')}
          </button>
          <h1>{student.name}</h1>
        </div>
      </header>

      <main className={styles.main}>
        {/* Student Info Card */}
        <div className={styles.studentCard}>
          <div className={styles.avatar}>{student.name.charAt(0).toUpperCase()}</div>
          <div className={styles.studentInfo}>
            <h2>{student.name}</h2>
            <p className={styles.email}>{student.email}</p>
            {student.goal && (
              <div className={styles.infoRow}>
                <strong>{t('students.goal')}:</strong> {student.goal}
              </div>
            )}
            <div className={styles.stats}>
              {student.age && (
                <div className={styles.stat}>
                  <span className={styles.label}>{t('students.age')}</span>
                  <span className={styles.value}>
                    {student.age} {t('students.years')}
                  </span>
                </div>
              )}
              {student.weight && (
                <div className={styles.stat}>
                  <span className={styles.label}>{t('studentDetail.weight')}</span>
                  <span className={styles.value}>{student.weight} kg</span>
                </div>
              )}
              {student.height && (
                <div className={styles.stat}>
                  <span className={styles.label}>{t('studentDetail.height')}</span>
                  <span className={styles.value}>{student.height} cm</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Routines */}
        <div className={styles.routinesSection}>
          <h2>{t('studentDetail.weeklyRoutines')}</h2>

          {isLoading ? (
            <p>{t('common.loading')}</p>
          ) : (
            <div className={styles.weekGrid}>
              {daysOfWeek.map((day) => {
                const routine = getRoutineForDay(day);

                return (
                  <div key={day} className={styles.dayCard}>
                    <div className={styles.dayHeader}>
                      <h3>{t(`days.${day}`)}</h3>
                    </div>

                    {routine ? (
                      <div className={styles.routineContent}>
                        <h4>{routine.name}</h4>
                        {routine.description && <p className={styles.description}>{routine.description}</p>}
                        <div className={styles.exerciseCount}>
                          {routine.exercises.length} {t('routine.exercises').toLowerCase()}
                        </div>
                        <div className={styles.routineActions}>
                          <button onClick={() => handleEditRoutine(routine.id)} className={styles.editButton}>
                            {t('common.edit')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.emptyRoutine}>
                        <p>{t('studentDetail.noRoutine')}</p>
                        <button onClick={() => handleCreateRoutine(day)} className={styles.createButton}>
                          + {t('studentDetail.createRoutine')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
