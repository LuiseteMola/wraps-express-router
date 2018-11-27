import { RequestHandlerParams } from 'express-serve-static-core';

export type AvailableMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'ALL';

export interface RouteMethods {
  path: string;
  app: RequestHandlerParams;
}

export interface RouteList extends RouteMethods {
  method: AvailableMethods;
}
