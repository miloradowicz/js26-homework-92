import express from 'express';
import expressWs from 'express-ws';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import auth from './middleware/auth';
import users from './routers/users';
import chat, { mount } from './routers/chat';
import permit from './middleware/permit';

const app = express();
expressWs(app);
mount();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(auth);

app.use('/users', users);
app.use('/chat', chat);

(async () => {
  await mongoose.connect(new URL(config.mongo.db, config.mongo.host).href);

  app.listen(config.express.port, () => {
    console.log(`Server ready on port http://localhost:${config.express.port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
})().catch(console.error);
