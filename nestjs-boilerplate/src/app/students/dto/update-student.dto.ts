import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'Jane Doe Updated' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 26 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 68.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 175.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  height?: number;

  @ApiPropertyOptional({ example: 'New fitness goal' })
  @IsString()
  @IsOptional()
  goal?: string;
}
