'use client';

import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/utils/types/auth.types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

export default function LoginScreen() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      if (user.role === UserRole.TRAINER) {
        router.push('/trainer/dashboard');
      } else if (user.role === UserRole.STUDENT) {
        router.push('/student/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    login(
      { email, password },
      () => {
        // Success - useEffect will handle redirect
      },
      (errorMsg) => {
        setError(errorMsg);
      }
    );
  };

  const fillTrainerCredentials = () => {
    setEmail('trainer@test.com');
    setPassword('password');
  };

  const fillStudentCredentials = () => {
    setEmail('student@test.com');
    setPassword('password');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>{t('login.title')}</h1>
          <p className={styles.subtitle}>{t('login.subtitle')}</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>{t('login.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@example.com"
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? t('login.loggingIn') : t('login.submit')}
            </button>
          </form>

          <div className={styles.divider}>
            <span>{t('login.quickAccess')}</span>
          </div>

          <div className={styles.quickButtons}>
            <button onClick={fillTrainerCredentials} className={styles.quickButton} disabled={isLoading}>
              {t('login.loginAsTrainer')}
            </button>
            <button onClick={fillStudentCredentials} className={styles.quickButton} disabled={isLoading}>
              {t('login.loginAsStudent')}
            </button>
          </div>

          <div className={styles.demo}>
            <p>{t('login.demoNote')}</p>
            <ul>
              <li><strong>Trainer:</strong> trainer@test.com</li>
              <li><strong>Student:</strong> student@test.com</li>
              <li>{t('login.anyPassword')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
