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
import { ExerciseTemplatesService } from '../services/exercise-templates.service';
import { CreateExerciseTemplateDto } from '../dto/create-exercise-template.dto';
import { UpdateExerciseTemplateDto } from '../dto/update-exercise-template.dto';
import { ExerciseTemplateResponseDto } from '../dto/exercise-template-response.dto';
import { JwtAuthGuard } from '@src/app/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@src/app/auth/guards/roles.guard';
import { Roles } from '@src/app/auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserData } from '@src/app/auth/decorators/current-user.decorator';
import { UserRole } from '@generated/prisma';

@ApiTags('Exercise Templates')
@ApiBearerAuth()
@Controller('exercise-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TRAINER)
export class ExerciseTemplatesController {
  constructor(
    private readonly exerciseTemplatesService: ExerciseTemplatesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exercise template' })
  @ApiResponse({
    status: 201,
    description: 'Exercise template created successfully',
    type: ExerciseTemplateResponseDto,
  })
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateExerciseTemplateDto,
  ) {
    return this.exerciseTemplatesService.create(
      user.trainerProfile.id,
      createDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all exercise templates for current trainer' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'muscleGroup', required: false })
  @ApiQuery({ name: 'difficulty', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of exercise templates',
    type: [ExerciseTemplateResponseDto],
  })
  findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('category') category?: string,
    @Query('muscleGroup') muscleGroup?: string,
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
  ) {
    return this.exerciseTemplatesService.findAll(user.trainerProfile.id, {
      category,
      muscleGroup,
      difficulty,
      search,
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all unique categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [String],
  })
  getCategories(@CurrentUser() user: CurrentUserData) {
    return this.exerciseTemplatesService.getCategories(user.trainerProfile.id);
  }

  @Get('muscle-groups')
  @ApiOperation({ summary: 'Get all unique muscle groups' })
  @ApiResponse({
    status: 200,
    description: 'List of muscle groups',
    type: [String],
  })
  getMuscleGroups(@CurrentUser() user: CurrentUserData) {
    return this.exerciseTemplatesService.getMuscleGroups(
      user.trainerProfile.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise template by ID' })
  @ApiResponse({
    status: 200,
    description: 'Exercise template details',
    type: ExerciseTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Exercise template not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.exerciseTemplatesService.findOne(id, user.trainerProfile.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise template' })
  @ApiResponse({
    status: 200,
    description: 'Exercise template updated successfully',
    type: ExerciseTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Exercise template not found' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: UpdateExerciseTemplateDto,
  ) {
    return this.exerciseTemplatesService.update(
      id,
      user.trainerProfile.id,
      updateDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exercise template' })
  @ApiResponse({
    status: 200,
    description: 'Exercise template deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Exercise template not found' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.exerciseTemplatesService.remove(id, user.trainerProfile.id);
  }
}
