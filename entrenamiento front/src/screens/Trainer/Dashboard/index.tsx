'use client';

import { useAuth } from '@/hooks/useAuth';
import { RootState } from '@/store';
import { fetchStudents } from '@/store/trainer/action';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

export default function TrainerDashboard() {
  const t = useTranslations('trainer');
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { students, isLoading } = useSelector((state: RootState) => state.trainer);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      dispatch(fetchStudents({}));
    }
  }, [dispatch, isMounted]);

  const handleLogout = () => {
    logout(() => {
      router.push('/');
    });
  };

  if (!isMounted) {
    return (
      <div className={styles.dashboard}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{t('dashboard.title')}</h1>
          <div className={styles.userInfo}>
            <span>
              {t('dashboard.welcome')}, {user?.name}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>{t('dashboard.totalStudents')}</h3>
            <p className={styles.statNumber}>{students.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>{t('dashboard.activeRoutines')}</h3>
            <p className={styles.statNumber}>
              {students.reduce((acc, student) => acc + student.assignedRoutines.length, 0)}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => router.push('/trainer/students')} className={styles.actionButton}>
            {t('dashboard.manageStudents')}
          </button>
          <button onClick={() => router.push('/trainer/library/exercises')} className={styles.actionButton}>
            {t('library.exercisesTitle')}
          </button>
          <button onClick={() => router.push('/trainer/library/routines')} className={styles.actionButton}>
            {t('dashboard.manageRoutines')}
          </button>
        </div>

        <div className={styles.recentSection}>
          <h2>{t('dashboard.recentStudents')}</h2>
          {isLoading ? (
            <p>{t('common.loading')}</p>
          ) : students.length === 0 ? (
            <p>{t('dashboard.noStudents')}</p>
          ) : (
            <div className={styles.studentList}>
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className={styles.studentCard}>
                  <div className={styles.studentInfo}>
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                    {student.goal && <p className={styles.goal}>{student.goal}</p>}
                  </div>
                  <button
                    onClick={() => router.push(`/trainer/students/${student.id}`)}
                    className={styles.viewButton}
                  >
                    {t('dashboard.viewDetails')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
