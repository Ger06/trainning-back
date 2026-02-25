import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

import config from '@src/core/configs/config';
import { environment } from './configs/environment';
import joiSchema from './configs/joi-schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environment[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [config],
      validationSchema: joiSchema,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      logging: true,
      loaderOptions: {
        path: path.join(__dirname, '../i18n'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['lang'])],
    }),
  ],
  exports: [ConfigModule, I18nModule],
})
export class CoreModule {}
