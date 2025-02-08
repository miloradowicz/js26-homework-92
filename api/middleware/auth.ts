import { NextFunction, Request, Response } from 'express';
import * as core from 'express-serve-static-core';

import User, { Fields as UserFields } from '../models/User';

export interface RequestWithUser<T = core.ParamsDictionary> extends Request<T> {
  user: UserFields | null;
}

const auth = async (_req: Request, res: Response, next: NextFunction) => {
  const req = _req as RequestWithUser;
  const token = req.get('Authorization');

  if (!token) {
    return void next();
  }

  const user = await User.findOne({ token });

  req.user = user ?? null;

  next();
};

export default auth;
