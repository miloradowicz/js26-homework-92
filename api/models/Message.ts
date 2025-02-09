import mongoose from 'mongoose';
import User from './User';

export interface Fields {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recepient?: mongoose.Types.ObjectId;
  message: string;
}

const schema = new mongoose.Schema<Fields>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Sender is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await User.findById(value)),
        message: 'User not found',
      },
    },
    recepient: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      validate: {
        validator: async (value: mongoose.Types.ObjectId) =>
          value === null || value === undefined || !!(await User.findById(value)),
        message: 'User not found',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
  },
  {
    strict: 'throw',
    versionKey: false,
  },
);

export default mongoose.model('Message', schema);
