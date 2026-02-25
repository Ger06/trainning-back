import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseInTemplateDto {
  @ApiProperty({ example: 'uuid-of-exercise-template' })
  @IsUUID()
  @IsNotEmpty()
  exerciseTemplateId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  order: number;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  sets?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  repetitions?: number;

  @ApiPropertyOptional({ example: 50.5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 300, description: 'Duration in seconds' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 60, description: 'Rest time in seconds' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  restTime?: number;

  @ApiPropertyOptional({ example: 'Focus on form' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateRoutineTemplateDto {
  @ApiProperty({ example: 'Push Day Workout' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Full upper body push workout' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Strength' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ type: [ExerciseInTemplateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseInTemplateDto)
  exercises: ExerciseInTemplateDto[];
}
