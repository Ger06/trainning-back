import { Module } from '@nestjs/common';
import { RoutineTemplatesController } from './controllers/routine-templates.controller';
import { RoutineTemplatesService } from './services/routine-templates.service';

@Module({
  controllers: [RoutineTemplatesController],
  providers: [RoutineTemplatesService],
  exports: [RoutineTemplatesService],
})
export class RoutineTemplatesModule {}
