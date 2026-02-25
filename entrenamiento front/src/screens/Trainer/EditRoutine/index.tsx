'use client';

import RoutineForm from '@/components/RoutineForm';
import { RootState } from '@/store';
import { deleteRoutine, updateRoutine } from '@/store/trainer/action';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

interface EditRoutineProps {
  routineId: string;
}

export default function EditRoutine({ routineId }: EditRoutineProps) {
  const t = useTranslations('trainer');
  const router = useRouter();
  const dispatch = useDispatch();
  const { routines, isLoading } = useSelector((state: RootState) => state.trainer);
  const [isMounted, setIsMounted] = useState(false);

  const routine = routines.find((r) => r.id === routineId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (data: any) => {
    dispatch(
      updateRoutine({
        payload: { ...data, id: routineId },
        callback: ({ ok, message }) => {
          if (ok) {
            if (routine) {
              router.push(`/trainer/students/${routine.studentId}`);
            }
          } else {
            alert(`Error: ${message || 'Failed to update routine'}`);
          }
        },
      })
    );
  };

  const handleDelete = () => {
    if (confirm(t('routine.confirmDelete'))) {
      dispatch(
        deleteRoutine({
          routineId,
          callback: ({ ok, message }) => {
            if (ok) {
              if (routine) {
                router.push(`/trainer/students/${routine.studentId}`);
              }
            } else {
              alert(`Error: ${message || 'Failed to delete routine'}`);
            }
          },
        })
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!isMounted) {
    return (
      <div className={styles.editRoutinePage}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className={styles.notFound}>
        <h2>{t('routine.notFound')}</h2>
        <button onClick={() => router.back()} className={styles.backButton}>
          {t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editRoutinePage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleCancel} className={styles.backButton}>
            ← {t('common.back')}
          </button>
          <h1>{t('routine.editTitle')}</h1>
          <button onClick={handleDelete} className={styles.deleteButton} disabled={isLoading}>
            {t('common.delete')}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <RoutineForm
          initialData={{
            name: routine.name,
            description: routine.description,
            dayOfWeek: routine.dayOfWeek,
            exercises: routine.exercises,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
