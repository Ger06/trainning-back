'use client';

import RoutineForm from '@/components/RoutineForm';
import { RootState } from '@/store';
import { createRoutine } from '@/store/trainer/action';
import { DayOfWeek } from '@/utils/types/training.types';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

interface CreateRoutineProps {
  studentId: string;
}

function CreateRoutineContent({ studentId }: CreateRoutineProps) {
  const t = useTranslations('trainer');
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { isLoading, students } = useSelector((state: RootState) => state.trainer);
  const [isMounted, setIsMounted] = useState(false);
  const [initialData, setInitialData] = useState<{ dayOfWeek?: DayOfWeek } | undefined>(undefined);

  const student = students.find((s) => s.id === studentId);

  useEffect(() => {
    setIsMounted(true);
    const dayParam = searchParams.get('day') as DayOfWeek | null;
    if (dayParam) {
      setInitialData({ dayOfWeek: dayParam });
    }
  }, [searchParams]);

  const handleSubmit = (data: any) => {
    dispatch(
      createRoutine({
        payload: { ...data, studentId },
        callback: ({ ok, message }) => {
          if (ok) {
            router.push(`/trainer/students/${studentId}`);
          } else {
            alert(`Error: ${message || 'Failed to create routine'}`);
          }
        },
      })
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (!isMounted) {
    return (
      <div className={styles.createRoutinePage}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.createRoutinePage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleCancel} className={styles.backButton}>
            ← {t('common.back')}
          </button>
          <h1>
            {t('routine.createTitle')} - {student?.name}
          </h1>
        </div>
      </header>

      <main className={styles.main}>
        <RoutineForm initialData={initialData} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default function CreateRoutine({ studentId }: CreateRoutineProps) {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      }
    >
      <CreateRoutineContent studentId={studentId} />
    </Suspense>
  );
}
