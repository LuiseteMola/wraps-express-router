export const asyncWrapper = (app: any) => (...args: any) => app(...args).catch(args[2]);

export { errorHandler } from './errorHandler';
export { RouteHandler } from './RouteHandler';
