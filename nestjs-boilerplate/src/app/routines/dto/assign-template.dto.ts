import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsEnum } from 'class-validator';
import { DayOfWeek } from '@generated/prisma';

export class AssignTemplateDto {
  @ApiProperty({ example: 'uuid-of-routine-template' })
  @IsUUID()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ example: 'uuid-of-student' })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ enum: DayOfWeek, example: DayOfWeek.MONDAY })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;
}
