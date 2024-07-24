import * as Joi from 'joi';

/**
 * Joi validation schema for the environment variables
 * that are used to connect to the database.
 */
export const JoiValidationSchema = Joi.object({
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER_NAME: Joi.string().default('postgres'),
});
