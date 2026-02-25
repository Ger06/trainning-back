import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@/utils/types/auth.types';

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={[UserRole.TRAINER]}>{children}</ProtectedRoute>;
}
