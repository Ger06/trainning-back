import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@src/shared/database/prisma.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { UserRole } from '@generated/prisma';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(trainerId: string, createDto: CreateStudentDto) {
    const { email, password, name, age, weight, height, goal } = createDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with student profile
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.STUDENT,
        studentProfile: {
          create: {
            trainerId,
            age,
            weight,
            height,
            goal,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return this.sanitizeStudent(user);
  }

  async findAll(trainerId: string, filters?: { search?: string }) {
    const students = await this.prisma.student.findMany({
      where: {
        trainerId,
        ...(filters?.search && {
          user: {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { email: { contains: filters.search, mode: 'insensitive' } },
            ],
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    return students;
  }

  async findOne(id: string, trainerId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        routines: {
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
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.trainerId !== trainerId) {
      throw new ForbiddenException(
        'You do not have permission to access this student',
      );
    }

    return student;
  }

  async update(id: string, trainerId: string, updateDto: UpdateStudentDto) {
    // Verify ownership
    const student = await this.findOne(id, trainerId);

    // Update user name if provided
    if (updateDto.name) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: { name: updateDto.name },
      });
    }

    // Update student profile
    const updatedStudent = await this.prisma.student.update({
      where: { id },
      data: {
        age: updateDto.age,
        weight: updateDto.weight,
        height: updateDto.height,
        goal: updateDto.goal,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return updatedStudent;
  }

  async remove(id: string, trainerId: string) {
    // Verify ownership
    const student = await this.findOne(id, trainerId);

    // Delete the user (cascade will delete student profile)
    await this.prisma.user.delete({
      where: { id: student.userId },
    });

    return { message: 'Student deleted successfully' };
  }

  private sanitizeStudent(user: any) {
    return {
      id: user.studentProfile.id,
      userId: user.id,
      trainerId: user.studentProfile.trainerId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      age: user.studentProfile.age,
      weight: user.studentProfile.weight,
      height: user.studentProfile.height,
      goal: user.studentProfile.goal,
    };
  }
}
