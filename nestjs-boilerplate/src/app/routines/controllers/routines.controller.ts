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
import { RoutinesService } from '../services/routines.service';
import { CreateRoutineDto } from '../dto/create-routine.dto';
import { UpdateRoutineDto } from '../dto/update-routine.dto';
import { AssignTemplateDto } from '../dto/assign-template.dto';
import { RoutineResponseDto } from '../dto/routine-response.dto';
import { JwtAuthGuard } from '@src/app/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@src/app/auth/guards/roles.guard';
import { Roles } from '@src/app/auth/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '@src/app/auth/decorators/current-user.decorator';
import { DayOfWeek, UserRole } from '@generated/prisma';

@ApiTags('Routines')
@ApiBearerAuth()
@Controller('routines')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TRAINER)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new routine from scratch' })
  @ApiResponse({
    status: 201,
    description: 'Routine created successfully',
    type: RoutineResponseDto,
  })
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateRoutineDto,
  ) {
    return this.routinesService.create(user.trainerProfile.id, createDto);
  }

  @Post('assign-template')
  @ApiOperation({ summary: 'Create routine from template and assign to student' })
  @ApiResponse({
    status: 201,
    description: 'Routine assigned successfully',
    type: RoutineResponseDto,
  })
  assignTemplate(
    @CurrentUser() user: CurrentUserData,
    @Body() assignDto: AssignTemplateDto,
  ) {
    return this.routinesService.assignTemplate(
      user.trainerProfile.id,
      assignDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all routines for current trainer' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'dayOfWeek', required: false, enum: DayOfWeek })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of routines',
    type: [RoutineResponseDto],
  })
  findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('studentId') studentId?: string,
    @Query('dayOfWeek') dayOfWeek?: DayOfWeek,
    @Query('search') search?: string,
  ) {
    return this.routinesService.findAll(user.trainerProfile.id, {
      studentId,
      dayOfWeek,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a routine by ID' })
  @ApiResponse({
    status: 200,
    description: 'Routine details',
    type: RoutineResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.routinesService.findOne(id, user.trainerProfile.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a routine' })
  @ApiResponse({
    status: 200,
    description: 'Routine updated successfully',
    type: RoutineResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: UpdateRoutineDto,
  ) {
    return this.routinesService.update(id, user.trainerProfile.id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a routine' })
  @ApiResponse({
    status: 200,
    description: 'Routine deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Routine not found' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.routinesService.remove(id, user.trainerProfile.id);
  }
}
