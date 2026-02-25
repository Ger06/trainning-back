'use client';

import EditRoutine from '@/screens/Trainer/EditRoutine';

export default function EditRoutinePage({ params }: { params: { id: string } }) {
  return <EditRoutine routineId={params.id} />;
}
