import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'student@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 25 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 70.5, description: 'Weight in kg' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 175.5, description: 'Height in cm' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  height?: number;

  @ApiPropertyOptional({ example: 'Lose weight and gain muscle' })
  @IsString()
  @IsOptional()
  goal?: string;
}
