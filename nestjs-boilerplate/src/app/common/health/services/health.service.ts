import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class HealthService {
  constructor(private readonly i18nService: I18nService) {}

  getHealth(): string {
    return this.i18nService.t('common.works');
  }
}
