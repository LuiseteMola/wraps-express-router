import { ErrorRequestHandler, Express } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import * as util from 'util';
import { Logger } from 'wraps-logger';

import { errorHandler } from './errorHandler';
import { AvailableMethods, RouteList, RouteMethods } from './interfaces';
import { configureLogger, logger } from './logger';

interface RouteHandlerOptions {
  logger?: Logger;
  errorHandler?: ErrorRequestHandler;
}

export class RouteHandler {
  private routes: Array<RouteList> = [];
  private errorHandler: ErrorRequestHandler = errorHandler;

  constructor(opts: RouteHandlerOptions = {}) {
    if (opts.logger) configureLogger(opts.logger);
    if (opts.errorHandler) this.errorHandler = opts.errorHandler;
  }

  public add(method: AvailableMethods, route: RouteMethods): number;
  public add(method: AvailableMethods, path: string, app: RequestHandlerParams): number;
  public add(method: AvailableMethods, routeOrPath: RouteMethods | string, app?: RequestHandlerParams) {
    if (typeof routeOrPath === 'string') return this.addRoute(method, { path: routeOrPath, app: app });
    return this.addRoute(method, routeOrPath);
  }

  public publish(app: Express): void {
    this.routes.map(route => this.publishRoute(app, route));
    if (this.errorHandler) app.use(this.errorHandler);
  }

  private log(message: string, ...payload: any) {
    if (logger) logger.info(message, ...payload);
  }

  private addRoute(method: AvailableMethods, route: RouteMethods): number {
    return this.routes.push({
      app: route.app,
      method: method,
      path: route.path,
    });
  }

  private publishRoute(app: Express, route: RouteList) {
    const wrappedApp = route.app; // this.wrap(route.app);
    this.log(`Publishing route: ${route.method}: ${route.path} -> ${util.inspect(route.app)}`);
    switch (route.method) {
      case 'GET':
        return app.get(route.path, wrappedApp);
      case 'POST':
        return app.post(route.path, wrappedApp);
      case 'PUT':
        return app.put(route.path, wrappedApp);
      case 'DELETE':
        return app.delete(route.path, wrappedApp);
      case 'ALL':
        return app.use(route.path, wrappedApp);
      default:
        throw new Error('ERRINVALIDMETHOD');
    }
  }
}
