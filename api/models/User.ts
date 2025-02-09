import mongoose, { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import config from '../config';

export interface Fields {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  token: string | null;
}

interface Methods {
  checkPassword(_: string): Promise<boolean>;
  clearToken(): void;
  generateToken(): void;
}

type Model = mongoose.Model<Fields, void, Methods>;

const schema = new mongoose.Schema<HydratedDocument<Fields>, Model, Methods>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<Fields>, value: string): Promise<boolean> {
          return !this.isModified('username') || !(await User.findOne({ username: value }));
        },
        message: 'Username already occupied',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['member', 'moderator'],
      required: [true, 'Role is required'],
      default: 'member',
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    strict: 'throw',
    versionKey: false,
  },
);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.saltWorkFactor);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
});

schema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

schema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

schema.methods.clearToken = function () {
  this.token = null;
};

schema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = mongoose.model<HydratedDocument<Fields>, Model>('User', schema);

export default User;
