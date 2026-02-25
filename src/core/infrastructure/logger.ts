import { createLogger, format, transports } from 'winston';

const instance = createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format:
    process.env.NODE_ENV !== 'production'
      ? format.combine(format.colorize(), format.simple())
      : format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

export class Logger {
  static info(message: string, meta?: object): void {
    instance.info(message, meta);
  }
  static warn(message: string, meta?: object): void {
    instance.warn(message, meta);
  }
  static error(message: string, meta?: object): void {
    instance.error(message, meta);
  }
}
