import mongoose from 'mongoose';
import { fakerRU as faker } from '@faker-js/faker';

import config from './config';
import User from './models/User';
import Message from './models/Message';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min);

(async () => {
  await mongoose.connect(new URL(config.mongo.db, config.mongo.host).href);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users').catch(() => {
      console.log('skipping users...');
    });
    await db.dropCollection('messages').catch(() => {
      console.log('skipping messages...');
    });

    const u = await User.create(
      {
        username: 'admin',
        password: '1111',
        displayName: faker.person.fullName(),
        avatarUrl: faker.image.avatar(),
        role: 'moderator',
      },
      {
        username: 'user1',
        password: '2222',
        displayName: faker.person.fullName(),
        avatarUrl: '_avatar-2.jpg',
      },
      {
        username: 'user2',
        password: '3333',
        displayName: faker.person.fullName(),
        avatarUrl: '_avatar-3.jpg',
      },
      {
        username: 'user3',
        password: '4444',
        displayName: faker.person.fullName(),
        avatarUrl: faker.image.avatar(),
      },
    );

    await Message.create(
      ...Array.from({ length: 50 }).map(() => {
        const sender = u[randomInt(0, 3)]._id;
        const recepient = !randomInt(0, 3) ? u[randomInt(0, 3)]._id : undefined;

        const m: { sender: mongoose.Types.ObjectId; recepient?: mongoose.Types.ObjectId; message: string } = {
          sender,
          recepient: !recepient?.equals(sender) ? recepient : undefined,
          message: faker.lorem.sentence(),
        };

        return m;
      }),
    );
  } finally {
    await db.close();
  }
})()
  .then(() => console.log('fixtures created'))
  .catch(console.error);
