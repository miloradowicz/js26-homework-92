import { NextFunction, Request, Response } from 'express';

import { RequestWithUser } from './auth';

const permit = (...roles: string[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const req = _req as RequestWithUser;

    if (!req.user) {
      return void res.status(401).send('Unauthenticated');
    }

    if (!roles.includes(req.user.role)) {
      return void res.status(403).send('Unauthorized');
    }

    next();
  };
};

export default permit;
