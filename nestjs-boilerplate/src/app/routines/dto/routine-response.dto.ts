import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek } from '@generated/prisma';

export class ExerciseInRoutineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  exerciseId: string;

  @ApiProperty()
  order: number;

  @ApiPropertyOptional()
  sets?: number;

  @ApiPropertyOptional()
  repetitions?: number;

  @ApiPropertyOptional()
  weight?: number;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  restTime?: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  exercise: {
    id: string;
    name: string;
    description: string;
    videoUrl?: string;
    imageUrl?: string;
  };
}

export class RoutineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  @ApiProperty()
  trainerId: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [ExerciseInRoutineResponseDto] })
  exercises: ExerciseInRoutineResponseDto[];
}
