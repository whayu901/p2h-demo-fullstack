import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Accepts an incoming `x-request-id` header or generates one, attaches it to
 * `req.requestId`, echoes it back on the response, and logs the request with
 * it in the log context — enough to correlate a client report with server
 * logs without pulling in a dedicated logging library.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = req.header(REQUEST_ID_HEADER) || randomUUID();
    req.requestId = requestId;
    res.setHeader(REQUEST_ID_HEADER, requestId);
    this.logger.log(`${req.method} ${req.originalUrl} [${requestId}]`);
    next();
  }
}
