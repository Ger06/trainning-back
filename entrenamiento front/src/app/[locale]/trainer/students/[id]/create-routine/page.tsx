'use client';

import CreateRoutine from '@/screens/Trainer/CreateRoutine';

export default function CreateRoutinePage({ params }: { params: { id: string } }) {
  return <CreateRoutine studentId={params.id} />;
}
