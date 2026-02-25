import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@src/shared/database/prisma.service';
import { CreateRoutineTemplateDto } from '../dto/create-routine-template.dto';
import { UpdateRoutineTemplateDto } from '../dto/update-routine-template.dto';

@Injectable()
export class RoutineTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(trainerId: string, createDto: CreateRoutineTemplateDto) {
    // Verify all exercise templates belong to this trainer
    const exerciseTemplateIds = createDto.exercises.map(
      (e) => e.exerciseTemplateId,
    );

    const exerciseTemplates = await this.prisma.exerciseTemplate.findMany({
      where: {
        id: { in: exerciseTemplateIds },
        trainerId,
      },
    });

    if (exerciseTemplates.length !== exerciseTemplateIds.length) {
      throw new BadRequestException(
        'Some exercise templates do not exist or do not belong to you',
      );
    }

    // Create routine template with exercises
    return this.prisma.routineTemplate.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        category: createDto.category,
        trainerId,
        exercises: {
          create: createDto.exercises.map((exercise) => ({
            exerciseTemplateId: exercise.exerciseTemplateId,
            order: exercise.order,
            sets: exercise.sets,
            repetitions: exercise.repetitions,
            weight: exercise.weight,
            duration: exercise.duration,
            restTime: exercise.restTime,
            notes: exercise.notes,
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exerciseTemplate: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async findAll(
    trainerId: string,
    filters?: {
      category?: string;
      search?: string;
    },
  ) {
    return this.prisma.routineTemplate.findMany({
      where: {
        trainerId,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            {
              description: { contains: filters.search, mode: 'insensitive' },
            },
          ],
        }),
      },
      include: {
        exercises: {
          include: {
            exerciseTemplate: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, trainerId: string) {
    const routineTemplate = await this.prisma.routineTemplate.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exerciseTemplate: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!routineTemplate) {
      throw new NotFoundException('Routine template not found');
    }

    if (routineTemplate.trainerId !== trainerId) {
      throw new ForbiddenException(
        'You do not have permission to access this routine template',
      );
    }

    return routineTemplate;
  }

  async update(
    id: string,
    trainerId: string,
    updateDto: UpdateRoutineTemplateDto,
  ) {
    // Verify ownership
    await this.findOne(id, trainerId);

    // If exercises are being updated, verify ownership
    if (updateDto.exercises) {
      const exerciseTemplateIds = updateDto.exercises.map(
        (e) => e.exerciseTemplateId,
      );

      const exerciseTemplates = await this.prisma.exerciseTemplate.findMany({
        where: {
          id: { in: exerciseTemplateIds },
          trainerId,
        },
      });

      if (exerciseTemplates.length !== exerciseTemplateIds.length) {
        throw new BadRequestException(
          'Some exercise templates do not exist or do not belong to you',
        );
      }

      // Delete existing exercises and create new ones
      await this.prisma.routineTemplateExercise.deleteMany({
        where: { routineTemplateId: id },
      });

      return this.prisma.routineTemplate.update({
        where: { id },
        data: {
          name: updateDto.name,
          description: updateDto.description,
          category: updateDto.category,
          exercises: {
            create: updateDto.exercises.map((exercise) => ({
              exerciseTemplateId: exercise.exerciseTemplateId,
              order: exercise.order,
              sets: exercise.sets,
              repetitions: exercise.repetitions,
              weight: exercise.weight,
              duration: exercise.duration,
              restTime: exercise.restTime,
              notes: exercise.notes,
            })),
          },
        },
        include: {
          exercises: {
            include: {
              exerciseTemplate: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    }

    // Update only basic fields
    return this.prisma.routineTemplate.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        category: updateDto.category,
      },
      include: {
        exercises: {
          include: {
            exerciseTemplate: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async remove(id: string, trainerId: string) {
    // Verify ownership
    await this.findOne(id, trainerId);

    return this.prisma.routineTemplate.delete({
      where: { id },
    });
  }

  async getCategories(trainerId: string): Promise<string[]> {
    const templates = await this.prisma.routineTemplate.findMany({
      where: { trainerId },
      select: { category: true },
      distinct: ['category'],
    });

    return templates
      .map((t) => t.category)
      .filter((c): c is string => c !== null);
  }
}
