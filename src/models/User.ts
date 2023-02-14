import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin?: boolean;
}

const userSchema: Schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.index({userSchema:1})

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
