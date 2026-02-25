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
import { RoutineTemplatesService } from '../services/routine-templates.service';
import { CreateRoutineTemplateDto } from '../dto/create-routine-template.dto';
import { UpdateRoutineTemplateDto } from '../dto/update-routine-template.dto';
import { RoutineTemplateResponseDto } from '../dto/routine-template-response.dto';
import { JwtAuthGuard } from '@src/app/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@src/app/auth/guards/roles.guard';
import { Roles } from '@src/app/auth/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '@src/app/auth/decorators/current-user.decorator';
import { UserRole } from '@generated/prisma';

@ApiTags('Routine Templates')
@ApiBearerAuth()
@Controller('routine-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TRAINER)
export class RoutineTemplatesController {
  constructor(
    private readonly routineTemplatesService: RoutineTemplatesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new routine template' })
  @ApiResponse({
    status: 201,
    description: 'Routine template created successfully',
    type: RoutineTemplateResponseDto,
  })
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateRoutineTemplateDto,
  ) {
    return this.routineTemplatesService.create(
      user.trainerProfile.id,
      createDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all routine templates for current trainer' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of routine templates',
    type: [RoutineTemplateResponseDto],
  })
  findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.routineTemplatesService.findAll(user.trainerProfile.id, {
      category,
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
    return this.routineTemplatesService.getCategories(user.trainerProfile.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a routine template by ID' })
  @ApiResponse({
    status: 200,
    description: 'Routine template details',
    type: RoutineTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Routine template not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.routineTemplatesService.findOne(id, user.trainerProfile.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a routine template' })
  @ApiResponse({
    status: 200,
    description: 'Routine template updated successfully',
    type: RoutineTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Routine template not found' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: UpdateRoutineTemplateDto,
  ) {
    return this.routineTemplatesService.update(
      id,
      user.trainerProfile.id,
      updateDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a routine template' })
  @ApiResponse({
    status: 200,
    description: 'Routine template deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Routine template not found' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.routineTemplatesService.remove(id, user.trainerProfile.id);
  }
}
