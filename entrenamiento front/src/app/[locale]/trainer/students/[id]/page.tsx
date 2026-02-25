import StudentDetail from '@/screens/Trainer/StudentDetail';

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  return <StudentDetail studentId={params.id} />;
}
