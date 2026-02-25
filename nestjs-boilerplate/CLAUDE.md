# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS 10 backend API for a training/fitness application. It provides REST endpoints for trainers to manage students, create exercise libraries, design routine templates, and assign personalized workout routines. The application uses Prisma ORM with PostgreSQL for data persistence and JWT for authentication.

## Development Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test
npm run test:e2e
npm run test:cov
```

## Architecture Overview

### Database Layer (Prisma ORM)

The application uses Prisma as the ORM with PostgreSQL:

- **Schema location**: `prisma/schema.prisma`
- **Generated client**: `generated/prisma/` (output directory configured in schema)
- **Migrations**: `prisma/migrations/`
- **Prisma Service**: `src/shared/database/prisma.service.ts` - Global service extending PrismaClient

### Project Structure

```
src/
├── app/                           # Application modules
│   ├── auth/                      # Authentication & authorization
│   │   ├── controllers/           # Auth endpoints (register, login, refresh, logout)
│   │   ├── services/              # Auth business logic
│   │   ├── strategies/            # Passport strategies (JWT)
│   │   ├── guards/                # Route guards (JwtAuthGuard, RolesGuard)
│   │   ├── decorators/            # Custom decorators (@CurrentUser, @Roles, @Public)
│   │   └── dto/                   # Data transfer objects
│   ├── exercise-templates/        # Exercise library for trainers
│   ├── routine-templates/         # Reusable routine templates
│   ├── routines/                  # Assigned routines to students
│   ├── students/                  # Student management
│   └── common/                    # Common features (health check)
├── core/                          # Core configuration
│   ├── configs/                   # Environment config & validation
│   └── models/                    # Core type definitions
├── shared/                        # Shared resources
│   └── database/                  # Prisma service
├── i18n/                          # Internationalization
│   ├── en/                        # English translations
│   └── es/                        # Spanish translations
└── main.ts                        # Application entry point
```

### Module Organization

Each feature module follows this structure:
```
module-name/
├── controllers/                   # REST endpoints
│   └── module-name.controller.ts
├── services/                      # Business logic
│   └── module-name.service.ts
├── dto/                           # Data transfer objects
│   ├── create-module-name.dto.ts
│   ├── update-module-name.dto.ts
│   └── module-name-response.dto.ts
└── module-name.module.ts          # Module definition
```

## Database Schema

### Enums

- **UserRole**: `TRAINER`, `STUDENT`
- **DayOfWeek**: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`
- **Difficulty**: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`

### Core Models

#### User
Base user model with authentication:
- `id` (UUID primary key)
- `email` (unique)
- `password` (hashed with bcrypt)
- `name`
- `role` (UserRole enum)
- `avatar` (optional)
- Relations: `trainerProfile`, `studentProfile`, `refreshTokens`

#### Trainer
Extended profile for trainers:
- `id` (UUID)
- `userId` (one-to-one with User)
- Relations: `students`, `routines`, `routineTemplates`, `exerciseTemplates`

#### Student
Extended profile for students:
- `id` (UUID)
- `userId` (one-to-one with User)
- `trainerId` (belongs to one Trainer)
- `age`, `weight`, `height`, `goal` (optional physical data)
- Relations: `routines`

#### ExerciseTemplate
Reusable exercise in trainer's library:
- `id` (UUID)
- `name`, `description`
- `videoUrl`, `imageUrl` (optional media)
- `category`, `muscleGroup`, `equipment` (optional metadata)
- `difficulty` (Difficulty enum, optional)
- `trainerId` (belongs to one Trainer)
- Relations: `routineTemplateExercises`

#### RoutineTemplate
Reusable routine template:
- `id` (UUID)
- `name`, `description`, `category`
- `trainerId` (belongs to one Trainer)
- `createdAt`, `updatedAt`
- Relations: `exercises` (via RoutineTemplateExercise)

#### RoutineTemplateExercise
Junction table linking routine templates to exercise templates:
- `id` (UUID)
- `routineTemplateId`, `exerciseTemplateId`
- `order` (display order)
- `sets`, `repetitions`, `weight`, `duration`, `restTime`, `notes` (optional parameters)
- Unique constraint on `[routineTemplateId, exerciseTemplateId]`

#### Routine
Assigned routine to a student:
- `id` (UUID)
- `name`, `description`
- `dayOfWeek` (DayOfWeek enum)
- `trainerId`, `studentId`
- `createdAt`, `updatedAt`
- Relations: `exercises` (via RoutineExercise)

#### Exercise
Specific exercise instance in a routine:
- `id` (UUID)
- `name`, `description`
- `videoUrl`, `imageUrl` (optional media)
- Relations: `routineExercises`

#### RoutineExercise
Junction table linking routines to exercises:
- `id` (UUID)
- `routineId`, `exerciseId`
- `order` (display order)
- `sets`, `repetitions`, `weight`, `duration`, `restTime`, `notes` (optional parameters)
- Unique constraint on `[routineId, exerciseId]`

#### RefreshToken
JWT refresh tokens:
- `id` (UUID)
- `token` (unique, indexed)
- `userId`
- `expiresAt`, `createdAt`

## Authentication & Authorization

### JWT Strategy

- **Access tokens**: Short-lived (15 minutes default), stored in client
- **Refresh tokens**: Long-lived (7 days default), stored in database
- **Token payload**: `{ sub: userId, email, role }`

### Guards

1. **JwtAuthGuard** (`src/app/auth/guards/jwt-auth.guard.ts`)
   - Applied globally via `APP_GUARD`
   - Validates JWT access token
   - Respects `@Public()` decorator

2. **RolesGuard** (`src/app/auth/guards/roles.guard.ts`)
   - Applied globally via `APP_GUARD`
   - Checks user role against `@Roles()` decorator
   - Requires `JwtAuthGuard` to run first

### Decorators

- **@Public()**: Marks endpoints as public (no authentication required)
- **@Roles(UserRole[])**: Restricts access to specific roles
- **@CurrentUser()**: Injects authenticated user data into controller method

### Usage Example

```typescript
@Controller('exercise-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TRAINER)
export class ExerciseTemplatesController {
  @Get()
  findAll(@CurrentUser() user: CurrentUserData) {
    return this.service.findAll(user.trainerProfile.id);
  }

  @Public()
  @Get('public')
  getPublicData() {
    return { message: 'No authentication required' };
  }
}
```

## Configuration

### Environment Variables

All environment variables are validated using Joi schema (`src/core/configs/joi-schema.ts`):

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `NODE_PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens

Optional:
- `JWT_EXPIRES_IN` - Access token expiration (default: '15m')
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: '7d')

### Path Aliases

Configured in `tsconfig.json`:
- `@src/*` maps to `src/*`
- `@generated/*` maps to `generated/*`

### Global Modules

- **CoreModule** (`src/core/core.module.ts`): ConfigModule, I18nModule
- **SharedModule** (`src/shared/shared.module.ts`): DatabaseModule (PrismaService)

Both are marked as `@Global()` and imported in AppModule.

## API Versioning

API versioning is enabled with URI versioning:
```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

All endpoints default to `/v1/...` unless specified otherwise.

## Swagger Documentation

Swagger is configured in `src/main.ts` and available at `/docs`:
- Title: "Training App API"
- Bearer authentication configured
- All DTOs decorated with `@ApiProperty()` for documentation

## Validation

Global validation pipe configured in `main.ts`:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,                    // Strip unknown properties
    forbidNonWhitelisted: true,         // Throw error for unknown properties
    transformOptions: {
      enableImplicitConversion: true,   // Auto-convert types
    },
  }),
);
```

All DTOs use class-validator decorators:
- `@IsString()`, `@IsEmail()`, `@IsNumber()`, etc.
- `@IsOptional()` for optional fields
- `@IsEnum()` for enum validation
- `@ValidateNested()` + `@Type()` for nested objects

## Data Flow Examples

### Creating a Routine from Template

1. Trainer creates exercise templates in their library
2. Trainer creates routine template with selected exercises
3. Trainer assigns template to student:
   - `POST /routines/assign-template`
   - Service fetches template with exercises
   - Service creates new Exercise records from ExerciseTemplates
   - Service creates Routine with RoutineExercises linking to new Exercises
4. Student receives personalized routine assigned to a specific day

### Authentication Flow

1. User registers: `POST /auth/register`
   - Password hashed with bcrypt
   - User created with role (TRAINER/STUDENT)
   - Profile created based on role (Trainer or Student)
   - Access + refresh tokens generated
   - Refresh token stored in database

2. User logs in: `POST /auth/login`
   - Credentials validated
   - New tokens generated
   - Old refresh tokens can be invalidated

3. Access token expires:
   - Client sends refresh token to `POST /auth/refresh`
   - Refresh token validated from database
   - New tokens generated
   - Old refresh token deleted, new one stored

4. User logs out: `POST /auth/logout`
   - All refresh tokens for user deleted from database

## Testing

### Unit Tests

Each service and controller should have a corresponding `.spec.ts` file:
- Mock PrismaService for service tests
- Mock services for controller tests
- Test error cases (NotFound, Forbidden, etc.)

### E2E Tests

Located in `test/` directory:
- Test full request/response cycle
- Use test database (configure via TEST_DATABASE_URL)
- Clean database between tests using `prisma.cleanDatabase()`

## Common Patterns

### Service Ownership Validation

All services verify ownership before operations:
```typescript
async findOne(id: string, trainerId: string) {
  const resource = await this.prisma.resource.findUnique({
    where: { id },
  });

  if (!resource) {
    throw new NotFoundException('Resource not found');
  }

  if (resource.trainerId !== trainerId) {
    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  return resource;
}
```

### Filtering & Search

Services accept optional filter objects:
```typescript
async findAll(trainerId: string, filters?: {
  category?: string;
  search?: string;
}) {
  return this.prisma.resource.findMany({
    where: {
      trainerId,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    },
  });
}
```

### Cascade Deletion

Configured at database level using Prisma:
```prisma
model User {
  id              String    @id @default(uuid())
  trainerProfile  Trainer?
  studentProfile  Student?
}

model Trainer {
  id     String @id @default(uuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Deleting a User automatically deletes related Trainer/Student profile.

## Error Handling

Use NestJS built-in HTTP exceptions:
- `NotFoundException` - Resource not found (404)
- `ForbiddenException` - Access denied (403)
- `UnauthorizedException` - Authentication failed (401)
- `ConflictException` - Resource conflict (409)
- `BadRequestException` - Invalid input (400)

## Internationalization

Configured with `nestjs-i18n`:
- Translations in `src/i18n/[lang]/` directories
- Resolved from `lang` header
- Fallback language: `en`

Currently supports:
- English (`en`)
- Spanish (`es`)

## Code Quality

### Linting & Formatting

- **ESLint**: Configured with NestJS recommended rules
- **Prettier**: 120 char line width, single quotes, trailing commas
- **Husky**: Pre-commit hooks for linting and formatting
- **Commitlint**: Enforces conventional commit messages

### Commit Message Format

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `style:` - Code style

## Adding New Features

When adding a new resource module:

1. **Create module structure**:
   ```bash
   nest g module app/resource-name
   nest g controller app/resource-name/controllers/resource-name
   nest g service app/resource-name/services/resource-name
   ```

2. **Define Prisma model** in `prisma/schema.prisma`

3. **Generate migration**:
   ```bash
   npx prisma migrate dev --name add_resource_name
   ```

4. **Create DTOs** in `app/resource-name/dto/`:
   - `create-resource-name.dto.ts`
   - `update-resource-name.dto.ts`
   - `resource-name-response.dto.ts`

5. **Implement service** with CRUD operations and ownership validation

6. **Implement controller** with proper guards and decorators

7. **Add Swagger documentation** to all endpoints and DTOs

8. **Write tests** for service and controller

9. **Update AppModule** to import new module

## Troubleshooting

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Type Errors from @generated/prisma

Ensure `tsconfig.json` includes the alias:
```json
{
  "paths": {
    "@generated/*": ["generated/*"]
  }
}
```

### JWT Type Errors

Cast expiration times to `any` if needed:
```typescript
expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '15m') as any
```

### Database Connection Issues

- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL is running
- Test connection: `npx prisma db pull`

## Dependencies

### Core
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` - NestJS framework
- `@nestjs/config` - Environment configuration
- `@nestjs/swagger` - API documentation

### Database
- `@prisma/client` - Prisma client
- `prisma` (dev) - Prisma CLI
- `pg` - PostgreSQL driver

### Authentication
- `@nestjs/jwt` - JWT utilities
- `@nestjs/passport` - Passport integration
- `passport`, `passport-jwt` - Authentication strategies
- `bcrypt` - Password hashing

### Validation
- `class-validator` - DTO validation
- `class-transformer` - Type transformation
- `joi` - Environment validation

### Internationalization
- `nestjs-i18n` - i18n support

### Development
- `@swc/core`, `@swc/cli` - Fast TypeScript compiler
- `tsc-alias` - Path alias resolution
- `eslint`, `prettier` - Code quality
- `husky`, `lint-staged` - Git hooks
- `@commitlint/*` - Commit message linting

## Best Practices

1. **Always validate user ownership** before operations
2. **Use transactions** for complex multi-step operations
3. **Sanitize user data** before returning (remove passwords, etc.)
4. **Use DTOs** for all input/output
5. **Document all endpoints** with Swagger decorators
6. **Write meaningful error messages**
7. **Keep services thin** - complex logic should be in separate classes
8. **Use dependency injection** for all dependencies
9. **Test edge cases** - null values, empty arrays, unauthorized access
10. **Follow NestJS conventions** - use decorators, providers, modules

## Security Considerations

1. **Passwords**: Always hashed with bcrypt (salt rounds: 10)
2. **JWT Secrets**: Must be strong, random, and secret (change defaults in production!)
3. **Refresh Tokens**: Stored in database, can be revoked
4. **CORS**: Configured to allow all origins in development (restrict in production)
5. **Validation**: All input validated, unknown properties stripped
6. **Rate Limiting**: Should be added for production (not yet implemented)
7. **SQL Injection**: Protected by Prisma's parameterized queries
8. **XSS**: Protected by input validation and output sanitization

## Performance Considerations

1. **Database Indexes**: Added on frequently queried fields (email, tokens)
2. **Eager Loading**: Use `include` in Prisma queries to avoid N+1 problems
3. **Pagination**: Should be added for large datasets (not yet implemented)
4. **Caching**: Should be added for frequently accessed data (not yet implemented)
5. **Connection Pooling**: Managed by Prisma

## Future Enhancements

Potential features to add:
- Rate limiting
- Pagination for list endpoints
- File upload for exercise media
- Email notifications
- Password reset flow
- User avatar upload
- Routine progress tracking
- Exercise history/analytics
- Social features (sharing routines)
- Mobile app support (separate module)

---

Last updated: 2025-10-10
