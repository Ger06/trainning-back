import { Module } from '@nestjs/common';

import { CoreModule } from '@src/core/core.module';
import { SharedModule } from '@src/shared/shared.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ExerciseTemplatesModule } from './exercise-templates/exercise-templates.module';
import { RoutineTemplatesModule } from './routine-templates/routine-templates.module';
import { StudentsModule } from './students/students.module';
import { RoutinesModule } from './routines/routines.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    CommonModule,
    AuthModule,
    ExerciseTemplatesModule,
    RoutineTemplatesModule,
    StudentsModule,
    RoutinesModule,
  ],
})
export class AppModule {}
