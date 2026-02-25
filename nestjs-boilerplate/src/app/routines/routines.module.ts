import { Module } from '@nestjs/common';
import { RoutinesController } from './controllers/routines.controller';
import { RoutinesService } from './services/routines.service';

@Module({
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService],
})
export class RoutinesModule {}
