import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { Difficulty } from '@generated/prisma';

export class CreateExerciseTemplateDto {
  @ApiProperty({ example: 'Bench Press' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Barbell bench press exercise for chest' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Strength' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'Chest' })
  @IsString()
  @IsOptional()
  muscleGroup?: string;

  @ApiPropertyOptional({ example: 'Barbell' })
  @IsString()
  @IsOptional()
  equipment?: string;

  @ApiPropertyOptional({ enum: Difficulty, example: Difficulty.INTERMEDIATE })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;
}
