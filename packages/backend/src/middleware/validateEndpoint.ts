import { Request, Response, NextFunction } from 'express';

type Schema = { body?: unknown; query?: unknown; params?: unknown };

type Handler = (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>;

export const validateEndpoint = (schema?: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: add real validation (zod/yup/joi). For now, pass-through.
    return next();
  };
};

export type Endpoint = {
  schema?: Schema;
  handler: Handler;
};
