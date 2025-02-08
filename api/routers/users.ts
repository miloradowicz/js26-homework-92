import express from 'express';
import { Error } from 'mongoose';
import assert from 'assert';

import { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { imageUpload } from '../middleware/multer';
import User from '../models/User';

const router = express.Router();

router.post('/', imageUpload.single('avatar'), async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username ?? null,
      password: req.body.password ?? null,
      displayName: req.body.displayName ?? null,
      avatarUrl: req.file?.filename ?? null,
    });

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return void res.status(400).send(e);
    }

    next(e);
  }
});

router.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return void res.status(401).send({
        errors: {
          username: { name: 'username', message: 'User not found.' },
        },
      });
    }

    if (!(await user.checkPassword(req.body.password))) {
      return void res.status(401).send({
        errors: {
          password: { name: 'password', message: 'Incorrect password.' },
        },
      });
    }

    user.generateToken();
    await user.save();

    return void res.send({ user });
  } catch (e) {
    if (e instanceof Error) {
      return void res.status(400).send({ error: e.message });
    }

    next(e);
  }
});

router.delete('/sessions', permit('user', 'moderator'), async (_req, res) => {
  const req = _req as RequestWithUser;

  assert(req.user);

  const user = await User.findById(req.user._id);

  assert(user);

  user.clearToken();
  await user.save();

  res.send({ user: null });
});

export default router;
