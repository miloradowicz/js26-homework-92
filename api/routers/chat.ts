import express from 'express';

const router = express.Router();

export const mount = () => {
  router.ws('/', async (ws, req) => {
    try {
      console.log('head');
      console.log(req.body);
      ws.send('connected');

      ws.on('message', async (ws) => {
        console.log('message');
      });

      ws.on('close', async (ws) => {
        console.log('closed');
      });
    } finally {
      console.log('exited');
    }
  });
};

export default router;
