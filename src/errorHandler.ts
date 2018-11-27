import { NextFunction, Request, Response } from 'express';

import { logger } from './logger';

export async function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (logger) {
    logger.error('Error on route ', req.path);
    logger.error('Error: ', err);
  }
  res.status(500).send({ error: err.message || err });
}
