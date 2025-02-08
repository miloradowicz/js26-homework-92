import mongoose from 'mongoose';
import User from './User';

const schema = new mongoose.Schema(
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
      type: String,
      default: null,
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await User.findById(value)),
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

export default mongoose.model('User', schema);
