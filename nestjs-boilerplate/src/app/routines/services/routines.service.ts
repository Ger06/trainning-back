import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@src/shared/database/prisma.service';
import { CreateRoutineDto } from '../dto/create-routine.dto';
import { UpdateRoutineDto } from '../dto/update-routine.dto';
import { AssignTemplateDto } from '../dto/assign-template.dto';
import { DayOfWeek } from '@generated/prisma';

@Injectable()
export class RoutinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(trainerId: string, createDto: CreateRoutineDto) {
    // Verify student belongs to trainer
    const student = await this.prisma.student.findUnique({
      where: { id: createDto.studentId },
    });

    if (!student || student.trainerId !== trainerId) {
      throw new BadRequestException(
        'Student not found or does not belong to you',
      );
    }

    // Create routine with exercises
    return this.prisma.routine.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        dayOfWeek: createDto.dayOfWeek,
        trainerId,
        studentId: createDto.studentId,
        exercises: {
          create: await Promise.all(
            createDto.exercises.map(async (exerciseDto) => {
              // Create the exercise first
              const exercise = await this.prisma.exercise.create({
                data: {
                  name: exerciseDto.name,
                  description: exerciseDto.description,
                  videoUrl: exerciseDto.videoUrl,
                  imageUrl: exerciseDto.imageUrl,
                },
              });

              return {
                exerciseId: exercise.id,
                order: exerciseDto.order,
                sets: exerciseDto.sets,
                repetitions: exerciseDto.repetitions,
                weight: exerciseDto.weight,
                duration: exerciseDto.duration,
                restTime: exerciseDto.restTime,
                notes: exerciseDto.notes,
              };
            }),
          ),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async assignTemplate(trainerId: string, assignDto: AssignTemplateDto) {
    // Verify template belongs to trainer
    const template = await this.prisma.routineTemplate.findUnique({
      where: { id: assignDto.templateId },
      include: {
        exercises: {
          include: {
            exerciseTemplate: true,
          },
        },
      },
    });

    if (!template || template.trainerId !== trainerId) {
      throw new BadRequestException(
        'Template not found or does not belong to you',
      );
    }

    // Verify student belongs to trainer
    const student = await this.prisma.student.findUnique({
      where: { id: assignDto.studentId },
    });

    if (!student || student.trainerId !== trainerId) {
      throw new BadRequestException(
        'Student not found or does not belong to you',
      );
    }

    // Create routine from template
    return this.prisma.routine.create({
      data: {
        name: template.name,
        description: template.description,
        dayOfWeek: assignDto.dayOfWeek,
        trainerId,
        studentId: assignDto.studentId,
        exercises: {
          create: await Promise.all(
            template.exercises.map(async (templateExercise) => {
              // Create exercise from template
              const exercise = await this.prisma.exercise.create({
                data: {
                  name: templateExercise.exerciseTemplate.name,
                  description: templateExercise.exerciseTemplate.description,
                  videoUrl: templateExercise.exerciseTemplate.videoUrl,
                  imageUrl: templateExercise.exerciseTemplate.imageUrl,
                },
              });

              return {
                exerciseId: exercise.id,
                order: templateExercise.order,
                sets: templateExercise.sets,
                repetitions: templateExercise.repetitions,
                weight: templateExercise.weight,
                duration: templateExercise.duration,
                restTime: templateExercise.restTime,
                notes: templateExercise.notes,
              };
            }),
          ),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
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
      studentId?: string;
      dayOfWeek?: DayOfWeek;
      search?: string;
    },
  ) {
    return this.prisma.routine.findMany({
      where: {
        trainerId,
        ...(filters?.studentId && { studentId: filters.studentId }),
        ...(filters?.dayOfWeek && { dayOfWeek: filters.dayOfWeek }),
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
            exercise: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, trainerId: string) {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    if (routine.trainerId !== trainerId) {
      throw new ForbiddenException(
        'You do not have permission to access this routine',
      );
    }

    return routine;
  }

  async update(id: string, trainerId: string, updateDto: UpdateRoutineDto) {
    // Verify ownership
    await this.findOne(id, trainerId);

    // If student is being changed, verify new student
    if (updateDto.studentId) {
      const student = await this.prisma.student.findUnique({
        where: { id: updateDto.studentId },
      });

      if (!student || student.trainerId !== trainerId) {
        throw new BadRequestException(
          'Student not found or does not belong to you',
        );
      }
    }

    // If exercises are being updated
    if (updateDto.exercises) {
      // Delete existing exercises
      await this.prisma.routineExercise.deleteMany({
        where: { routineId: id },
      });

      return this.prisma.routine.update({
        where: { id },
        data: {
          name: updateDto.name,
          description: updateDto.description,
          dayOfWeek: updateDto.dayOfWeek,
          studentId: updateDto.studentId,
          exercises: {
            create: await Promise.all(
              updateDto.exercises.map(async (exerciseDto) => {
                const exercise = await this.prisma.exercise.create({
                  data: {
                    name: exerciseDto.name,
                    description: exerciseDto.description,
                    videoUrl: exerciseDto.videoUrl,
                    imageUrl: exerciseDto.imageUrl,
                  },
                });

                return {
                  exerciseId: exercise.id,
                  order: exerciseDto.order,
                  sets: exerciseDto.sets,
                  repetitions: exerciseDto.repetitions,
                  weight: exerciseDto.weight,
                  duration: exerciseDto.duration,
                  restTime: exerciseDto.restTime,
                  notes: exerciseDto.notes,
                };
              }),
            ),
          },
        },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    }

    // Update only basic fields
    return this.prisma.routine.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        dayOfWeek: updateDto.dayOfWeek,
        studentId: updateDto.studentId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
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

    return this.prisma.routine.delete({
      where: { id },
    });
  }
}
