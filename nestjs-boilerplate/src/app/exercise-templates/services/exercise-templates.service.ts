import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@src/shared/database/prisma.service';
import { CreateExerciseTemplateDto } from '../dto/create-exercise-template.dto';
import { UpdateExerciseTemplateDto } from '../dto/update-exercise-template.dto';

@Injectable()
export class ExerciseTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    trainerId: string,
    createDto: CreateExerciseTemplateDto,
  ) {
    return this.prisma.exerciseTemplate.create({
      data: {
        ...createDto,
        trainerId,
      },
    });
  }

  async findAll(trainerId: string, filters?: {
    category?: string;
    muscleGroup?: string;
    difficulty?: string;
    search?: string;
  }) {
    return this.prisma.exerciseTemplate.findMany({
      where: {
        trainerId,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.muscleGroup && { muscleGroup: filters.muscleGroup }),
        ...(filters?.difficulty && { difficulty: filters.difficulty as any }),
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, trainerId: string) {
    const exerciseTemplate = await this.prisma.exerciseTemplate.findUnique({
      where: { id },
    });

    if (!exerciseTemplate) {
      throw new NotFoundException('Exercise template not found');
    }

    if (exerciseTemplate.trainerId !== trainerId) {
      throw new ForbiddenException(
        'You do not have permission to access this exercise template',
      );
    }

    return exerciseTemplate;
  }

  async update(
    id: string,
    trainerId: string,
    updateDto: UpdateExerciseTemplateDto,
  ) {
    // Verify ownership
    await this.findOne(id, trainerId);

    return this.prisma.exerciseTemplate.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string, trainerId: string) {
    // Verify ownership
    await this.findOne(id, trainerId);

    return this.prisma.exerciseTemplate.delete({
      where: { id },
    });
  }

  async getCategories(trainerId: string): Promise<string[]> {
    const templates = await this.prisma.exerciseTemplate.findMany({
      where: { trainerId },
      select: { category: true },
      distinct: ['category'],
    });

    return templates
      .map((t) => t.category)
      .filter((c): c is string => c !== null);
  }

  async getMuscleGroups(trainerId: string): Promise<string[]> {
    const templates = await this.prisma.exerciseTemplate.findMany({
      where: { trainerId },
      select: { muscleGroup: true },
      distinct: ['muscleGroup'],
    });

    return templates
      .map((t) => t.muscleGroup)
      .filter((m): m is string => m !== null);
  }
}
