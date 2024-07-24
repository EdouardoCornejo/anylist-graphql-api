import { ConsoleLogger, LoggerService } from '@nestjs/common';

/**
 * The CustomLoggerService class is a custom
 * implementation of the LoggerService interface.
 * It extends the ConsoleLogger class provided by NestJS.
 */
export class CustomLoggerService
  extends ConsoleLogger
  implements LoggerService
{
  /**
   * The constructor initializes the CustomLoggerService class.
   */
  constructor() {
    super();
  }

  /**
   * The log method logs a message to the console.
   * It prepends the message with a custom prefix.
   */
  log(message: any, ...optionalParams: any[]) {
    const formattedMessage = `[CustomLogger] ${message}`;
    super.log(formattedMessage, ...optionalParams);
  }

  /**
   * The error method logs an error message to the console.
   * It prepends the message with a custom prefix.
   * @param message The error message to log.
   * @param optionalParams Additional parameters to log.
   * These parameters are optional.
   */
  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
  }

  /**
   * The fatal method logs a fatal error message to the console.
   * It prepends the message with a custom prefix.
   * @param message The fatal error message to log.
   * @param optionalParams Additional parameters to log.
   * These parameters are optional.
   */
  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(message, ...optionalParams);
  }

  /**
   * The warn method logs a warning message to the console.
   * It prepends the message with a custom prefix.
   * @param message The warning message to log.
   * @param optionalParams Additional parameters to log.
   * These parameters are optional.
   */
  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }

  /**
   * The debug method logs a debug message to the console.
   * It prepends the message with a custom prefix.
   * @param message The debug message to log.
   * @param optionalParams Additional parameters to log.
   * These parameters are optional.
   */
  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }

  /**
   * The verbose method logs a verbose message to the console.
   * It prepends the message with a custom prefix.
   * @param message The verbose message to log.
   * @param optionalParams Additional parameters to log.
   * These parameters are optional.
   */
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
  }
}
