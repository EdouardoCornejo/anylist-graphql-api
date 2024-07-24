/**
 * This file is used to get the environment variables from the .env file.
 * The environment variables are used to connect to the database.
 */
export const EnvConfig = () => ({
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUserName: process.env.DB_USER_NAME,
});
