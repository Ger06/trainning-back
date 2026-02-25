import { registerAs } from '@nestjs/config';

import { Environment } from '@src/core/models/environment.model';

export default registerAs('configs', (): Environment => {
  return {
    nodeEnv: process.env.NODE_ENV,
    nodePort: Number(process.env.NODE_PORT),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
});
