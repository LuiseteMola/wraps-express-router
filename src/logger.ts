import { Logger } from 'wraps-logger';
export let logger: Logger;

export function configureLogger(customLogger: Logger) {
  logger = customLogger;
}
