import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@generated/prisma';

export class ExerciseInTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  exerciseTemplateId: string;

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
  exerciseTemplate: {
    id: string;
    name: string;
    description: string;
    videoUrl?: string;
    imageUrl?: string;
    category?: string;
    muscleGroup?: string;
    equipment?: string;
    difficulty?: Difficulty;
  };
}

export class RoutineTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiProperty()
  trainerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [ExerciseInTemplateResponseDto] })
  exercises: ExerciseInTemplateResponseDto[];
}
