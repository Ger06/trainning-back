import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { I18nService } from 'nestjs-i18n';

describe('HealthService', () => {
  let service: HealthService;
  let i18nServiceMock: Partial<I18nService>;

  beforeEach(async () => {
    i18nServiceMock = {
      t: jest.fn().mockReturnValue('It works!'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: I18nService, useValue: i18nServiceMock },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be "It works!"', () => {
    expect(service.getHealth()).toBe('It works!');
  });
});
