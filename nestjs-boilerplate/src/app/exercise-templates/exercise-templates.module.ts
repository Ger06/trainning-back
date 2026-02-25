import { Module } from '@nestjs/common';
import { ExerciseTemplatesController } from './controllers/exercise-templates.controller';
import { ExerciseTemplatesService } from './services/exercise-templates.service';

@Module({
  controllers: [ExerciseTemplatesController],
  providers: [ExerciseTemplatesService],
  exports: [ExerciseTemplatesService],
})
export class ExerciseTemplatesModule {}
