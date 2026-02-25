import { PartialType } from '@nestjs/swagger';
import { CreateExerciseTemplateDto } from './create-exercise-template.dto';

export class UpdateExerciseTemplateDto extends PartialType(
  CreateExerciseTemplateDto,
) {}
