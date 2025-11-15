import { Request, Response, NextFunction } from 'express';

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  // TODO: plug real JWT verification here
  // For now, pass through for all requests in development
  return next();
};
