import { createLogger, format, transports } from 'winston';

const instance = createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format:
    process.env.NODE_ENV !== 'production'
      ? format.combine(format.colorize(), format.simple())
      : format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

function interpolate(message: string, params?: unknown[]): string {
  if (!params?.length) return message;
  let i = 0;
  return message.replace(/\{\}/g, () => String(params[i++] ?? ''));
}

export class Logger {
  static info(message: string, params?: unknown[]): void {
    instance.info(interpolate(message, params));
  }
  static warn(message: string, params?: unknown[]): void {
    instance.warn(interpolate(message, params));
  }
  static error(message: string, params?: unknown[]): void {
    instance.error(interpolate(message, params));
  }
}
