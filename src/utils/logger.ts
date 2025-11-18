import pc from 'picocolors';
import type { Logger } from '../types/index.js';

/**
 * Log levels
 */
export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error' | 'silent';

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
}

/**
 * Create a logger instance with the specified configuration
 */
export function createLogger(config: LoggerConfig = { level: 'info' }): Logger {
  const logLevels: Record<LogLevel, number> = {
    silent: 0,
    error: 1,
    warn: 2,
    success: 3,
    info: 4,
    debug: 5,
  };

  const currentLevel = logLevels[config.level] ?? logLevels.info;

  const shouldLog = (level: LogLevel): boolean => {
    return logLevels[level] !== undefined && logLevels[level] <= currentLevel;
  };

  const formatMessage = (message: string): string => {
    return config.prefix ? `${config.prefix} ${message}` : message;
  };

  return {
    debug: (message: string) => {
      if (shouldLog('debug')) {
        console.log(pc.gray(`[DEBUG] ${formatMessage(message)}`));
      }
    },

    info: (message: string) => {
      if (shouldLog('info')) {
        console.log(pc.blue(`ℹ ${formatMessage(message)}`));
      }
    },

    success: (message: string) => {
      if (shouldLog('success')) {
        console.log(pc.green(`✓ ${formatMessage(message)}`));
      }
    },

    warn: (message: string) => {
      if (shouldLog('warn')) {
        console.warn(pc.yellow(`⚠ ${formatMessage(message)}`));
      }
    },

    error: (message: string) => {
      if (shouldLog('error')) {
        console.error(pc.red(`✖ ${formatMessage(message)}`));
      }
    },
  };
}

/**
 * Default logger instance
 */
export const logger = createLogger();
