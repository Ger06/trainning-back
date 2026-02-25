import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  trainerId: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };

  @ApiPropertyOptional()
  age?: number;

  @ApiPropertyOptional()
  weight?: number;

  @ApiPropertyOptional()
  height?: number;

  @ApiPropertyOptional()
  goal?: string;
}
