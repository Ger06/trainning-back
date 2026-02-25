import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import { JwtAuthGuard } from '@src/app/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@src/app/auth/guards/roles.guard';
import { Roles } from '@src/app/auth/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '@src/app/auth/decorators/current-user.decorator';
import { UserRole } from '@generated/prisma';

@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TRAINER)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Student already exists' })
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateStudentDto,
  ) {
    return this.studentsService.create(user.trainerProfile.id, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students for current trainer' })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of students',
    type: [StudentResponseDto],
  })
  findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('search') search?: string,
  ) {
    return this.studentsService.findAll(user.trainerProfile.id, { search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiResponse({
    status: 200,
    description: 'Student details',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.studentsService.findOne(id, user.trainerProfile.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, user.trainerProfile.id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.studentsService.remove(id, user.trainerProfile.id);
  }
}
