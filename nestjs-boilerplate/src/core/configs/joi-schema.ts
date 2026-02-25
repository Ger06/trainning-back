import * as joi from 'joi';

const joiSchema = joi.object({
  NODE_ENV: joi.string().required(),
  NODE_PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().default('15m'),
  JWT_REFRESH_SECRET: joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
});

export default joiSchema;
