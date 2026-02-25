import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { HealthService } from '../services/health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthServiceMock: Partial<HealthService>;

  beforeEach(async () => {
    healthServiceMock = {
      getHealth: jest.fn().mockReturnValue('It works!'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        { provide: HealthService, useValue: healthServiceMock },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('root', () => {
    it('should be response', () => {
      expect(controller.getHealth().code).toBe(200);
      expect(controller.getHealth().message).toBe('It works!');
      expect(controller.getHealth().data).toBe(null);
    });
  });
});
