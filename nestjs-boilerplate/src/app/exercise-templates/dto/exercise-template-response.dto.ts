import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@generated/prisma';

export class ExerciseTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  videoUrl?: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  muscleGroup?: string;

  @ApiPropertyOptional()
  equipment?: string;

  @ApiPropertyOptional({ enum: Difficulty })
  difficulty?: Difficulty;

  @ApiProperty()
  trainerId: string;

  @ApiProperty()
  createdAt: Date;
}
