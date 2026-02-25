import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthService } from './../services/health.service';
import { Routing } from '@src/core/models/routing.model';
import { HttpResponse } from '@src/core/models/http-response.model';

@ApiTags('health')
@Controller(`${Routing.COMMON}/health`)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({ summary: 'Health Check' })
  @Get()
  getHealth(): HttpResponse {
    const data = this.healthService.getHealth();
    return {
      code: 200,
      message: data,
      data: null,
    };
  }
}
